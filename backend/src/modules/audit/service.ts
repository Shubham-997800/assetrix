import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { paginatedMeta } from "../../utils/response";
import { PAGINATION_DEFAULTS } from "../../constants";
import { getPagination } from "../shared/pagination";
import type { PaginationQuery } from "../../types";

export interface AuditFilters extends PaginationQuery {
  entity?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

type AuditFilterInput = Omit<AuditFilters, "page" | "limit" | "search" | "sortBy" | "sortOrder">;

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
} as const;

function buildWhere(filters: AuditFilterInput): Prisma.AuditLogWhereInput {
  const where: Prisma.AuditLogWhereInput = {};

  if (filters.entity) where.entity = filters.entity;
  if (filters.entityId) where.entityId = filters.entityId;
  if (filters.userId) where.userId = filters.userId;
  if (filters.action) where.action = filters.action;

  if (filters.startDate || filters.endDate) {
    where.createdAt = {
      ...(filters.startDate && { gte: new Date(filters.startDate) }),
      ...(filters.endDate && { lte: new Date(filters.endDate) }),
    };
  }

  return where;
}

export const getAll = async (filters: AuditFilters) => {
  const { page, limit, skip, sortBy, sortOrder } = getPagination(filters);
  const where = buildWhere(filters);

  const [items, totalItems] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: userSelect } },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { items, meta: paginatedMeta(totalItems, page, limit) };
};

export const getByEntity = async (entity: string, entityId: string) => {
  return prisma.auditLog.findMany({
    where: { entity, entityId },
    include: { user: { select: userSelect } },
    orderBy: { createdAt: "desc" },
  });
};

export const getByUser = async (userId: string, page: number = 1, limit: number = 20) => {
  const { page: currentPage, limit: safeLimit, skip } = getPagination({
    page: String(page),
    limit: String(limit),
  });
  const where: Prisma.AuditLogWhereInput = { userId };

  const [items, totalItems] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: userSelect } },
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { items, meta: paginatedMeta(totalItems, currentPage, safeLimit) };
};

export const getRecentActivity = async (limit: number = 50) => {
  const safeLimit = Math.min(limit, PAGINATION_DEFAULTS.MAX_LIMIT);

  return prisma.auditLog.findMany({
    include: { user: { select: userSelect } },
    orderBy: { createdAt: "desc" },
    take: safeLimit,
  });
};

export const exportAuditLogs = async (filters: AuditFilterInput, format: string = "csv") => {
  const where = buildWhere(filters);

  const items = await prisma.auditLog.findMany({
    where,
    include: { user: { select: userSelect } },
    orderBy: { createdAt: "desc" },
  });

  return { format, count: items.length, data: items };
};
