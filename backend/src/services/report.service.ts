import prisma from '../config/database';
import { HTTP_STATUS } from '../constants';
import { AppError } from '../middleware/error';
import { successResponse, paginatedMeta } from '../utils/response';
import { reportQueue } from '../queues';
import { createAuditLog } from '../audit';
import logger from '../config/logger';
import {
  GenerateReportInput,
  ReportQueryInput,
} from '../validators/report.schema';

// ─── GENERATE ASSET REPORT ────────────────────────────────

export const generateAssetReport = async (
  data: GenerateReportInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: 'ASSET',
      format: data.format,
      status: 'PROCESSING',
      parameters: data.filters || {},
      generatedById: userId,
    },
  });

  const where: Record<string, unknown> = { deletedAt: null };
  if (data.filters?.departmentId) where.departmentId = data.filters.departmentId;
  if (data.filters?.categoryId) where.categoryId = data.filters.categoryId;
  if (data.filters?.status) where.status = data.filters.status;
  if (data.filters?.startDate || data.filters?.endDate) {
    where.createdAt = {
      ...(data.filters.startDate && { gte: data.filters.startDate }),
      ...(data.filters.endDate && { lte: data.filters.endDate }),
    };
  }

  const assets = await prisma.asset.findMany({
    where,
    include: {
      department: { select: { id: true, name: true, code: true } },
      category: { select: { id: true, name: true, code: true } },
      allocatedTo: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      _count: {
        select: {
          allocations: true,
          bookings: true,
          maintenanceTasks: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  await prisma.report.update({
    where: { id: report.id },
    data: { status: 'COMPLETED', completedAt: new Date() },
  });

  await reportQueue.add('asset-report', {
    reportId: report.id,
    data: assets,
    format: data.format,
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'Report',
    entityId: report.id,
    newValues: { type: 'ASSET', format: data.format, assetCount: assets.length },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Asset report generated successfully', {
    report: {
      id: report.id,
      name: report.name,
      type: report.type,
      format: report.format,
      status: 'COMPLETED',
      createdAt: report.createdAt,
      completedAt: new Date(),
    },
    data: assets,
  });
};

// ─── GENERATE MAINTENANCE REPORT ──────────────────────────

export const generateMaintenanceReport = async (
  data: GenerateReportInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: 'MAINTENANCE',
      format: data.format,
      status: 'PROCESSING',
      parameters: data.filters || {},
      generatedById: userId,
    },
  });

  const where: Record<string, unknown> = { deletedAt: null };
  if (data.filters?.assetId) where.assetId = data.filters.assetId;
  if (data.filters?.status) where.status = data.filters.status;
  if (data.filters?.startDate || data.filters?.endDate) {
    where.scheduledDate = {
      ...(data.filters.startDate && { gte: data.filters.startDate }),
      ...(data.filters.endDate && { lte: data.filters.endDate }),
    };
  }

  const tasks = await prisma.maintenanceTask.findMany({
    where,
    include: {
      asset: {
        select: { id: true, name: true, assetTag: true, department: { select: { name: true } } },
      },
      assignedTo: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      schedule: { select: { id: true, name: true, type: true } },
    },
    orderBy: { scheduledDate: 'desc' },
  });

  const summary = {
    totalTasks: tasks.length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    scheduled: tasks.filter((t) => t.status === 'SCHEDULED').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    overdue: tasks.filter((t) => t.status === 'OVERDUE').length,
    cancelled: tasks.filter((t) => t.status === 'CANCELLED').length,
    totalEstimatedCost: tasks.reduce((sum, t) => sum + (Number(t.estimatedCost) || 0), 0),
    totalActualCost: tasks
      .filter((t) => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + (Number(t.actualCost) || 0), 0),
    byType: {
      preventive: tasks.filter((t) => t.type === 'PREVENTIVE').length,
      corrective: tasks.filter((t) => t.type === 'CORRECTIVE').length,
      predictive: tasks.filter((t) => t.type === 'PREDICTIVE').length,
      emergency: tasks.filter((t) => t.type === 'EMERGENCY').length,
    },
  };

  await prisma.report.update({
    where: { id: report.id },
    data: { status: 'COMPLETED', completedAt: new Date() },
  });

  await reportQueue.add('maintenance-report', {
    reportId: report.id,
    data: tasks,
    summary,
    format: data.format,
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'Report',
    entityId: report.id,
    newValues: { type: 'MAINTENANCE', format: data.format, taskCount: tasks.length },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Maintenance report generated successfully', {
    report: {
      id: report.id,
      name: report.name,
      type: report.type,
      format: report.format,
      status: 'COMPLETED',
      createdAt: report.createdAt,
      completedAt: new Date(),
    },
    summary,
    data: tasks,
  });
};

// ─── GENERATE FINANCIAL REPORT ────────────────────────────

export const generateFinancialReport = async (
  data: GenerateReportInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: 'FINANCIAL',
      format: data.format,
      status: 'PROCESSING',
      parameters: data.filters || {},
      generatedById: userId,
    },
  });

  const where: Record<string, unknown> = { deletedAt: null };
  if (data.filters?.departmentId) where.departmentId = data.filters.departmentId;
  if (data.filters?.categoryId) where.categoryId = data.filters.categoryId;

  const assets = await prisma.asset.findMany({
    where,
    select: {
      id: true,
      assetTag: true,
      name: true,
      purchaseDate: true,
      purchasePrice: true,
      currentValue: true,
      salvageValue: true,
      status: true,
      condition: true,
      department: { select: { id: true, name: true, code: true } },
      category: { select: { id: true, name: true, code: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const maintenanceCosts = await prisma.maintenanceTask.aggregate({
    where: {
      deletedAt: null,
      status: 'COMPLETED',
      actualCost: { not: null },
      ...(data.filters?.startDate && { scheduledDate: { gte: data.filters.startDate } }),
      ...(data.filters?.endDate && { scheduledDate: { lte: data.filters.endDate } }),
    },
    _sum: { actualCost: true },
    _count: { id: true },
  });

  const totalPurchase = assets.reduce((sum, a) => sum + (Number(a.purchasePrice) || 0), 0);
  const totalCurrent = assets.reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
  const totalSalvage = assets.reduce((sum, a) => sum + (Number(a.salvageValue) || 0), 0);
  const totalDepreciation = totalPurchase - totalCurrent;

  const summary = {
    totalAssets: assets.length,
    totalPurchaseValue: totalPurchase,
    totalCurrentValue: totalCurrent,
    totalSalvageValue: totalSalvage,
    totalDepreciation,
    depreciationPercentage: totalPurchase > 0
      ? Math.round((totalDepreciation / totalPurchase) * 10000) / 100
      : 0,
    totalMaintenanceCost: Number(maintenanceCosts._sum.actualCost) || 0,
    maintenanceTaskCount: maintenanceCosts._count.id,
  };

  await prisma.report.update({
    where: { id: report.id },
    data: { status: 'COMPLETED', completedAt: new Date() },
  });

  await reportQueue.add('financial-report', {
    reportId: report.id,
    data: assets,
    summary,
    format: data.format,
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'Report',
    entityId: report.id,
    newValues: { type: 'FINANCIAL', format: data.format, assetCount: assets.length },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Financial report generated successfully', {
    report: {
      id: report.id,
      name: report.name,
      type: report.type,
      format: report.format,
      status: 'COMPLETED',
      createdAt: report.createdAt,
      completedAt: new Date(),
    },
    summary,
    data: assets,
  });
};

// ─── GENERATE BOOKING REPORT ──────────────────────────────

export const generateBookingReport = async (
  data: GenerateReportInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: 'BOOKING',
      format: data.format,
      status: 'PROCESSING',
      parameters: data.filters || {},
      generatedById: userId,
    },
  });

  const where: Record<string, unknown> = { deletedAt: null };
  if (data.filters?.assetId) where.assetId = data.filters.assetId;
  if (data.filters?.userId) where.userId = data.filters.userId;
  if (data.filters?.status) where.status = data.filters.status;
  if (data.filters?.startDate || data.filters?.endDate) {
    where.createdAt = {
      ...(data.filters.startDate && { gte: data.filters.startDate }),
      ...(data.filters.endDate && { lte: data.filters.endDate }),
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      asset: { select: { id: true, name: true, assetTag: true } },
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      approvedBy: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const summary = {
    totalBookings: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    approved: bookings.filter((b) => b.status === 'APPROVED').length,
    rejected: bookings.filter((b) => b.status === 'REJECTED').length,
    cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
    approvalRate:
      bookings.length > 0
        ? Math.round(
            (bookings.filter((b) => b.status === 'APPROVED' || b.status === 'COMPLETED').length /
              bookings.length) *
              10000
          ) / 100
        : 0,
    avgBookingDuration:
      bookings.length > 0
        ? Math.round(
            bookings.reduce((sum, b) => {
              const duration =
                (new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) /
                (24 * 60 * 60 * 1000);
              return sum + duration;
            }, 0) / bookings.length * 10
          ) / 10
        : 0,
  };

  await prisma.report.update({
    where: { id: report.id },
    data: { status: 'COMPLETED', completedAt: new Date() },
  });

  await reportQueue.add('booking-report', {
    reportId: report.id,
    data: bookings,
    summary,
    format: data.format,
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'Report',
    entityId: report.id,
    newValues: { type: 'BOOKING', format: data.format, bookingCount: bookings.length },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Booking report generated successfully', {
    report: {
      id: report.id,
      name: report.name,
      type: report.type,
      format: report.format,
      status: 'COMPLETED',
      createdAt: report.createdAt,
      completedAt: new Date(),
    },
    summary,
    data: bookings,
  });
};

// ─── GENERATE AUDIT REPORT ────────────────────────────────

export const generateAuditReport = async (
  data: GenerateReportInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: 'AUDIT',
      format: data.format,
      status: 'PROCESSING',
      parameters: data.filters || {},
      generatedById: userId,
    },
  });

  const where: Record<string, unknown> = {};
  if (data.filters?.userId) where.userId = data.filters.userId;
  if (data.filters?.startDate || data.filters?.endDate) {
    where.createdAt = {
      ...(data.filters.startDate && { gte: data.filters.startDate }),
      ...(data.filters.endDate && { lte: data.filters.endDate }),
    };
  }

  const logs = await prisma.auditLog.findMany({
    where,
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const entityBreakdown: Record<string, number> = {};
  const actionBreakdown: Record<string, number> = {};
  for (const log of logs) {
    entityBreakdown[log.entity] = (entityBreakdown[log.entity] || 0) + 1;
    actionBreakdown[log.action] = (actionBreakdown[log.action] || 0) + 1;
  }

  const summary = {
    totalLogs: logs.length,
    entityBreakdown,
    actionBreakdown,
    uniqueUsers: new Set(logs.map((l) => l.userId)).size,
    dateRange: {
      from: logs.length > 0 ? logs[logs.length - 1].createdAt : null,
      to: logs.length > 0 ? logs[0].createdAt : null,
    },
  };

  await prisma.report.update({
    where: { id: report.id },
    data: { status: 'COMPLETED', completedAt: new Date() },
  });

  await reportQueue.add('audit-report', {
    reportId: report.id,
    data: logs,
    summary,
    format: data.format,
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'Report',
    entityId: report.id,
    newValues: { type: 'AUDIT', format: data.format, logCount: logs.length },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Audit report generated successfully', {
    report: {
      id: report.id,
      name: report.name,
      type: report.type,
      format: report.format,
      status: 'COMPLETED',
      createdAt: report.createdAt,
      completedAt: new Date(),
    },
    summary,
    data: logs,
  });
};

// ─── GENERATE DEPARTMENT REPORT ───────────────────────────

export const generateDepartmentReport = async (
  data: GenerateReportInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: 'DEPARTMENT',
      format: data.format,
      status: 'PROCESSING',
      parameters: data.filters || {},
      generatedById: userId,
    },
  });

  const departments = await prisma.department.findMany({
    where: { deletedAt: null, isActive: true },
    include: {
      assets: {
        where: { deletedAt: null },
        select: {
          id: true,
          status: true,
          condition: true,
          currentValue: true,
          purchasePrice: true,
        },
      },
      users: {
        where: { deletedAt: null, status: 'ACTIVE' },
        select: { id: true, firstName: true, lastName: true, role: true },
      },
      _count: {
        select: {
          assets: { where: { deletedAt: null } },
          users: { where: { deletedAt: null, status: 'ACTIVE' } },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const departmentData = departments.map((dept) => {
    const totalAssets = dept.assets.length;
    const allocatedAssets = dept.assets.filter((a) => a.status === 'ALLOCATED').length;
    const totalValue = dept.assets.reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
    const totalPurchase = dept.assets.reduce((sum, a) => sum + (Number(a.purchasePrice) || 0), 0);

    return {
      id: dept.id,
      name: dept.name,
      code: dept.code,
      budget: dept.budget ? Number(dept.budget) : null,
      costCenter: dept.costCenter,
      location: dept.location,
      userCount: dept._count.users,
      assetCount: totalAssets,
      allocatedAssets,
      utilizationRate: totalAssets > 0 ? Math.round((allocatedAssets / totalAssets) * 10000) / 100 : 0,
      totalValue,
      totalPurchaseValue: totalPurchase,
      depreciation: totalPurchase - totalValue,
      users: dept.users,
    };
  });

  const summary = {
    totalDepartments: departments.length,
    totalAssets: departmentData.reduce((sum, d) => sum + d.assetCount, 0),
    totalUsers: departmentData.reduce((sum, d) => sum + d.userCount, 0),
    totalValue: departmentData.reduce((sum, d) => sum + d.totalValue, 0),
    avgUtilization:
      departmentData.length > 0
        ? Math.round(
            (departmentData.reduce((sum, d) => sum + d.utilizationRate, 0) / departmentData.length) * 100
          ) / 100
        : 0,
  };

  await prisma.report.update({
    where: { id: report.id },
    data: { status: 'COMPLETED', completedAt: new Date() },
  });

  await reportQueue.add('department-report', {
    reportId: report.id,
    data: departmentData,
    summary,
    format: data.format,
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'Report',
    entityId: report.id,
    newValues: { type: 'DEPARTMENT', format: data.format, departmentCount: departments.length },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Department report generated successfully', {
    report: {
      id: report.id,
      name: report.name,
      type: report.type,
      format: report.format,
      status: 'COMPLETED',
      createdAt: report.createdAt,
      completedAt: new Date(),
    },
    summary,
    data: departmentData,
  });
};

// ─── GET ALL REPORTS ──────────────────────────────────────

export const getAllReports = async (query: ReportQueryInput) => {
  const { page, limit, type, status, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (status) where.status = status;

  const [reports, totalItems] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.report.count({ where }),
  ]);

  const generatorIds = [...new Set(reports.map((r) => r.generatedById))];
  const generators =
    generatorIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: generatorIds } },
          select: { id: true, firstName: true, lastName: true, email: true },
        })
      : [];
  const generatorMap = new Map(generators.map((g) => [g.id, g]));

  const enrichedReports = reports.map((r) => ({
    ...r,
    generatedBy: generatorMap.get(r.generatedById) || null,
  }));

  return successResponse('Reports retrieved successfully', enrichedReports, paginatedMeta(totalItems, page, limit));
};

