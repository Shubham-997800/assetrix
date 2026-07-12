import prisma from '../config/database';
import { AppError } from '../middleware/error';
import { HTTP_STATUS, PAGINATION_DEFAULTS } from '../constants';
import { auditQueue } from '../queues';

interface AuditFilters {
  entity?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const getAll = async (filters: AuditFilters) => {
  const page = parseInt(filters.page || String(PAGINATION_DEFAULTS.PAGE), 10);
  const limit = Math.min(
    parseInt(filters.limit || String(PAGINATION_DEFAULTS.LIMIT), 10),
    PAGINATION_DEFAULTS.MAX_LIMIT,
  );
  const skip = (page - 1) * limit;
  const sortBy = filters.sortBy || 'createdAt';
  const sortOrder = (filters.sortOrder as 'asc' | 'desc') || PAGINATION_DEFAULTS.SORT_ORDER;

  const where: Record<string, unknown> = {};

  if (filters.entity) {
    where.entity = filters.entity;
  }

  if (filters.entityId) {
    where.entityId = filters.entityId;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {
      ...(filters.startDate && { gte: new Date(filters.startDate) }),
      ...(filters.endDate && { lte: new Date(filters.endDate) }),
    };
  }

  const [items, totalItems] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    hasNextPage: page * limit < totalItems,
    hasPreviousPage: page > 1,
  };
};

export const getByEntity = async (entity: string, entityId: string) => {
  const items = await prisma.auditLog.findMany({
    where: { entity, entityId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return items;
};

export const getByUser = async (userId: string, page: number = 1, limit: number = 20) => {
  const safeLimit = Math.min(limit, PAGINATION_DEFAULTS.MAX_LIMIT);
  const skip = (page - 1) * safeLimit;

  const where = { userId };

  const [items, totalItems] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: safeLimit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / safeLimit),
    currentPage: page,
    hasNextPage: page * safeLimit < totalItems,
    hasPreviousPage: page > 1,
  };
};

export const getRecentActivity = async (limit: number = 50) => {
  const safeLimit = Math.min(limit, PAGINATION_DEFAULTS.MAX_LIMIT);

  const items = await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });

  return items;
};

export const exportAuditLogs = async (filters: Omit<AuditFilters, 'page' | 'limit'>, format: string = 'csv'): Promise<string> => {
  const where: Record<string, unknown> = {};

  if (filters.entity) {
    where.entity = filters.entity;
  }

  if (filters.entityId) {
    where.entityId = filters.entityId;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {
      ...(filters.startDate && { gte: new Date(filters.startDate) }),
      ...(filters.endDate && { lte: new Date(filters.endDate) }),
    };
  }

  const job = await auditQueue.add('export-audit-logs', {
    filters: where,
    format,
    requestedAt: new Date().toISOString(),
  });

  return job.id!.toString();
};
