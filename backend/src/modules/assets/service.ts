import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import type { AssetCondition, AssetStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError, paginatedMeta } from "../../utils/response";
import { ASSET_CONDITION, ASSET_STATUS, HTTP_STATUS, NOTIFICATION_TYPE } from "../../constants";
import { createAuditLog } from "../shared/audit";
import { createNotification } from "../shared/notifications";
import { buildWhereSearch, getPagination } from "../shared/pagination";
import type { PaginationQuery } from "../../types";
import type {
  AssignAssetInput,
  ChangeConditionInput,
  ChangeStatusInput,
  CreateAssetInput,
  UpdateAssetInput,
} from "./validators";

function generateId(): string {
  return randomUUID();
}

function generateQrCode(assetId: string): string {
  return `AST-${assetId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}

export interface GetAllAssetsParams extends PaginationQuery {
  status?: string;
  condition?: string;
  departmentId?: string;
  categoryId?: string;
  allocatedToId?: string;
  manufacturer?: string;
}

export const getAll = async (params: GetAllAssetsParams, ownerId: string) => {
  const { page, limit, skip, sortBy, sortOrder } = getPagination(params);

  const where: Prisma.AssetWhereInput = { deletedAt: null, ownerId };

  const searchWhere = buildWhereSearch(
    ["name", "assetTag", "serialNumber", "manufacturer", "model"],
    params.search
  );
  if (searchWhere.OR) Object.assign(where, searchWhere);

  if (params.status) where.status = params.status as AssetStatus;
  if (params.condition) where.condition = params.condition as AssetCondition;
  if (params.departmentId) where.departmentId = params.departmentId;
  if (params.categoryId) where.categoryId = params.categoryId;
  if (params.allocatedToId) where.allocatedToId = params.allocatedToId;
  if (params.manufacturer) where.manufacturer = { contains: params.manufacturer, mode: "insensitive" };

  const [assets, totalItems] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: {
        department: { select: { id: true, name: true, code: true } },
        category: { select: { id: true, name: true, code: true } },
        allocatedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.asset.count({ where }),
  ]);

  return { assets, meta: paginatedMeta(totalItems, page, limit) };
};

export const getById = async (id: string, ownerId: string) => {
  const asset = await prisma.asset.findFirst({
    where: { id, ownerId, deletedAt: null },
    include: {
      department: { select: { id: true, name: true, code: true } },
      category: { select: { id: true, name: true, code: true } },
      allocatedTo: { select: { id: true, firstName: true, lastName: true, email: true, employeeId: true } },
      allocations: { orderBy: { allocatedAt: "desc" }, take: 10 },
      maintenanceTasks: { orderBy: { scheduledDate: "desc" }, take: 10 },
      documents: true,
    },
  });

  if (!asset) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  return asset;
};

export const getByQrCode = async (qrCode: string, ownerId: string) => {
  const asset = await prisma.asset.findFirst({
    where: { qrCode, ownerId, deletedAt: null },
    include: {
      department: { select: { id: true, name: true, code: true } },
      category: { select: { id: true, name: true, code: true } },
      allocatedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  if (!asset) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  return asset;
};

export const create = async (data: CreateAssetInput, userId: string, ipAddress?: string, userAgent?: string) => {
  const assetTag = `AST-${generateId().slice(0, 8).toUpperCase()}`;
  const qrCode = generateQrCode(assetTag);

  const asset = await prisma.asset.create({
    data: {
      ...data,
      assetTag,
      qrCode,
      ownerId: userId,
      status: ASSET_STATUS.AVAILABLE,
      condition: ASSET_CONDITION.GOOD,
      createdBy: userId,
    } as Prisma.AssetUncheckedCreateInput,
  });

  await prisma.assetHistory.create({
    data: {
      assetId: asset.id,
      action: "CREATED",
      description: "Asset created",
      newValues: data as Prisma.InputJsonValue,
      performedBy: userId,
      ipAddress,
    },
  });

  await createAuditLog({
    userId,
    action: "CREATE",
    entity: "Asset",
    entityId: asset.id,
    newValues: data,
    ipAddress,
    userAgent,
  });

  return asset;
};

export const update = async (
  id: string,
  data: UpdateAssetInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existing = await prisma.asset.findFirst({ where: { id, ownerId: userId, deletedAt: null } });
  if (!existing) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  const updated = await prisma.asset.update({
    where: { id },
    data: { ...data, updatedBy: userId, version: { increment: 1 } } as Prisma.AssetUpdateInput,
  });

  await prisma.assetHistory.create({
    data: {
      assetId: id,
      action: "UPDATED",
      description: "Asset updated",
      oldValues: existing as Prisma.InputJsonValue,
      newValues: data as Prisma.InputJsonValue,
      performedBy: userId,
      ipAddress,
    },
  });

  await createAuditLog({
    userId,
    action: "UPDATE",
    entity: "Asset",
    entityId: id,
    oldValues: existing,
    newValues: data,
    ipAddress,
    userAgent,
  });

  return updated;
};

export const remove = async (id: string, userId: string, ipAddress?: string, userAgent?: string) => {
  const existing = await prisma.asset.findFirst({ where: { id, ownerId: userId, deletedAt: null } });
  if (!existing) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status === ASSET_STATUS.ALLOCATED) {
    throw new AppError("Cannot delete an allocated asset. Unallocate first.", HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.asset.update({
    where: { id },
    data: { deletedAt: new Date(), updatedBy: userId },
  });

  await createAuditLog({
    userId,
    action: "DELETE",
    entity: "Asset",
    entityId: id,
    oldValues: existing,
    ipAddress,
    userAgent,
  });

  return { deleted: true };
};

export const assign = async (
  id: string,
  data: AssignAssetInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const asset = await prisma.asset.findFirst({ where: { id, ownerId: userId, deletedAt: null } });
  if (!asset) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  if (asset.status !== ASSET_STATUS.AVAILABLE) {
    throw new AppError("Asset is not available for allocation", HTTP_STATUS.BAD_REQUEST);
  }

  const user = await prisma.user.findFirst({ where: { id: data.userId, deletedAt: null } });
  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  const [updatedAsset, allocation] = await prisma.$transaction([
    prisma.asset.update({
      where: { id },
      data: {
        status: ASSET_STATUS.ALLOCATED,
        allocatedToId: data.userId,
        allocatedAt: new Date(),
        expectedReturn: data.expectedReturn ? new Date(data.expectedReturn) : null,
        updatedBy: userId,
        version: { increment: 1 },
      },
    }),
    prisma.allocation.create({
      data: {
        assetId: id,
        userId: data.userId,
        departmentId: data.departmentId || user.departmentId,
        notes: data.notes,
        approvedBy: userId,
        createdBy: userId,
      },
    }),
  ]);

  await prisma.assetHistory.create({
    data: {
      assetId: id,
      action: "ALLOCATED",
      description: `Asset allocated to ${user.firstName} ${user.lastName}`,
      newValues: { allocatedToId: data.userId, allocationId: allocation.id } as Prisma.InputJsonValue,
      performedBy: userId,
      ipAddress,
    },
  });

  await createNotification({
    userId: data.userId,
    type: NOTIFICATION_TYPE.ASSET_ASSIGNED,
    title: "Asset Assigned",
    message: `You have been assigned asset "${asset.name}" (${asset.assetTag})`,
    link: `/assets/${id}`,
  });

  await createAuditLog({
    userId,
    action: "ASSIGN",
    entity: "Asset",
    entityId: id,
    newValues: { allocatedToId: data.userId },
    ipAddress,
    userAgent,
  });

  return updatedAsset;
};

export const unallocate = async (
  id: string,
  condition: string,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const asset = await prisma.asset.findFirst({ where: { id, ownerId: userId, deletedAt: null } });
  if (!asset) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  if (asset.status !== ASSET_STATUS.ALLOCATED) {
    throw new AppError("Asset is not currently allocated", HTTP_STATUS.BAD_REQUEST);
  }

  const previousUserId = asset.allocatedToId;

  const [updatedAsset] = await prisma.$transaction([
    prisma.asset.update({
      where: { id },
      data: {
        status: ASSET_STATUS.AVAILABLE,
        condition: condition as AssetCondition,
        allocatedToId: null,
        allocatedAt: null,
        expectedReturn: null,
        updatedBy: userId,
        version: { increment: 1 },
      },
    }),
    prisma.allocation.updateMany({
      where: { assetId: id, userId: asset.allocatedToId!, status: "ACTIVE" },
      data: { returnedAt: new Date(), status: "RETURNED", returnCondition: condition as AssetCondition, updatedBy: userId },
    }),
  ]);

  await prisma.assetHistory.create({
    data: {
      assetId: id,
      action: "RETURNED",
      description: "Asset returned",
      oldValues: { allocatedToId: previousUserId } as Prisma.InputJsonValue,
      newValues: { condition } as Prisma.InputJsonValue,
      performedBy: userId,
      ipAddress,
    },
  });

  if (previousUserId) {
    await createNotification({
      userId: previousUserId,
      type: NOTIFICATION_TYPE.ASSET_RETURNED,
      title: "Asset Returned",
      message: `Asset "${asset.name}" (${asset.assetTag}) has been returned`,
      link: `/assets/${id}`,
    });
  }

  await createAuditLog({
    userId,
    action: "UNALLOCATE",
    entity: "Asset",
    entityId: id,
    oldValues: { allocatedToId: previousUserId },
    newValues: { condition },
    ipAddress,
    userAgent,
  });

  return updatedAsset;
};

export const changeStatus = async (
  id: string,
  data: ChangeStatusInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const asset = await prisma.asset.findFirst({ where: { id, ownerId: userId, deletedAt: null } });
  if (!asset) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  const updated = await prisma.asset.update({
    where: { id },
    data: { status: data.status, updatedBy: userId, version: { increment: 1 } },
  });

  await prisma.assetHistory.create({
    data: {
      assetId: id,
      action: "STATUS_CHANGED",
      description: `Status changed from ${asset.status} to ${data.status}. ${data.reason || ""}`,
      oldValues: { status: asset.status } as Prisma.InputJsonValue,
      newValues: { status: data.status } as Prisma.InputJsonValue,
      performedBy: userId,
      ipAddress,
    },
  });

  await createAuditLog({
    userId,
    action: "STATUS_CHANGE",
    entity: "Asset",
    entityId: id,
    oldValues: { status: asset.status },
    newValues: { status: data.status },
    ipAddress,
    userAgent,
  });

  return updated;
};

export const changeCondition = async (
  id: string,
  data: ChangeConditionInput,
  userId: string,
  ipAddress?: string
) => {
  const asset = await prisma.asset.findFirst({ where: { id, ownerId: userId, deletedAt: null } });
  if (!asset) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  const updated = await prisma.asset.update({
    where: { id },
    data: { condition: data.condition, updatedBy: userId, version: { increment: 1 } },
  });

  await prisma.assetHistory.create({
    data: {
      assetId: id,
      action: "CONDITION_CHANGED",
      description: `Condition changed from ${asset.condition} to ${data.condition}. ${data.notes || ""}`,
      oldValues: { condition: asset.condition } as Prisma.InputJsonValue,
      newValues: { condition: data.condition } as Prisma.InputJsonValue,
      performedBy: userId,
      ipAddress,
    },
  });

  return updated;
};

export const getHistory = async (id: string, ownerId: string, page = 1, limit = 20) => {
  const asset = await prisma.asset.findFirst({ where: { id, ownerId, deletedAt: null } });
  if (!asset) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  const skip = (page - 1) * limit;
  const [items, totalItems] = await Promise.all([
    prisma.assetHistory.findMany({
      where: { assetId: id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.assetHistory.count({ where: { assetId: id } }),
  ]);

  return { items, meta: paginatedMeta(totalItems, page, limit) };
};

export const getStats = async (userId?: string) => {
  const baseWhere: Prisma.AssetWhereInput = userId ? { deletedAt: null, ownerId: userId } : { deletedAt: null };
  const [total, byStatus, byCondition, totalValue, departmentBreakdown] = await Promise.all([
    prisma.asset.count({ where: baseWhere }),
    prisma.asset.groupBy({ by: ["status"], where: baseWhere, _count: true }),
    prisma.asset.groupBy({ by: ["condition"], where: baseWhere, _count: true }),
    prisma.asset.aggregate({ where: baseWhere, _sum: { currentValue: true, purchasePrice: true } }),
    prisma.asset.groupBy({
      by: ["departmentId"],
      where: baseWhere,
      _count: true,
      _sum: { currentValue: true },
    }),
  ]);

  return {
    total,
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
    byCondition: byCondition.map((c) => ({ condition: c.condition, count: c._count })),
    totalValue: totalValue._sum.currentValue || 0,
    totalPurchasePrice: totalValue._sum.purchasePrice || 0,
    departmentBreakdown: departmentBreakdown.map((d) => ({
      departmentId: d.departmentId,
      count: d._count,
      totalValue: d._sum.currentValue || 0,
    })),
  };
};

export const search = async (query: string, ownerId: string, limit = 20) => {
  if (!query || query.length < 2) {
    throw new AppError("Search query must be at least 2 characters", HTTP_STATUS.BAD_REQUEST);
  }

  const assets = await prisma.asset.findMany({
    where: {
      deletedAt: null,
      ownerId,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { assetTag: { contains: query, mode: "insensitive" } },
        { serialNumber: { contains: query, mode: "insensitive" } },
        { manufacturer: { contains: query, mode: "insensitive" } },
        { model: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      department: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
    take: limit,
    orderBy: { name: "asc" },
  });

  return assets;
};
