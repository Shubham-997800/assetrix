import { hash, compare } from "bcryptjs";
import { Prisma, UserStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError, paginatedMeta } from "../../utils/response";
import { ALLOCATION_STATUS, HTTP_STATUS, ROLES, USER_STATUS } from "../../constants";
import { createAuditLog } from "../shared/audit";
import { createActivityLog } from "../shared/activity";
import { sendEmail, emailTemplate } from "../shared/email";
import { buildWhereSearch, getPagination } from "../shared/pagination";
import type { PaginationQuery } from "../../types";
import type {
  ChangeStatusInput,
  CreateUserInput,
  ProfileUpdateInput,
  UpdateUserInput,
} from "./validators";

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

export interface GetAllUsersParams extends PaginationQuery {
  departmentId?: string;
  status?: string;
}

const resolveOwnerId = async (userId: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { ownerId: true },
  });
  return user?.ownerId ?? userId;
};

export const getAll = async (query: GetAllUsersParams, requesterId: string) => {
  const { page, limit, skip, sortBy, sortOrder } = getPagination(query);

  const ownerId = await resolveOwnerId(requesterId);

  const where: Prisma.UserWhereInput = { deletedAt: null, ownerId };

  const searchWhere = buildWhereSearch(
    ["firstName", "lastName", "email", "employeeId"],
    query.search?.trim()
  );
  if (searchWhere.OR) Object.assign(where, searchWhere);

  if (query.departmentId) {
    where.departmentId = query.departmentId;
  }

  if (query.status) {
    where.status = query.status as UserStatus;
  }

  const allowedSortFields = [
    "firstName",
    "lastName",
    "email",
    "role",
    "status",
    "createdAt",
    "updatedAt",
    "employeeId",
  ];
  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

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
};

export const getById = async (id: string, requesterId: string) => {
  const ownerId = await resolveOwnerId(requesterId);

  const user = await prisma.user.findFirst({
    where: { id, ownerId, deletedAt: null },
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
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

export const getByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: USER_SELECT_WITH_DEPARTMENT,
  });

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

export const create = async (data: CreateUserInput, createdByUserId: string) => {
  const ownerId = await resolveOwnerId(createdByUserId);

  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });

  if (existingEmail) {
    throw new AppError("A user with this email already exists", HTTP_STATUS.CONFLICT);
  }

  if (data.employeeId) {
    const existingEmployeeId = await prisma.user.findFirst({
      where: { employeeId: data.employeeId, ownerId, deletedAt: null },
    });

    if (existingEmployeeId) {
      throw new AppError("A user with this employee ID already exists", HTTP_STATUS.CONFLICT);
    }
  }

  if (data.departmentId) {
    const department = await prisma.department.findFirst({
      where: { id: data.departmentId, ownerId, deletedAt: null },
    });

    if (!department) {
      throw new AppError("Department not found", HTTP_STATUS.NOT_FOUND);
    }
  }

  if (data.managerId) {
    const manager = await prisma.user.findFirst({
      where: { id: data.managerId, ownerId, deletedAt: null },
    });

    if (!manager) {
      throw new AppError("Manager not found", HTTP_STATUS.NOT_FOUND);
    }
  }

  const hashedPassword = await hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone,
      role: ROLES.ADMIN,
      status: USER_STATUS.PENDING_VERIFICATION,
      employeeId: data.employeeId,
      designation: data.designation,
      departmentId: data.departmentId,
      managerId: data.managerId,
      ownerId,
      createdBy: createdByUserId,
    },
    select: USER_SELECT,
  });

  await createAuditLog({
    userId: createdByUserId,
    action: "CREATE",
    entity: "User",
    entityId: user.id,
    newValues: { email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
  });

  await sendEmail({
    to: user.email,
    subject: "Welcome to Assetrix",
    html: emailTemplate(
      "Welcome to Assetrix!",
      `<p>Hi ${user.firstName},</p><p>Your account has been created. Here is your temporary password:</p><p><strong>${data.password}</strong></p><p>Please sign in and change your password.</p>`
    ),
  });

  return user;
};

