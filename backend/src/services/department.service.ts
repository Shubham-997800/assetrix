import prisma from '../config/database';
import { AppError } from '../middleware/error';
import { HTTP_STATUS, PAGINATION_DEFAULTS } from '../constants';
import { createAuditLog } from '../audit';
import { paginatedMeta } from '../utils/response';
import { Prisma } from '@prisma/client';
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentQueryInput,
} from '../validators/department.schema';

interface GetAllParams extends DepartmentQueryInput {
  parentId?: string;
}

export const getAll = async (params: GetAllParams) => {
  const {
    page = PAGINATION_DEFAULTS.PAGE,
    limit = PAGINATION_DEFAULTS.LIMIT,
    search,
    sortBy = 'createdAt',
    sortOrder = PAGINATION_DEFAULTS.SORT_ORDER,
    isActive,
    parentId,
  } = params;

  const skip = (page - 1) * limit;

  const where: Prisma.DepartmentWhereInput = {
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { costCenter: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (parentId !== undefined) {
    where.parentId = parentId;
  }

  const [departments, totalItems] = await Promise.all([
    prisma.department.findMany({
      where,
      include: {
        head: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            assets: { where: { deletedAt: null } },
            children: { where: { deletedAt: null } },
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.department.count({ where }),
  ]);

  const meta = paginatedMeta(totalItems, page, limit);

  return { departments, meta };
};

export const getById = async (id: string) => {
  const department = await prisma.department.findUnique({
    where: { id, deletedAt: null },
    include: {
      head: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
        },
      },
      parent: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      children: {
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          isActive: true,
          _count: {
            select: {
              users: { where: { deletedAt: null } },
              assets: { where: { deletedAt: null } },
            },
          },
        },
        orderBy: { name: 'asc' },
      },
      users: {
        where: { deletedAt: null },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          designation: true,
          status: true,
        },
        orderBy: { firstName: 'asc' },
      },
      assets: {
        where: { deletedAt: null },
        select: {
          id: true,
          assetTag: true,
          name: true,
          status: true,
          condition: true,
          purchasePrice: true,
        },
        orderBy: { name: 'asc' },
      },
      _count: {
        select: {
          users: { where: { deletedAt: null } },
          assets: { where: { deletedAt: null } },
          allocations: true,
          children: { where: { deletedAt: null } },
        },
      },
    },
  });

  if (!department) {
    throw new AppError('Department not found', HTTP_STATUS.NOT_FOUND);
  }

  return department;
};

export const getTree = async () => {
  const departments = await prisma.department.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      parentId: true,
      isActive: true,
      budget: true,
      head: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      _count: {
        select: {
          users: { where: { deletedAt: null } },
          assets: { where: { deletedAt: null } },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const departmentMap = new Map<string, Record<string, unknown> & { children: Record<string, unknown>[] }>();
  const roots: Record<string, unknown>[] = [];

  for (const dept of departments) {
    departmentMap.set(dept.id, { ...dept, children: [] });
  }

  for (const dept of departments) {
    const node = departmentMap.get(dept.id)!;
    if (dept.parentId && departmentMap.has(dept.parentId)) {
      departmentMap.get(dept.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};

export const create = async (data: CreateDepartmentInput, userId: string, ipAddress?: string, userAgent?: string) => {
  const existingName = await prisma.department.findFirst({
    where: { name: data.name, deletedAt: null },
  });

  if (existingName) {
    throw new AppError('A department with this name already exists', HTTP_STATUS.CONFLICT);
  }

  const existingCode = await prisma.department.findFirst({
    where: { code: data.code, deletedAt: null },
  });

  if (existingCode) {
    throw new AppError('A department with this code already exists', HTTP_STATUS.CONFLICT);
  }

  if (data.parentId) {
    const parent = await prisma.department.findFirst({
      where: { id: data.parentId, deletedAt: null },
    });

    if (!parent) {
      throw new AppError('Parent department not found', HTTP_STATUS.NOT_FOUND);
    }

    if (data.parentId === data.headId) {
      throw new AppError('Parent department and head user cannot be the same', HTTP_STATUS.BAD_REQUEST);
    }
  }

  if (data.headId) {
    const head = await prisma.user.findFirst({
      where: { id: data.headId, deletedAt: null },
    });

    if (!head) {
      throw new AppError('Head user not found', HTTP_STATUS.NOT_FOUND);
    }
  }

  const department = await prisma.department.create({
    data: {
      name: data.name,
      code: data.code,
      description: data.description ?? null,
      headId: data.headId ?? null,
      parentId: data.parentId ?? null,
      budget: data.budget ?? null,
      costCenter: data.costCenter ?? null,
      location: data.location ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      isActive: data.isActive ?? true,
      createdBy: userId,
      updatedBy: userId,
    },
    include: {
      head: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      parent: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'Department',
    entityId: department.id,
    newValues: department as unknown as Record<string, unknown>,
    ipAddress,
    userAgent,
  });

  return department;
};

export const update = async (
  id: string,
  data: UpdateDepartmentInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existing = await prisma.department.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new AppError('Department not found', HTTP_STATUS.NOT_FOUND);
  }

  if (data.name && data.name !== existing.name) {
    const nameTaken = await prisma.department.findFirst({
      where: { name: data.name, deletedAt: null, id: { not: id } },
    });

    if (nameTaken) {
      throw new AppError('A department with this name already exists', HTTP_STATUS.CONFLICT);
    }
  }

  if (data.code && data.code !== existing.code) {
    const codeTaken = await prisma.department.findFirst({
      where: { code: data.code, deletedAt: null, id: { not: id } },
    });

    if (codeTaken) {
      throw new AppError('A department with this code already exists', HTTP_STATUS.CONFLICT);
    }
  }

  const parentId = data.parentId !== undefined ? data.parentId : existing.parentId;

  if (parentId === id) {
    throw new AppError('A department cannot be its own parent', HTTP_STATUS.BAD_REQUEST);
  }

  if (parentId) {
    const parent = await prisma.department.findFirst({
      where: { id: parentId, deletedAt: null },
    });

    if (!parent) {
      throw new AppError('Parent department not found', HTTP_STATUS.NOT_FOUND);
    }

    const isCircular = await checkCircularParent(id, parentId);
    if (isCircular) {
      throw new AppError('Setting this parent would create a circular hierarchy', HTTP_STATUS.BAD_REQUEST);
    }
  }

  if (data.headId) {
    const head = await prisma.user.findFirst({
      where: { id: data.headId, deletedAt: null },
    });

    if (!head) {
      throw new AppError('Head user not found', HTTP_STATUS.NOT_FOUND);
    }
  }

  const updated = await prisma.department.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.code !== undefined && { code: data.code }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.headId !== undefined && { headId: data.headId }),
      ...(data.parentId !== undefined && { parentId: data.parentId }),
      ...(data.budget !== undefined && { budget: data.budget }),
      ...(data.costCenter !== undefined && { costCenter: data.costCenter }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      updatedBy: userId,
      version: { increment: 1 },
    },
    include: {
      head: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      parent: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  });

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'Department',
    entityId: id,
    oldValues: existing as unknown as Record<string, unknown>,
    newValues: updated as unknown as Record<string, unknown>,
    ipAddress,
    userAgent,
  });

  return updated;
};

export const remove = async (id: string, userId: string, ipAddress?: string, userAgent?: string) => {
  const department = await prisma.department.findFirst({
    where: { id, deletedAt: null },
    include: {
      _count: {
        select: {
          users: { where: { deletedAt: null } },
          assets: { where: { deletedAt: null } },
          children: { where: { deletedAt: null } },
        },
      },
    },
  });

  if (!department) {
    throw new AppError('Department not found', HTTP_STATUS.NOT_FOUND);
  }

  if (department._count.users > 0) {
    throw new AppError(
      `Cannot delete department with ${department._count.users} active user(s). Reassign users first.`,
      HTTP_STATUS.CONFLICT
    );
  }

  if (department._count.assets > 0) {
    throw new AppError(
      `Cannot delete department with ${department._count.assets} active asset(s). Reassign assets first.`,
      HTTP_STATUS.CONFLICT
    );
  }

  if (department._count.children > 0) {
    throw new AppError(
      `Cannot delete department with ${department._count.children} child department(s). Reassign or delete children first.`,
      HTTP_STATUS.CONFLICT
    );
  }

  await prisma.department.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedBy: userId,
    },
  });

  await createAuditLog({
    userId,
    action: 'DELETE',
    entity: 'Department',
    entityId: id,
    oldValues: department as unknown as Record<string, unknown>,
    ipAddress,
    userAgent,
  });

  return { id };
};