// ─── GET REPORT BY ID ─────────────────────────────────────

export const getReportById = async (id: string) => {
  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (!report) {
    throw new AppError('Report not found', HTTP_STATUS.NOT_FOUND);
  }

  const generator = await prisma.user.findUnique({
    where: { id: report.generatedById },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  return successResponse('Report retrieved successfully', {
    ...report,
    generatedBy: generator || null,
  });
};

// ─── DELETE REPORT ────────────────────────────────────────

export const deleteReport = async (
  id: string,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const report = await prisma.report.findUnique({ where: { id } });

  if (!report) {
    throw new AppError('Report not found', HTTP_STATUS.NOT_FOUND);
  }

  await prisma.report.delete({ where: { id } });

  await createAuditLog({
    userId,
    action: 'DELETE',
    entity: 'Report',
    entityId: id,
    oldValues: { name: report.name, type: report.type },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Report deleted successfully');
};

// ─── GENERATE REPORT (dispatcher) ────────────────────────

export const generateReport = async (
  data: GenerateReportInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  switch (data.type) {
    case 'ASSET':
      return generateAssetReport(data, userId, ip, userAgent);
    case 'MAINTENANCE':
      return generateMaintenanceReport(data, userId, ip, userAgent);
    case 'FINANCIAL':
      return generateFinancialReport(data, userId, ip, userAgent);
    case 'BOOKING':
      return generateBookingReport(data, userId, ip, userAgent);
    case 'AUDIT':
      return generateAuditReport(data, userId, ip, userAgent);
    case 'DEPARTMENT':
      return generateDepartmentReport(data, userId, ip, userAgent);
    default:
      throw new AppError('Invalid report type', HTTP_STATUS.BAD_REQUEST);
  }
};