export const update = async (
  id: string,
  data: UpdateUserInput,
  updatedByUserId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const ownerId = await resolveOwnerId(updatedByUserId);

  const existing = await prisma.user.findFirst({
    where: { id, ownerId, deletedAt: null },
  });

  if (!existing) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  if (data.employeeId) {
    const employeeIdConflict = await prisma.user.findFirst({
      where: { employeeId: data.employeeId, ownerId, id: { not: id }, deletedAt: null },
    });

    if (employeeIdConflict) {
      throw new AppError("A user with this employee ID already exists", HTTP_STATUS.CONFLICT);
    }
  }

  if (data.departmentId) {
    const department = await prisma.department.findFirst({
      where: { id: data.departmentId, ownerId, deletedAt: null },
    });

    if (!department) {
      throw new AppError("Department not found", HTTP_STATUS.NOT_FOUND);
    }
  }

  if (data.managerId) {
    const manager = await prisma.user.findFirst({
      where: { id: data.managerId, ownerId, deletedAt: null },
    });

    if (!manager) {
      throw new AppError("Manager not found", HTTP_STATUS.NOT_FOUND);
    }

    if (data.managerId === id) {
      throw new AppError("A user cannot be their own manager", HTTP_STATUS.BAD_REQUEST);
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
    action: "UPDATE",
    entity: "User",
    entityId: id,
    oldValues,
    newValues,
    ipAddress,
    userAgent,
  });

  return updated;
};

export const updateProfile = async (id: string, data: ProfileUpdateInput) => {
  const existing = await prisma.user.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
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
};

export const changeStatus = async (
  id: string,
  data: ChangeStatusInput,
  performedByUserId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const ownerId = await resolveOwnerId(performedByUserId);

  const target = await prisma.user.findFirst({
    where: { id, ownerId, deletedAt: null },
  });

  if (!target) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  if (target.id === performedByUserId) {
    throw new AppError("You cannot change your own status", HTTP_STATUS.FORBIDDEN);
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
    action: "CHANGE_STATUS",
    entity: "User",
    entityId: id,
    oldValues: { status: oldStatus },
    newValues: { status: data.status },
    ipAddress,
    userAgent,
  });

  return updated;
};

export const remove = async (
  id: string,
  performedByUserId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const ownerId = await resolveOwnerId(performedByUserId);

  const existing = await prisma.user.findFirst({
    where: { id, ownerId, deletedAt: null },
  });

  if (!existing) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  if (existing.id === performedByUserId) {
    throw new AppError("You cannot delete your own account", HTTP_STATUS.FORBIDDEN);
  }

  const hasActiveAllocations = await prisma.allocation.findFirst({
    where: {
      userId: id,
      status: ALLOCATION_STATUS.ACTIVE,
    },
  });

  if (hasActiveAllocations) {
    throw new AppError(
      "Cannot delete user with active asset allocations. Please return all assets first.",
      HTTP_STATUS.CONFLICT
    );
  }

  await prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedBy: performedByUserId,
      status: USER_STATUS.INACTIVE,
      version: { increment: 1 },
    },
  });

  await prisma.session.updateMany({
    where: { userId: id, isActive: true },
    data: { isActive: false },
  });

  await createAuditLog({
    userId: performedByUserId,
    action: "DELETE",
    entity: "User",
    entityId: id,
    oldValues: { email: existing.email, role: existing.role, status: existing.status },
    ipAddress,
    userAgent,
  });

  return { id };
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  const isCurrentPasswordValid = await compare(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", HTTP_STATUS.BAD_REQUEST);
  }

  const hashedPassword = await hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      version: { increment: 1 },
    },
  });

  await prisma.refreshToken.deleteMany({ where: { userId } });

  await createActivityLog({
    userId,
    action: "CHANGE_PASSWORD",
    entity: "User",
    entityId: userId,
    description: "User changed their password",
  });
};

export const getDirectReports = async (managerId: string, requesterId: string) => {
  const ownerId = await resolveOwnerId(requesterId);

  const manager = await prisma.user.findFirst({
    where: { id: managerId, ownerId, deletedAt: null },
  });

  if (!manager) {
    throw new AppError("Manager not found", HTTP_STATUS.NOT_FOUND);
  }

  const reports = await prisma.user.findMany({
    where: {
      managerId,
      ownerId,
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
    orderBy: { firstName: "asc" },
  });

  return reports;
};
