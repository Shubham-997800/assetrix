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
  TransferAllocationInput,
  ApproveTransferInput,
  RejectTransferInput,
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

export const transferAsset = async (
  id: string,
  data: TransferAllocationInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.allocation.findUnique({
    where: { id },
    include: { asset: true, user: true },
  });

  if (!existing) {
    throw new AppError('Allocation not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status !== 'ACTIVE') {
    throw new AppError('Only active allocations can be transferred', HTTP_STATUS.BAD_REQUEST);
  }

  const newAllocatedUser = await prisma.user.findUnique({ where: { id: data.newUserId } });
  if (!newAllocatedUser) {
    throw new AppError('Target user not found', HTTP_STATUS.NOT_FOUND);
  }

  if (data.newUserId === existing.userId) {
    throw new AppError('Cannot transfer allocation to the same user', HTTP_STATUS.BAD_REQUEST);
  }

  const [allocation, updatedAsset] = await prisma.$transaction([
    prisma.allocation.update({
      where: { id },
      data: {
        status: 'PENDING_APPROVAL',
        transferToUserId: data.newUserId,
        transferReason: data.reason,
        transferStatus: 'PENDING',
        updatedBy: userId,
      },
      include: includeRelations,
    }),
    prisma.asset.update({
      where: { id: existing.assetId },
      data: { updatedBy: userId, version: { increment: 1 } },
    }),
  ]);

  await createAuditLog({
    userId,
    action: 'TRANSFER',
    entity: 'Allocation',
    entityId: id,
    oldValues: { userId: existing.userId, status: 'ACTIVE' },
    newValues: { transferToUserId: data.newUserId, reason: data.reason },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Asset transfer initiated (pending approval)', allocation);
};

export const approveTransfer = async (
  id: string,
  data: ApproveTransferInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.allocation.findUnique({
    where: { id },
    include: { asset: true },
  });

  if (!existing) {
    throw new AppError('Allocation not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status !== 'PENDING_APPROVAL') {
    throw new AppError('No pending transfer for this allocation', HTTP_STATUS.BAD_REQUEST);
  }

  if (!existing.transferToUserId) {
    throw new AppError('Transfer target user not found on allocation', HTTP_STATUS.BAD_REQUEST);
  }

  const [completedAllocation, newAllocation, updatedAsset] = await prisma.$transaction([
    prisma.allocation.update({
      where: { id },
      data: {
        status: 'TRANSFERRED',
        returnedAt: new Date(),
        notes: data.notes || existing.notes,
        updatedBy: userId,
      },
    }),
    prisma.allocation.create({
      data: {
        assetId: existing.assetId,
        userId: existing.transferToUserId,
        departmentId: existing.departmentId,
        expectedReturn: existing.expectedReturn,
        condition: existing.condition,
        status: 'ACTIVE',
        approvedBy: userId,
        createdBy: userId,
        notes: `Transfer from previous allocation (${existing.id})`,
      },
      include: includeRelations,
    }),
    prisma.asset.update({
      where: { id: existing.assetId },
      data: {
        allocatedToId: existing.transferToUserId,
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
    oldValues: { status: 'PENDING_APPROVAL', transferToUserId: existing.transferToUserId },
    newValues: { status: 'TRANSFERRED' },
    ipAddress: ip,
    userAgent,
  });

  await createNotification({
    userId: existing.transferToUserId,
    type: NotificationType.ASSET_ASSIGNED,
    title: 'Asset Transferred to You',
    message: `Asset "${existing.asset.name}" (${existing.asset.assetTag}) has been transferred to you.`,
    link: `/allocations/${newAllocation.id}`,
  });

  return successResponse('Transfer approved and completed', newAllocation);
};

export const rejectTransfer = async (
  id: string,
  data: RejectTransferInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.allocation.findUnique({
    where: { id },
    include: { asset: true },
  });

  if (!existing) {
    throw new AppError('Allocation not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status !== 'PENDING_APPROVAL') {
    throw new AppError('No pending transfer for this allocation', HTTP_STATUS.BAD_REQUEST);
  }

  const allocation = await prisma.allocation.update({
    where: { id },
    data: {
      status: 'ACTIVE',
      transferStatus: 'REJECTED',
      transferToUserId: null,
      transferReason: null,
      notes: `Transfer rejected: ${data.rejectionReason}`,
      updatedBy: userId,
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'Allocation',
    entityId: id,
    newValues: { status: 'ACTIVE', transferStatus: 'REJECTED' },
    ipAddress: ip,
    userAgent,
  });

  await createNotification({
    userId: existing.userId,
    type: NotificationType.ASSET_RETURNED,
    title: 'Transfer Rejected',
    message: `Your transfer request for asset "${existing.asset.name}" (${existing.asset.assetTag}) was rejected. Reason: ${data.rejectionReason}`,
    link: `/allocations/${id}`,
  });

  return successResponse('Transfer rejected', allocation);
};

export const getPendingTransfers = async (query: AllocationQueryInput) => {
  return getAllAllocations({ ...query, status: 'PENDING_APPROVAL' });
};
