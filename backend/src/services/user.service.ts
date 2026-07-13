import prisma from '../config/database';
import { AppError } from '../middleware/error';
import { HTTP_STATUS, ROLE_HIERARCHY } from '../constants';
import { createAuditLog } from '../audit';
import { paginatedMeta } from '../utils/response';
import type { PaginationQuery } from '../types';
import type {
  CreateUserInput,
  UpdateUserInput,
  ChangeRoleInput,
  ChangeStatusInput,
  ProfileUpdateInput,
} from '../validators/user.schema';
import { Prisma, UserStatus } from '@prisma/client';

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatar: true,
  role: true,
  status: true,
  employeeId: true,
  designation: true,
  departmentId: true,
  managerId: true,
  emailVerified: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

const USER_SELECT_WITH_DEPARTMENT = {
  ...USER_SELECT,
  department: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  manager: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} as const;

export const UserService = {
  async getAll(query: PaginationQuery & { role?: string; departmentId?: string; status?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { employeeId: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (query.role) {
      where.role = query.role as any;
    }

    if (query.departmentId) {
      where.departmentId = query.departmentId;
    }

    if (query.status) {
      where.status = query.status as UserStatus;
    }

    const allowedSortFields = [
      'firstName',
      'lastName',
      'email',
      'role',
      'status',
      'createdAt',
      'updatedAt',
      'employeeId',
    ];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [users, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        select: USER_SELECT_WITH_DEPARTMENT,
        orderBy: { [finalSortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      meta: paginatedMeta(totalItems, page, limit),
    };
  },

  async getById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        ...USER_SELECT_WITH_DEPARTMENT,
        _count: {
          select: {
            directReports: true,
            allocatedAssets: true,
            bookings: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    return user;
  },

  async getByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: USER_SELECT_WITH_DEPARTMENT,
    });

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    return user;
  },

  async create(data: CreateUserInput, createdByUserId: string) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existingEmail) {
      throw new AppError('A user with this email already exists', HTTP_STATUS.CONFLICT);
    }

    if (data.employeeId) {
      const existingEmployeeId = await prisma.user.findFirst({
        where: { employeeId: data.employeeId, deletedAt: null },
      });

      if (existingEmployeeId) {
        throw new AppError('A user with this employee ID already exists', HTTP_STATUS.CONFLICT);
      }
    }

    if (data.departmentId) {
      const department = await prisma.department.findFirst({
        where: { id: data.departmentId, deletedAt: null },
      });

      if (!department) {
        throw new AppError('Department not found', HTTP_STATUS.NOT_FOUND);
      }
    }

    if (data.managerId) {
      const manager = await prisma.user.findFirst({
        where: { id: data.managerId, deletedAt: null },
      });

      if (!manager) {
        throw new AppError('Manager not found', HTTP_STATUS.NOT_FOUND);
      }
    }

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone,
        role: data.role,
        status: 'PENDING_VERIFICATION',
        employeeId: data.employeeId,
        designation: data.designation,
        departmentId: data.departmentId,
        managerId: data.managerId,
        createdBy: createdByUserId,
      },
      select: USER_SELECT,
    });

    await createAuditLog({
      userId: createdByUserId,
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      newValues: { email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });

    return user;
  },

  async update(id: string, data: UpdateUserInput, updatedByUserId: string, ipAddress?: string, userAgent?: string) {
    const existing = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    if ('email' in data && data.email) {
      const emailConflict = await prisma.user.findFirst({
        where: { email: (data as any).email.toLowerCase().trim(), id: { not: id }, deletedAt: null },
      });

      if (emailConflict) {
        throw new AppError('A user with this email already exists', HTTP_STATUS.CONFLICT);
      }
    }

    if (data.employeeId) {
      const employeeIdConflict = await prisma.user.findFirst({
        where: { employeeId: data.employeeId, id: { not: id }, deletedAt: null },
      });

      if (employeeIdConflict) {
        throw new AppError('A user with this employee ID already exists', HTTP_STATUS.CONFLICT);
      }
    }

    if (data.departmentId) {
      const department = await prisma.department.findFirst({
        where: { id: data.departmentId, deletedAt: null },
      });

      if (!department) {
        throw new AppError('Department not found', HTTP_STATUS.NOT_FOUND);
      }
    }

    if (data.managerId) {
      const manager = await prisma.user.findFirst({
        where: { id: data.managerId, deletedAt: null },
      });

      if (!manager) {
        throw new AppError('Manager not found', HTTP_STATUS.NOT_FOUND);
      }

      if (data.managerId === id) {
        throw new AppError('A user cannot be their own manager', HTTP_STATUS.BAD_REQUEST);
      }
    }

    const oldValues = {
      firstName: existing.firstName,
      lastName: existing.lastName,
      phone: existing.phone,
      employeeId: existing.employeeId,
      designation: existing.designation,
      departmentId: existing.departmentId,
      managerId: existing.managerId,
    };

    const updateData: Prisma.UserUpdateInput = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
    if (data.lastName !== undefined) updateData.lastName = data.lastName.trim();
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.employeeId !== undefined) updateData.employeeId = data.employeeId;
    if (data.designation !== undefined) updateData.designation = data.designation;
    if (data.departmentId !== undefined) {
      updateData.department = data.departmentId
        ? { connect: { id: data.departmentId } }
        : { disconnect: true };
    }
    if (data.managerId !== undefined) {
      updateData.manager = data.managerId
        ? { connect: { id: data.managerId } }
        : { disconnect: true };
    }

    updateData.updatedBy = updatedByUserId;
    updateData.version = { increment: 1 };

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: USER_SELECT_WITH_DEPARTMENT,
    });

    const newValues: Record<string, unknown> = {};
    for (const key of Object.keys(data) as Array<keyof UpdateUserInput>) {
      if (data[key] !== undefined) {
        newValues[key] = data[key];
      }
    }

    await createAuditLog({
      userId: updatedByUserId,
      action: 'UPDATE',
      entity: 'User',
      entityId: id,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
    });

    return updated;
  },

  async updateProfile(id: string, data: ProfileUpdateInput) {
    const existing = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
    if (data.lastName !== undefined) updateData.lastName = data.lastName.trim();
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    updateData.version = { increment: 1 };

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: USER_SELECT,
    });

    return updated;
  },

  async changeRole(
    id: string,
    data: ChangeRoleInput,
    performedByUserId: string,
    performedByRole: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const target = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!target) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    const currentPerformerLevel = ROLE_HIERARCHY[performedByRole] || 0;
    const currentTargetLevel = ROLE_HIERARCHY[target.role] || 0;
    const newTargetLevel = ROLE_HIERARCHY[data.role] || 0;

    if (currentTargetLevel >= currentPerformerLevel && performedByRole !== 'SUPER_ADMIN') {
      throw new AppError(
        'You cannot change the role of a user with equal or higher privileges',
        HTTP_STATUS.FORBIDDEN
      );
    }

    if (newTargetLevel >= currentPerformerLevel && performedByRole !== 'SUPER_ADMIN') {
      throw new AppError(
        'You cannot assign a role equal to or higher than your own',
        HTTP_STATUS.FORBIDDEN
      );
    }

    if (target.id === performedByUserId) {
      throw new AppError('You cannot change your own role', HTTP_STATUS.FORBIDDEN);
    }

    const privilegedRoles = ['ADMIN', 'DEPARTMENT_MANAGER'];
    if (privilegedRoles.includes(data.role) && performedByRole !== 'SUPER_ADMIN') {
      throw new AppError(
        'Only a Super Admin can assign Admin or Department Manager roles',
        HTTP_STATUS.FORBIDDEN
      );
    }

    const oldRole = target.role;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        role: data.role,
        updatedBy: performedByUserId,
        version: { increment: 1 },
      },
      select: USER_SELECT_WITH_DEPARTMENT,
    });

    await createAuditLog({
      userId: performedByUserId,
      action: 'CHANGE_ROLE',
      entity: 'User',
      entityId: id,
      oldValues: { role: oldRole },
      newValues: { role: data.role },
      ipAddress,
      userAgent,
    });

    return updated;
  },

  async changeStatus(
    id: string,
    data: ChangeStatusInput,
    performedByUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const target = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!target) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    if (target.id === performedByUserId) {
      throw new AppError('You cannot change your own status', HTTP_STATUS.FORBIDDEN);
    }

    if (target.role === 'SUPER_ADMIN' && data.status === 'SUSPENDED') {
      throw new AppError('Cannot suspend a Super Admin user', HTTP_STATUS.FORBIDDEN);
    }

    const oldStatus = target.status;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        status: data.status as UserStatus,
        updatedBy: performedByUserId,
        version: { increment: 1 },
      },
      select: USER_SELECT_WITH_DEPARTMENT,
    });

    await createAuditLog({
      userId: performedByUserId,
      action: 'CHANGE_STATUS',
      entity: 'User',
      entityId: id,
      oldValues: { status: oldStatus },
      newValues: { status: data.status },
      ipAddress,
      userAgent,
    });

    return updated;
  },

  async delete(id: string, performedByUserId: string, ipAddress?: string, userAgent?: string) {
    const existing = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    if (existing.role === 'SUPER_ADMIN') {
      throw new AppError('Cannot delete a Super Admin user', HTTP_STATUS.FORBIDDEN);
    }

    if (existing.id === performedByUserId) {
      throw new AppError('You cannot delete your own account', HTTP_STATUS.FORBIDDEN);
    }

    const hasActiveAllocations = await prisma.allocation.findFirst({
      where: {
        userId: id,
        status: 'ACTIVE',
      },
    });

    if (hasActiveAllocations) {
      throw new AppError(
        'Cannot delete user with active asset allocations. Please return all assets first.',
        HTTP_STATUS.CONFLICT
      );
    }

    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: performedByUserId,
        status: 'INACTIVE',
        version: { increment: 1 },
      },
    });

    await prisma.session.updateMany({
      where: { userId: id, isActive: true },
      data: { isActive: false },
    });

    await createAuditLog({
      userId: performedByUserId,
      action: 'DELETE',
      entity: 'User',
      entityId: id,
      oldValues: { email: existing.email, role: existing.role, status: existing.status },
      ipAddress,
      userAgent,
    });

    return { id };
  },

  async getDirectReports(managerId: string) {
    const manager = await prisma.user.findFirst({
      where: { id: managerId, deletedAt: null },
    });

    if (!manager) {
      throw new AppError('Manager not found', HTTP_STATUS.NOT_FOUND);
    }

    const reports = await prisma.user.findMany({
      where: {
        managerId,
        deletedAt: null,
      },
      select: {
        ...USER_SELECT,
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            allocatedAssets: true,
          },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    return reports;
  },
};
