import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';
import { HTTP_STATUS, PAGINATION_DEFAULTS } from '../constants';
import { createAuditLog } from '../audit';
import { createNotification } from '../notifications';
import { AppError } from '../middleware/error';
import { generateId, generateQrCode } from '../utils';
import { CreateAssetInput, UpdateAssetInput, ChangeStatusInput, ChangeConditionInput, AssignAssetInput } from '../validators/asset.schema';
import { NotificationType, AssetStatus, AssetCondition } from '@prisma/client';

export class AssetService {
  static async getAll(query: Record<string, string>) {
    const page = parseInt(query.page || String(PAGINATION_DEFAULTS.PAGE));
    const limit = Math.min(parseInt(query.limit || String(PAGINATION_DEFAULTS.LIMIT)), PAGINATION_DEFAULTS.MAX_LIMIT);
    const search = query.search || '';
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { assetTag: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (query.status) where.status = query.status;
    if (query.condition) where.condition = query.condition;
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.allocatedToId) where.allocatedToId = query.allocatedToId;
    if (query.manufacturer) where.manufacturer = { contains: query.manufacturer, mode: 'insensitive' };

    const [items, totalItems] = await Promise.all([
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

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getById(id: string) {
    const asset = await prisma.asset.findFirst({
      where: { id, deletedAt: null },
      include: {
        department: { select: { id: true, name: true, code: true } },
        category: { select: { id: true, name: true, code: true } },
        allocatedTo: { select: { id: true, firstName: true, lastName: true, email: true, employeeId: true } },
        allocations: { orderBy: { allocatedAt: 'desc' }, take: 10 },
        maintenanceTasks: { orderBy: { scheduledDate: 'desc' }, take: 10 },
        documents: true,
      },
    });

    if (!asset) {
      throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
    }

    return asset;
  }

  static async getByQrCode(qrCode: string) {
    const asset = await prisma.asset.findFirst({
      where: { qrCode, deletedAt: null },
      include: {
        department: { select: { id: true, name: true, code: true } },
        category: { select: { id: true, name: true, code: true } },
        allocatedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!asset) {
      throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
    }

    return asset;
  }

  static async create(data: CreateAssetInput, userId: string, ipAddress?: string, userAgent?: string) {
    const assetTag = `AST-${generateId().slice(0, 8).toUpperCase()}`;
    const qrCode = generateQrCode(assetTag);

    const asset = await prisma.asset.create({
      data: {
        ...data,
        assetTag,
        qrCode,
        status: 'AVAILABLE' as AssetStatus,
        condition: 'GOOD' as AssetCondition,
        createdBy: userId,
      },
    });

    await prisma.assetHistory.create({
      data: {
        assetId: asset.id,
        action: 'CREATED',
        description: 'Asset created',
        newValues: data as any,
        performedBy: userId,
        ipAddress,
      },
    });

    await createAuditLog({
      userId,
      action: 'CREATE',
      entity: 'Asset',
      entityId: asset.id,
      newValues: data as any,
      ipAddress,
      userAgent,
    });

    return asset;
  }

  static async update(id: string, data: UpdateAssetInput, userId: string, ipAddress?: string, userAgent?: string) {
    const existing = await prisma.asset.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
    }

    const updated = await prisma.asset.update({
      where: { id },
      data: { ...data, updatedBy: userId, version: { increment: 1 } },
    });

    await prisma.assetHistory.create({
      data: {
        assetId: id,
        action: 'UPDATED',
        description: 'Asset updated',
        oldValues: existing as any,
        newValues: data as any,
        performedBy: userId,
        ipAddress,
      },
    });

    await createAuditLog({
      userId,
      action: 'UPDATE',
      entity: 'Asset',
      entityId: id,
      oldValues: existing as any,
      newValues: data as any,
      ipAddress,
      userAgent,
    });

    return updated;
  }

  static async delete(id: string, userId: string, ipAddress?: string, userAgent?: string) {
    const existing = await prisma.asset.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
    }

    if (existing.status === 'ALLOCATED') {
      throw new AppError('Cannot delete an allocated asset. Unallocate first.', HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.asset.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: userId },
    });

    await createAuditLog({
      userId,
      action: 'DELETE',
      entity: 'Asset',
      entityId: id,
      oldValues: existing as any,
      ipAddress,
      userAgent,
    });

    return { deleted: true };
  }

  static async assign(id: string, data: AssignAssetInput, userId: string, ipAddress?: string, userAgent?: string) {
    const asset = await prisma.asset.findFirst({ where: { id, deletedAt: null } });
    if (!asset) {
      throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
    }

    if (asset.status !== 'AVAILABLE') {
      throw new AppError('Asset is not available for allocation', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await prisma.user.findFirst({ where: { id: data.userId, deletedAt: null } });
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    const [updatedAsset, allocation] = await prisma.$transaction([
      prisma.asset.update({
        where: { id },
        data: {
          status: 'ALLOCATED' as AssetStatus,
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
        action: 'ALLOCATED',
        description: `Asset allocated to ${user.firstName} ${user.lastName}`,
        newValues: { allocatedToId: data.userId, allocationId: allocation.id },
        performedBy: userId,
        ipAddress,
      },
    });

    await createNotification({
      userId: data.userId,
      type: 'ASSET_ASSIGNED' as NotificationType,
      title: 'Asset Assigned',
      message: `You have been assigned asset "${asset.name}" (${asset.assetTag})`,
      link: `/assets/${id}`,
    });

    await createAuditLog({
      userId,
      action: 'ASSIGN',
      entity: 'Asset',
      entityId: id,
      newValues: { allocatedToId: data.userId },
      ipAddress,
      userAgent,
    });

    return updatedAsset;
  }

  static async unallocate(id: string, condition: AssetCondition, userId: string, ipAddress?: string, userAgent?: string) {
    const asset = await prisma.asset.findFirst({ where: { id, deletedAt: null } });
    if (!asset) {
      throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
    }

    if (asset.status !== 'ALLOCATED') {
      throw new AppError('Asset is not currently allocated', HTTP_STATUS.BAD_REQUEST);
    }

    const previousUserId = asset.allocatedToId;

    const [updatedAsset] = await prisma.$transaction([
      prisma.asset.update({
        where: { id },
        data: {
          status: 'AVAILABLE' as AssetStatus,
          condition,
          allocatedToId: null,
          allocatedAt: null,
          expectedReturn: null,
          updatedBy: userId,
          version: { increment: 1 },
        },
      }),
      prisma.allocation.updateMany({
        where: { assetId: id, userId: asset.allocatedToId!, status: 'ACTIVE' },
        data: { returnedAt: new Date(), status: 'RETURNED', returnCondition: condition, updatedBy: userId },
      }),
    ]);

    await prisma.assetHistory.create({
      data: {
        assetId: id,
        action: 'RETURNED',
        description: 'Asset returned',
        oldValues: { allocatedToId: previousUserId },
        newValues: { condition },
        performedBy: userId,
        ipAddress,
      },
    });

    if (previousUserId) {
      await createNotification({
        userId: previousUserId,
        type: 'ASSET_RETURNED' as NotificationType,
        title: 'Asset Returned',
        message: `Asset "${asset.name}" (${asset.assetTag}) has been returned`,
        link: `/assets/${id}`,
      });
    }

    await createAuditLog({
      userId,
      action: 'UNALLOCATE',
      entity: 'Asset',
      entityId: id,
      oldValues: { allocatedToId: previousUserId },
      newValues: { condition },
      ipAddress,
      userAgent,
    });

    return updatedAsset;
  }

  static async changeStatus(id: string, data: ChangeStatusInput, userId: string, ipAddress?: string, userAgent?: string) {
    const asset = await prisma.asset.findFirst({ where: { id, deletedAt: null } });
    if (!asset) {
      throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
    }

    const updated = await prisma.asset.update({
      where: { id },
      data: { status: data.status, updatedBy: userId, version: { increment: 1 } },
    });

    await prisma.assetHistory.create({
      data: {
        assetId: id,
        action: 'STATUS_CHANGED',
        description: `Status changed from ${asset.status} to ${data.status}. ${data.reason || ''}`,
        oldValues: { status: asset.status },
        newValues: { status: data.status },
        performedBy: userId,
        ipAddress,
      },
    });

    await createAuditLog({
      userId,
      action: 'STATUS_CHANGE',
      entity: 'Asset',
      entityId: id,
      oldValues: { status: asset.status },
      newValues: { status: data.status },
      ipAddress,
      userAgent,
    });

    return updated;
  }

  static async changeCondition(id: string, data: ChangeConditionInput, userId: string, ipAddress?: string, userAgent?: string) {
    const asset = await prisma.asset.findFirst({ where: { id, deletedAt: null } });
    if (!asset) {
      throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
    }

    const updated = await prisma.asset.update({
      where: { id },
      data: { condition: data.condition, updatedBy: userId, version: { increment: 1 } },
    });

    await prisma.assetHistory.create({
      data: {
        assetId: id,
        action: 'CONDITION_CHANGED',
        description: `Condition changed from ${asset.condition} to ${data.condition}. ${data.notes || ''}`,
        oldValues: { condition: asset.condition },
        newValues: { condition: data.condition },
        performedBy: userId,
        ipAddress,
      },
    });

    return updated;
  }

  static async getHistory(id: string, page = 1, limit = 20) {
    const asset = await prisma.asset.findFirst({ where: { id, deletedAt: null } });
    if (!asset) {
      throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
    }

    const skip = (page - 1) * limit;
    const [items, totalItems] = await Promise.all([
      prisma.assetHistory.findMany({
        where: { assetId: id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.assetHistory.count({ where: { assetId: id } }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        hasNextPage: page * limit < totalItems,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getStats(userId?: string) {
    const [total, byStatus, byCondition, totalValue, departmentBreakdown] = await Promise.all([
      prisma.asset.count({ where: { deletedAt: null } }),
      prisma.asset.groupBy({ by: ['status'], where: { deletedAt: null }, _count: true }),
      prisma.asset.groupBy({ by: ['condition'], where: { deletedAt: null }, _count: true }),
      prisma.asset.aggregate({ where: { deletedAt: null }, _sum: { currentValue: true, purchasePrice: true } }),
      prisma.asset.groupBy({
        by: ['departmentId'],
        where: { deletedAt: null },
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
  }

  static async search(query: string, limit = 20) {
    if (!query || query.length < 2) {
      throw new AppError('Search query must be at least 2 characters', HTTP_STATUS.BAD_REQUEST);
    }

    const assets = await prisma.asset.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { assetTag: { contains: query, mode: 'insensitive' } },
          { serialNumber: { contains: query, mode: 'insensitive' } },
          { manufacturer: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        department: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    return assets;
  }
}
