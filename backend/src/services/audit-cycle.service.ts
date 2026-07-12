import prisma from '../config/database';
import { HTTP_STATUS } from '../constants';
import { AppError } from '../middleware/error';
import { successResponse, paginatedMeta } from '../utils/response';
import { createAuditLog } from '../audit';
import { createNotification } from '../notifications';
import { NotificationType } from '@prisma/client';
import {
  CreateAuditCycleInput,
  UpdateAuditCycleInput,
  AuditCycleQueryInput,
  AssignAuditorsInput,
  VerifyAssetInput,
  CreateDiscrepancyInput,
  ResolveDiscrepancyInput,
} from '../validators/audit-cycle.schema';

const includeCycleRelations = {
  assignments: {
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true, employeeId: true } },
    },
  },
  _count: {
    select: { assignments: true, verifications: true, discrepancies: true },
  },
};

export const getAll = async (query: AuditCycleQueryInput) => {
  const { page, limit, search, sortBy, sortOrder, status } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deletedAt: null };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { departmentScope: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [cycles, totalItems] = await Promise.all([
    prisma.auditCycle.findMany({
      where,
      include: includeCycleRelations,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.auditCycle.count({ where }),
  ]);

  return successResponse('Audit cycles retrieved successfully', cycles, paginatedMeta(totalItems, page, limit));
};

export const getById = async (id: string) => {
  const cycle = await prisma.auditCycle.findUnique({
    where: { id },
    include: {
      ...includeCycleRelations,
      verifications: {
        include: {
          asset: { select: { id: true, assetTag: true, name: true, category: { select: { name: true } }, department: { select: { name: true } } } },
          auditor: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      discrepancies: {
        include: {
          asset: { select: { id: true, assetTag: true, name: true } },
          reportedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
  });
  if (!cycle) throw new AppError('Audit cycle not found', HTTP_STATUS.NOT_FOUND);
  return successResponse('Audit cycle retrieved successfully', cycle);
};

export const create = async (data: CreateAuditCycleInput, userId: string, ip?: string, userAgent?: string) => {
  const cycle = await prisma.auditCycle.create({
    data: {
      name: data.name,
      description: data.description,
      departmentScope: data.departmentScope,
      locationScope: data.locationScope,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      createdById: userId,
      createdBy: userId,
    },
    include: includeCycleRelations,
  });

  if (data.assetIds && data.assetIds.length > 0) {
    const assets = await prisma.asset.findMany({ where: { id: { in: data.assetIds }, deletedAt: null } });
    await prisma.auditVerification.createMany({
      data: assets.map((a) => ({
        cycleId: cycle.id,
        assetId: a.id,
        auditorId: userId,
        result: 'PENDING' as const,
      })),
    });
    await prisma.auditCycle.update({ where: { id: cycle.id }, data: { totalAssets: assets.length } });
  }

  if (data.auditorIds && data.auditorIds.length > 0) {
    await prisma.auditAssignment.createMany({
      data: data.auditorIds.map((uid) => ({ cycleId: cycle.id, userId: uid })),
      skipDuplicates: true,
    });
  }

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'AuditCycle',
    entityId: cycle.id,
    newValues: { name: data.name, startDate: data.startDate, endDate: data.endDate },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Audit cycle created successfully', cycle);
};

export const update = async (id: string, data: UpdateAuditCycleInput, userId: string, ip?: string, userAgent?: string) => {
  const existing = await prisma.auditCycle.findUnique({ where: { id } });
  if (!existing) throw new AppError('Audit cycle not found', HTTP_STATUS.NOT_FOUND);
  if (existing.status === 'COMPLETED' || existing.status === 'CANCELLED') {
    throw new AppError('Cannot update a completed or cancelled cycle', HTTP_STATUS.BAD_REQUEST);
  }

  const updateData: Record<string, unknown> = { ...data, updatedBy: userId, version: { increment: 1 } };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

  const cycle = await prisma.auditCycle.update({
    where: { id },
    data: updateData,
    include: includeCycleRelations,
  });

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'AuditCycle',
    entityId: id,
    newValues: data,
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Audit cycle updated successfully', cycle);
};

export const remove = async (id: string, userId: string, ip?: string, userAgent?: string) => {
  const existing = await prisma.auditCycle.findUnique({ where: { id } });
  if (!existing) throw new AppError('Audit cycle not found', HTTP_STATUS.NOT_FOUND);
  if (existing.status === 'IN_PROGRESS') {
    throw new AppError('Cannot delete an in-progress cycle', HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.auditCycle.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: userId } });

  await createAuditLog({
    userId,
    action: 'DELETE',
    entity: 'AuditCycle',
    entityId: id,
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Audit cycle deleted successfully', { id });
};

export const assignAuditors = async (id: string, data: AssignAuditorsInput, userId: string, ip?: string, userAgent?: string) => {
  const cycle = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycle) throw new AppError('Audit cycle not found', HTTP_STATUS.NOT_FOUND);
  if (cycle.status === 'COMPLETED' || cycle.status === 'CANCELLED') {
    throw new AppError('Cannot modify a completed or cancelled cycle', HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.auditAssignment.createMany({
    data: data.auditorIds.map((uid) => ({ cycleId: id, userId: uid })),
    skipDuplicates: true,
  });

  await createAuditLog({ userId, action: 'UPDATE', entity: 'AuditCycle', entityId: id, newValues: { auditorIds: data.auditorIds }, ipAddress: ip, userAgent });

  const updated = await prisma.auditCycle.findUnique({ where: { id }, include: includeCycleRelations });
  return successResponse('Auditors assigned successfully', updated);
};

export const verifyAsset = async (id: string, data: VerifyAssetInput, userId: string, ip?: string, userAgent?: string) => {
  const cycle = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycle) throw new AppError('Audit cycle not found', HTTP_STATUS.NOT_FOUND);
  if (cycle.status !== 'IN_PROGRESS' && cycle.status !== 'REVIEW') {
    throw new AppError('Cycle must be in progress or review to verify assets', HTTP_STATUS.BAD_REQUEST);
  }

  const existing = await prisma.auditVerification.findFirst({ where: { cycleId: id, assetId: data.assetId } });

  let verification;
  if (existing) {
    verification = await prisma.auditVerification.update({
      where: { id: existing.id },
      data: {
        result: data.result,
        currentLocation: data.currentLocation,
        recordedHolder: data.recordedHolder,
        notes: data.notes,
        auditorId: userId,
        verifiedAt: new Date(),
      },
    });
  } else {
    verification = await prisma.auditVerification.create({
      data: {
        cycleId: id,
        assetId: data.assetId,
        auditorId: userId,
        result: data.result,
        currentLocation: data.currentLocation,
        recordedHolder: data.recordedHolder,
        notes: data.notes,
      },
    });
  }

  const verifiedCount = await prisma.auditVerification.count({ where: { cycleId: id, result: { not: 'PENDING' } } });
  await prisma.auditCycle.update({ where: { id }, data: { verifiedCount } });

  await createAuditLog({ userId, action: 'UPDATE', entity: 'AuditVerification', entityId: verification.id, newValues: { result: data.result }, ipAddress: ip, userAgent });

  return successResponse('Asset verification recorded', verification);
};

export const createDiscrepancy = async (id: string, data: CreateDiscrepancyInput, userId: string, ip?: string, userAgent?: string) => {
  const cycle = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycle) throw new AppError('Audit cycle not found', HTTP_STATUS.NOT_FOUND);

  const discrepancy = await prisma.auditDiscrepancy.create({
    data: {
      cycleId: id,
      assetId: data.assetId,
      type: data.type,
      severity: data.severity,
      description: data.description,
      reportedById: userId,
    },
  });

  const discrepanciesCount = await prisma.auditDiscrepancy.count({ where: { cycleId: id } });
  await prisma.auditCycle.update({ where: { id }, data: { discrepanciesCount } });

  await createAuditLog({ userId, action: 'CREATE', entity: 'AuditDiscrepancy', entityId: discrepancy.id, newValues: data, ipAddress: ip, userAgent });

  return successResponse('Discrepancy reported', discrepancy);
};

export const resolveDiscrepancy = async (discrepancyId: string, data: ResolveDiscrepancyInput, userId: string, ip?: string, userAgent?: string) => {
  const existing = await prisma.auditDiscrepancy.findUnique({ where: { id: discrepancyId } });
  if (!existing) throw new AppError('Discrepancy not found', HTTP_STATUS.NOT_FOUND);
  if (existing.status === 'RESOLVED' || existing.status === 'DISMISSED') {
    throw new AppError('Discrepancy already resolved', HTTP_STATUS.BAD_REQUEST);
  }

  const discrepancy = await prisma.auditDiscrepancy.update({
    where: { id: discrepancyId },
    data: {
      status: data.status,
      resolutionNotes: data.resolutionNotes,
      resolvedById: userId,
      resolvedAt: new Date(),
    },
  });

  await createAuditLog({ userId, action: 'UPDATE', entity: 'AuditDiscrepancy', entityId: discrepancyId, newValues: data, ipAddress: ip, userAgent });

  return successResponse('Discrepancy resolved', discrepancy);
};

export const closeCycle = async (id: string, userId: string, ip?: string, userAgent?: string) => {
  const cycle = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycle) throw new AppError('Audit cycle not found', HTTP_STATUS.NOT_FOUND);
  if (cycle.status !== 'IN_PROGRESS' && cycle.status !== 'REVIEW') {
    throw new AppError('Cycle must be in progress or review to close', HTTP_STATUS.BAD_REQUEST);
  }

  const updated = await prisma.auditCycle.update({
    where: { id },
    data: { status: 'COMPLETED', updatedBy: userId },
    include: includeCycleRelations,
  });

  await createAuditLog({ userId, action: 'UPDATE', entity: 'AuditCycle', entityId: id, newValues: { status: 'COMPLETED' }, ipAddress: ip, userAgent });

  return successResponse('Audit cycle closed successfully', updated);
};

export const getCycleHistory = async (id: string) => {
  const cycle = await prisma.auditCycle.findUnique({ where: { id } });
  if (!cycle) throw new AppError('Audit cycle not found', HTTP_STATUS.NOT_FOUND);

  const [verifications, discrepancies, assignments] = await Promise.all([
    prisma.auditVerification.findMany({
      where: { cycleId: id },
      include: { asset: { select: { assetTag: true, name: true } }, auditor: { select: { firstName: true, lastName: true } } },
      orderBy: { verifiedAt: 'desc' },
    }),
    prisma.auditDiscrepancy.findMany({
      where: { cycleId: id },
      include: { asset: { select: { assetTag: true, name: true } }, reportedBy: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditAssignment.findMany({
      where: { cycleId: id },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    }),
  ]);

  return successResponse('Audit cycle history retrieved', { verifications, discrepancies, assignments });
};
