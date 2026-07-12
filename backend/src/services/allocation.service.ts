import prisma from '../config/database';
import { HTTP_STATUS } from '../constants';
import { AppError } from '../middleware/error';
import { successResponse, paginatedMeta } from '../utils/response';
import { createAuditLog } from '../audit';
import { createNotification } from '../notifications';
import { NotificationType } from '@prisma/client';
import {
  CreateAllocationInput,
  ReturnAllocationInput,
  AllocationQueryInput,
} from '../validators/allocation.schema';

const includeRelations = {
  asset: {
    select: {
      id: true,
      assetTag: true,
      name: true,
      status: true,
      condition: true,
      location: true,
    },
  },
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      employeeId: true,
      departmentId: true,
    },
  },
  department: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
};

export const getAllAllocations = async (query: AllocationQueryInput) => {
  const { page, limit, search, sortBy, sortOrder, status, userId, assetId, departmentId } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deletedAt: null };

  if (status) where.status = status;
  if (userId) where.userId = userId;
  if (assetId) where.assetId = assetId;
  if (departmentId) where.departmentId = departmentId;

  if (search) {
    where.OR = [
      { asset: { name: { contains: search, mode: 'insensitive' } } },
      { asset: { assetTag: { contains: search, mode: 'insensitive' } } },
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [allocations, totalItems] = await Promise.all([
    prisma.allocation.findMany({
      where,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.allocation.count({ where }),
  ]);

  return successResponse('Allocations retrieved successfully', allocations, paginatedMeta(totalItems, page, limit));
};

export const getAllocationById = async (id: string) => {
  const allocation = await prisma.allocation.findUnique({
    where: { id },
    include: includeRelations,
  });

  if (!allocation) {
    throw new AppError('Allocation not found', HTTP_STATUS.NOT_FOUND);
  }

  return successResponse('Allocation retrieved successfully', allocation);
};

export const createAllocation = async (
  data: CreateAllocationInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const asset = await prisma.asset.findUnique({ where: { id: data.assetId } });
  if (!asset) {
    throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
  }

  if (asset.status !== 'AVAILABLE') {
    throw new AppError('Asset is not available for allocation', HTTP_STATUS.BAD_REQUEST);
  }

  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  const [allocation, updatedAsset] = await prisma.$transaction([
    prisma.allocation.create({
      data: {
        assetId: data.assetId,
        userId: data.userId,
        departmentId: data.departmentId || user.departmentId,
        expectedReturn: data.expectedReturn,
        notes: data.notes,
        condition: data.condition || asset.condition,
        status: 'ACTIVE',
        approvedBy: userId,
        createdBy: userId,
      },
      include: includeRelations,
    }),
    prisma.asset.update({
      where: { id: data.assetId },
      data: {
        status: 'ALLOCATED',
        allocatedToId: data.userId,
        allocatedAt: new Date(),
        expectedReturn: data.expectedReturn,
        updatedBy: userId,
        version: { increment: 1 },
      },
    }),
  ]);

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'Allocation',
    entityId: allocation.id,
    newValues: { assetId: data.assetId, userId: data.userId, status: 'ACTIVE' },
    ipAddress: ip,
    userAgent,
  });

  await createNotification({
    userId: data.userId,
    type: NotificationType.ASSET_ASSIGNED,
    title: 'Asset Allocated',
    message: `You have been allocated asset "${asset.name}" (${asset.assetTag})`,
    link: `/allocations/${allocation.id}`,
  });

  return successResponse('Allocation created successfully', allocation, undefined);
};

export const returnAllocation = async (
  id: string,
  data: ReturnAllocationInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.allocation.findUnique({ where: { id }, include: { asset: true } });

  if (!existing) {
    throw new AppError('Allocation not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status === 'RETURNED') {
    throw new AppError('Allocation has already been returned', HTTP_STATUS.BAD_REQUEST);
  }

  const [allocation, updatedAsset] = await prisma.$transaction([
    prisma.allocation.update({
      where: { id },
      data: {
        status: 'RETURNED',
        returnedAt: new Date(),
        returnCondition: data.returnCondition,
        notes: data.notes || existing.notes,
        updatedBy: userId,
      },
      include: includeRelations,
    }),
    prisma.asset.update({
      where: { id: existing.assetId },
      data: {
        status: 'AVAILABLE',
        allocatedToId: null,
        allocatedAt: null,
        expectedReturn: null,
        condition: data.returnCondition,
        updatedBy: userId,
        version: { increment: 1 },
      },
    }),
  ]);

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'Allocation',
    entityId: id,
    oldValues: { status: existing.status },
    newValues: { status: 'RETURNED', returnCondition: data.returnCondition },
    ipAddress: ip,
    userAgent,
  });

  await createNotification({
    userId: existing.userId,
    type: NotificationType.ASSET_RETURNED,
    title: 'Asset Returned',
    message: `Asset "${existing.asset.name}" (${existing.asset.assetTag}) has been returned successfully`,
    link: `/allocations/${id}`,
  });

  return successResponse('Allocation returned successfully', allocation);
};

export const getActiveAllocations = async (query: AllocationQueryInput) => {
  return getAllAllocations({ ...query, status: 'ACTIVE' });
};