export const getDepartmentStats = async (id: string) => {
  const department = await prisma.department.findFirst({
    where: { id, deletedAt: null },
  });

  if (!department) {
    throw new AppError('Department not found', HTTP_STATUS.NOT_FOUND);
  }

  const [userCount, assetCounts, budgetAggregation, allocationCount] = await Promise.all([
    prisma.user.count({
      where: { departmentId: id, deletedAt: null },
    }),
    prisma.asset.groupBy({
      by: ['status'],
      where: { departmentId: id, deletedAt: null },
      _count: { id: true },
      _sum: { purchasePrice: true, currentValue: true },
    }),
    prisma.asset.aggregate({
      where: { departmentId: id, deletedAt: null },
      _sum: { purchasePrice: true, currentValue: true },
    }),
    prisma.allocation.count({
      where: { departmentId: id, status: 'ACTIVE' },
    }),
  ]);

  const assetsByStatus = assetCounts.reduce(
    (acc, item) => {
      acc[item.status] = {
        count: item._count.id,
        totalPurchasePrice: Number(item._sum.purchasePrice ?? 0),
        totalCurrentValue: Number(item._sum.currentValue ?? 0),
      };
      return acc;
    },
    {} as Record<string, { count: number; totalPurchasePrice: number; totalCurrentValue: number }>
  );

  const totalAssets = assetCounts.reduce((sum, item) => sum + item._count.id, 0);

  return {
    department: {
      id: department.id,
      name: department.name,
      code: department.code,
      budget: department.budget,
    },
    userCount,
    assetSummary: {
      total: totalAssets,
      activeAllocations: allocationCount,
      totalPurchasePrice: budgetAggregation._sum.purchasePrice ?? 0,
      totalCurrentValue: budgetAggregation._sum.currentValue ?? 0,
      byStatus: assetsByStatus,
    },
    budget: {
      allocated: department.budget,
      spent: budgetAggregation._sum.purchasePrice ?? 0,
      remaining: department.budget
        ? Number(department.budget) - Number(budgetAggregation._sum.purchasePrice ?? 0)
        : null,
    },
  };
};

const checkCircularParent = async (departmentId: string, newParentId: string): Promise<boolean> => {
  let currentParentId: string | null = newParentId;
  const visited = new Set<string>([departmentId]);

  while (currentParentId) {
    if (visited.has(currentParentId)) {
      return true;
    }

    visited.add(currentParentId);

    const parent: { parentId: string | null } | null = await prisma.department.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
    });

    currentParentId = parent?.parentId ?? null;
  }

  return false;
};
