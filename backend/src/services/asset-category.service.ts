import prisma from '../config/database';
import { HTTP_STATUS } from '../constants';
import { AppError } from '../middleware/error';
import { successResponse, paginatedMeta } from '../utils/response';
import { createAuditLog } from '../audit';
import {
  CreateAssetCategoryInput,
  UpdateAssetCategoryInput,
  AssetCategoryQueryInput,
} from '../validators/asset-category.schema';

const includeRelations = {
  _count: { select: { assets: true, children: true } },
  parent: { select: { id: true, name: true, code: true } },
};

export const getAll = async (query: AssetCategoryQueryInput) => {
  const { page, limit, search, sortBy, sortOrder, isActive, parentId } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deletedAt: null };
  if (isActive !== undefined) where.isActive = isActive;
  if (parentId) where.parentId = parentId;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

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

  return successResponse('Categories retrieved successfully', categories, paginatedMeta(totalItems, page, limit));
};

export const getById = async (id: string) => {
  const category = await prisma.assetCategory.findUnique({
    where: { id },
    include: {
      ...includeRelations,
      children: { select: { id: true, name: true, code: true } },
    },
  });
  if (!category) throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  return successResponse('Category retrieved successfully', category);
};

export const getTree = async () => {
  const categories = await prisma.assetCategory.findMany({
    where: { deletedAt: null, isActive: true },
    include: { _count: { select: { assets: true } } },
    orderBy: { name: 'asc' },
  });

  const root = categories.filter((c) => !c.parentId);
  const buildTree = (parentId: string): typeof categories => {
    return categories
      .filter((c) => c.parentId === parentId)
      .map((c) => ({ ...c, children: buildTree(c.id) }));
  };

  const tree = root.map((c) => ({ ...c, children: buildTree(c.id) }));
  return successResponse('Category tree retrieved successfully', tree);
};

export const create = async (
  data: CreateAssetCategoryInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existingName = await prisma.assetCategory.findFirst({ where: { name: data.name, deletedAt: null } });
  if (existingName) throw new AppError('Category name already exists', HTTP_STATUS.CONFLICT);

  const existingCode = await prisma.assetCategory.findFirst({ where: { code: data.code, deletedAt: null } });
  if (existingCode) throw new AppError('Category code already exists', HTTP_STATUS.CONFLICT);

  if (data.parentId) {
    const parent = await prisma.assetCategory.findUnique({ where: { id: data.parentId } });
    if (!parent) throw new AppError('Parent category not found', HTTP_STATUS.NOT_FOUND);
  }

  const category = await prisma.assetCategory.create({
    data: { ...data, createdBy: userId },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'AssetCategory',
    entityId: category.id,
    newValues: data,
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Category created successfully', category);
};

export const update = async (
  id: string,
  data: UpdateAssetCategoryInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.assetCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  if (existing.deletedAt) throw new AppError('Category has been deleted', HTTP_STATUS.NOT_FOUND);

  if (data.name && data.name !== existing.name) {
    const dup = await prisma.assetCategory.findFirst({ where: { name: data.name, deletedAt: null, id: { not: id } } });
    if (dup) throw new AppError('Category name already exists', HTTP_STATUS.CONFLICT);
  }
  if (data.code && data.code !== existing.code) {
    const dup = await prisma.assetCategory.findFirst({ where: { code: data.code, deletedAt: null, id: { not: id } } });
    if (dup) throw new AppError('Category code already exists', HTTP_STATUS.CONFLICT);
  }
  if (data.parentId && data.parentId === id) {
    throw new AppError('Category cannot be its own parent', HTTP_STATUS.BAD_REQUEST);
  }

  const category = await prisma.assetCategory.update({
    where: { id },
    data: { ...data, updatedBy: userId, version: { increment: 1 } },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'AssetCategory',
    entityId: id,
    oldValues: { name: existing.name, code: existing.code },
    newValues: data,
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Category updated successfully', category);
};

export const remove = async (id: string, userId: string, ip?: string, userAgent?: string) => {
  const existing = await prisma.assetCategory.findUnique({
    where: { id },
    include: { _count: { select: { assets: true, children: true } } },
  });
  if (!existing) throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  if (existing.deletedAt) throw new AppError('Category already deleted', HTTP_STATUS.NOT_FOUND);
  if (existing._count.assets > 0) {
    throw new AppError('Cannot delete category with existing assets', HTTP_STATUS.BAD_REQUEST);
  }
  if (existing._count.children > 0) {
    throw new AppError('Cannot delete category with sub-categories', HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.assetCategory.update({
    where: { id },
    data: { deletedAt: new Date(), updatedBy: userId },
  });

  await createAuditLog({
    userId,
    action: 'DELETE',
    entity: 'AssetCategory',
    entityId: id,
    oldValues: { name: existing.name, code: existing.code },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Category deleted successfully', { id });
};

export const getCategoryStats = async (id: string) => {
  const category = await prisma.assetCategory.findUnique({ where: { id } });
  if (!category) throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);

  const [totalAssets, activeAssets, maintenanceAssets, retiredAssets] = await Promise.all([
    prisma.asset.count({ where: { categoryId: id, deletedAt: null } }),
    prisma.asset.count({ where: { categoryId: id, deletedAt: null, status: 'AVAILABLE' } }),
    prisma.asset.count({ where: { categoryId: id, deletedAt: null, status: 'MAINTENANCE' } }),
    prisma.asset.count({ where: { categoryId: id, deletedAt: null, status: 'RETIRED' } }),
  ]);

  return successResponse('Category statistics retrieved', {
    category: { id: category.id, name: category.name, code: category.code },
    totalAssets,
    activeAssets,
    maintenanceAssets,
    retiredAssets,
  });
};
