import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError, paginatedMeta } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import { createAuditLog } from "../shared/audit";
import { buildWhereSearch, getPagination } from "../shared/pagination";
import type { PaginationQuery } from "../../types";
import type { CreateAssetCategoryInput, UpdateAssetCategoryInput } from "./validators";

export interface GetAllParams extends PaginationQuery {
  parentId?: string;
  isActive?: boolean;
}

const includeRelations = {
  _count: { select: { assets: true, children: true } },
  parent: { select: { id: true, name: true, code: true } },
};

export const getAll = async (params: GetAllParams) => {
  const { page, limit, skip, sortBy, sortOrder } = getPagination(params);

  const where: Prisma.AssetCategoryWhereInput = { deletedAt: null };
  if (params.isActive !== undefined) where.isActive = params.isActive;
  if (params.parentId) where.parentId = params.parentId;

  const searchWhere = buildWhereSearch(["name", "code", "description"], params.search);
  if (searchWhere.OR) Object.assign(where, searchWhere);

  const [categories, totalItems] = await Promise.all([
    prisma.assetCategory.findMany({
      where,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.assetCategory.count({ where }),
  ]);

  return { categories, meta: paginatedMeta(totalItems, page, limit) };
};

export const getById = async (id: string) => {
  const category = await prisma.assetCategory.findUnique({
    where: { id, deletedAt: null },
    include: {
      ...includeRelations,
      children: { select: { id: true, name: true, code: true } },
    },
  });
  if (!category) throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);
  return category;
};

export const getTree = async () => {
  const categories = await prisma.assetCategory.findMany({
    where: { deletedAt: null, isActive: true },
    include: { _count: { select: { assets: true } } },
    orderBy: { name: "asc" },
  });

  const root = categories.filter((c) => !c.parentId);

  const buildTree = (parentId: string): typeof categories => {
    return categories
      .filter((c) => c.parentId === parentId)
      .map((c) => ({ ...c, children: buildTree(c.id) }));
  };

  const tree = root.map((c) => ({ ...c, children: buildTree(c.id) }));
  return tree;
};

export const create = async (
  data: CreateAssetCategoryInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existingName = await prisma.assetCategory.findFirst({ where: { name: data.name, deletedAt: null } });
  if (existingName) throw new AppError("Category name already exists", HTTP_STATUS.CONFLICT);

  const existingCode = await prisma.assetCategory.findFirst({ where: { code: data.code, deletedAt: null } });
  if (existingCode) throw new AppError("Category code already exists", HTTP_STATUS.CONFLICT);

  if (data.parentId) {
    const parent = await prisma.assetCategory.findUnique({ where: { id: data.parentId } });
    if (!parent) throw new AppError("Parent category not found", HTTP_STATUS.NOT_FOUND);
  }

  const category = await prisma.assetCategory.create({
    data: { ...data, createdBy: userId, updatedBy: userId },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: "CREATE",
    entity: "AssetCategory",
    entityId: category.id,
    newValues: data,
    ipAddress: ip,
    userAgent,
  });

  return category;
};

export const update = async (
  id: string,
  data: UpdateAssetCategoryInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.assetCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);
  if (existing.deletedAt) throw new AppError("Category has been deleted", HTTP_STATUS.NOT_FOUND);

  if (data.name && data.name !== existing.name) {
    const dup = await prisma.assetCategory.findFirst({ where: { name: data.name, deletedAt: null, id: { not: id } } });
    if (dup) throw new AppError("Category name already exists", HTTP_STATUS.CONFLICT);
  }
  if (data.code && data.code !== existing.code) {
    const dup = await prisma.assetCategory.findFirst({ where: { code: data.code, deletedAt: null, id: { not: id } } });
    if (dup) throw new AppError("Category code already exists", HTTP_STATUS.CONFLICT);
  }
  if (data.parentId && data.parentId === id) {
    throw new AppError("Category cannot be its own parent", HTTP_STATUS.BAD_REQUEST);
  }

  const category = await prisma.assetCategory.update({
    where: { id },
    data: { ...data, updatedBy: userId, version: { increment: 1 } },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: "UPDATE",
    entity: "AssetCategory",
    entityId: id,
    oldValues: { name: existing.name, code: existing.code },
    newValues: data,
    ipAddress: ip,
    userAgent,
  });

  return category;
};

export const remove = async (id: string, userId: string, ip?: string, userAgent?: string) => {
  const existing = await prisma.assetCategory.findUnique({
    where: { id },
    include: { _count: { select: { assets: true, children: true } } },
  });
  if (!existing) throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);
  if (existing.deletedAt) throw new AppError("Category already deleted", HTTP_STATUS.NOT_FOUND);
  if (existing._count.assets > 0) {
    throw new AppError("Cannot delete category with existing assets", HTTP_STATUS.BAD_REQUEST);
  }
  if (existing._count.children > 0) {
    throw new AppError("Cannot delete category with sub-categories", HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.assetCategory.update({
    where: { id },
    data: { deletedAt: new Date(), updatedBy: userId },
  });

  await createAuditLog({
    userId,
    action: "DELETE",
    entity: "AssetCategory",
    entityId: id,
    oldValues: { name: existing.name, code: existing.code },
    ipAddress: ip,
    userAgent,
  });

  return { id };
};

export const getCategoryStats = async (id: string) => {
  const category = await prisma.assetCategory.findUnique({ where: { id } });
  if (!category) throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);

  const [totalAssets, activeAssets, maintenanceAssets, retiredAssets] = await Promise.all([
    prisma.asset.count({ where: { categoryId: id, deletedAt: null } }),
    prisma.asset.count({ where: { categoryId: id, deletedAt: null, status: "AVAILABLE" } }),
    prisma.asset.count({ where: { categoryId: id, deletedAt: null, status: "MAINTENANCE" } }),
    prisma.asset.count({ where: { categoryId: id, deletedAt: null, status: "RETIRED" } }),
  ]);

  return {
    category: { id: category.id, name: category.name, code: category.code },
    totalAssets,
    activeAssets,
    maintenanceAssets,
    retiredAssets,
  };
};
