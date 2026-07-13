import prisma from '../config/database';
import { getRedisConnection } from '../config/redis';
import { CACHE_TTL, REDIS_KEYS } from '../constants';
import { successResponse } from '../utils/response';
import logger from '../config/logger';

const redis = () => getRedisConnection();

const getCached = async <T>(key: string): Promise<T | null> => {
  try {
    const client = await redis();
    const cached = await client.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
  } catch {
    return null;
  }
};

const setCache = async (key: string, data: unknown, ttl: number): Promise<void> => {
  try {
    const client = await redis();
    await client.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (err) {
    logger.warn({ key, error: err }, 'Redis cache write failed');
  }
};

const invalidatePattern = async (pattern: string): Promise<void> => {
  try {
    const client = await redis();
    const keys = await client.keys(pattern);
    if (keys.length > 0) await client.del(...keys);
  } catch (err) {
    logger.warn({ pattern, error: err }, 'Redis cache invalidation failed');
  }
};

// ─── DASHBOARD STATS ──────────────────────────────────────

export const getDashboardStats = async () => {
  const cacheKey = REDIS_KEYS.ANALYTICS_CACHE('dashboard');
  const cached = await getCached(cacheKey);
  if (cached) return successResponse('Dashboard stats retrieved (cached)', cached);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    totalAssets,
    assetStatusCounts,
    totalValueResult,
    utilizationResult,
    upcomingMaintenanceCount,
    recentActivity,
    assetsByDepartment,
    recentBookings,
  ] = await Promise.all([
    prisma.asset.count({ where: { deletedAt: null } }),
    prisma.asset.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.asset.aggregate({
      where: { deletedAt: null },
      _sum: { currentValue: true, purchasePrice: true },
    }),
    prisma.allocation.count({
      where: { status: 'ACTIVE' },
    }),
    prisma.maintenanceTask.count({
      where: {
        status: { in: ['SCHEDULED', 'OVERDUE'] },
        scheduledDate: { lte: sevenDaysFromNow },
        deletedAt: null,
      },
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        description: true,
        createdAt: true,
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    }),
    prisma.department.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        id: true,
        name: true,
        _count: { select: { assets: true } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.booking.findMany({
      where: {
        status: { in: ['PENDING', 'APPROVED'] },
        startDate: { gte: now },
        deletedAt: null,
      },
      take: 5,
      orderBy: { startDate: 'asc' },
      select: {
        id: true,
        purpose: true,
        startDate: true,
        endDate: true,
        status: true,
        asset: { select: { id: true, name: true, assetTag: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
  ]);

  const statusBreakdown: Record<string, number> = {};
  for (const item of assetStatusCounts) {
    statusBreakdown[item.status] = item._count.id;
  }

  const totalAssetCount = totalAssets;
  const allocatedCount = statusBreakdown['ALLOCATED'] || 0;
  const utilizationRate = totalAssetCount > 0
    ? Math.round((utilizationResult / totalAssetCount) * 10000) / 100
    : 0;

  const data = {
    totalAssets: totalAssetCount,
    totalValue: Number(totalValueResult._sum.currentValue) || 0,
    totalPurchaseValue: Number(totalValueResult._sum.purchasePrice) || 0,
    utilizationRate,
    allocatedAssets: allocatedCount,
    availableAssets: statusBreakdown['AVAILABLE'] || 0,
    maintenanceAssets: statusBreakdown['MAINTENANCE'] || 0,
    retiredAssets: statusBreakdown['RETIRED'] || 0,
    lostAssets: statusBreakdown['LOST'] || 0,
    stolenAssets: statusBreakdown['STOLEN'] || 0,
    upcomingMaintenanceCount,
    recentActivity,
    assetsByDepartment,
    upcomingBookings: recentBookings,
  };

  await setCache(cacheKey, data, CACHE_TTL.SHORT);
  return successResponse('Dashboard stats retrieved successfully', data);
};

// ─── ASSET ANALYTICS ──────────────────────────────────────

export const getAssetAnalytics = async (filters?: {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  categoryId?: string;
}) => {
  const cacheKey = REDIS_KEYS.ANALYTICS_CACHE(`assets:${JSON.stringify(filters || {})}`);
  const cached = await getCached(cacheKey);
  if (cached) return successResponse('Asset analytics retrieved (cached)', cached);

  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

  const whereBase: Record<string, unknown> = { deletedAt: null };
  if (filters?.departmentId) whereBase.departmentId = filters.departmentId;
  if (filters?.categoryId) whereBase.categoryId = filters.categoryId;

  const [
    byStatus,
    byCondition,
    byDepartment,
    byCategory,
    purchaseTrend,
    depreciationTrend,
    ageDistribution,
    topManufacturers,
  ] = await Promise.all([
    prisma.asset.groupBy({
      by: ['status'],
      where: whereBase,
      _count: { id: true },
      _sum: { currentValue: true },
    }),
    prisma.asset.groupBy({
      by: ['condition'],
      where: whereBase,
      _count: { id: true },
      _sum: { currentValue: true },
    }),
    prisma.department.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        _count: { select: { assets: { where: whereBase } } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.assetCategory.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        _count: { select: { assets: { where: whereBase } } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.asset.groupBy({
      by: ['purchaseDate'],
      where: {
        ...whereBase,
        purchaseDate: { not: null },
        ...(filters?.startDate && { purchaseDate: { gte: new Date(filters.startDate) } }),
        ...(filters?.endDate && { purchaseDate: { lte: new Date(filters.endDate) } }),
      },
      _count: { id: true },
      _sum: { purchasePrice: true },
      orderBy: { purchaseDate: 'asc' },
    }),
    prisma.$queryRaw<
      Array<{ month: string; totalPurchase: number; totalCurrent: number; depreciation: number }>
    >`
      SELECT 
        TO_CHAR("purchaseDate", 'YYYY-MM') as month,
        COALESCE(SUM("purchasePrice"), 0)::float as "totalPurchase",
        COALESCE(SUM("currentValue"), 0)::float as "totalCurrent",
        COALESCE(SUM("purchasePrice" - "currentValue"), 0)::float as depreciation
      FROM "Asset"
      WHERE "deletedAt" IS NULL
        AND "purchaseDate" IS NOT NULL
        AND "purchaseDate" >= ${twelveMonthsAgo}
      GROUP BY TO_CHAR("purchaseDate", 'YYYY-MM')
      ORDER BY month ASC
    `,
    prisma.$queryRaw<
      Array<{ bracket: string; count: bigint }>
    >`
      SELECT 
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(NOW()::date, "purchaseDate"::date)) < 1 THEN '0-1 years'
          WHEN EXTRACT(YEAR FROM AGE(NOW()::date, "purchaseDate"::date)) < 3 THEN '1-3 years'
          WHEN EXTRACT(YEAR FROM AGE(NOW()::date, "purchaseDate"::date)) < 5 THEN '3-5 years'
          WHEN EXTRACT(YEAR FROM AGE(NOW()::date, "purchaseDate"::date)) < 10 THEN '5-10 years'
          ELSE '10+ years'
        END as bracket,
        COUNT(*) as count
      FROM "Asset"
      WHERE "deletedAt" IS NULL AND "purchaseDate" IS NOT NULL
      GROUP BY bracket
      ORDER BY MIN(EXTRACT(YEAR FROM AGE(NOW()::date, "purchaseDate"::date)))
    `,
    prisma.asset.groupBy({
      by: ['manufacturer'],
      where: { ...whereBase, manufacturer: { not: null } },
      _count: { id: true },
      _sum: { currentValue: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
  ]);

  const data = {
    byStatus: byStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
      totalValue: Number(s._sum.currentValue) || 0,
    })),
    byCondition: byCondition.map((c) => ({
      condition: c.condition,
      count: c._count.id,
      totalValue: Number(c._sum.currentValue) || 0,
    })),
    byDepartment: byDepartment
      .filter((d) => d._count.assets > 0)
      .map((d) => ({
        departmentId: d.id,
        name: d.name,
        code: d.code,
        assetCount: d._count.assets,
      })),
    byCategory: byCategory
      .filter((c) => c._count.assets > 0)
      .map((c) => ({
        categoryId: c.id,
        name: c.name,
        code: c.code,
        assetCount: c._count.assets,
      })),
    depreciationTrend: depreciationTrend.map((d) => ({
      month: d.month,
      totalPurchase: d.totalPurchase,
      totalCurrent: d.totalCurrent,
      depreciation: d.depreciation,
    })),
    ageDistribution: ageDistribution.map((a) => ({
      bracket: a.bracket,
      count: Number(a.count),
    })),
    topManufacturers: topManufacturers.map((m) => ({
      manufacturer: m.manufacturer,
      count: m._count.id,
      totalValue: Number(m._sum.currentValue) || 0,
    })),
  };

  await setCache(cacheKey, data, CACHE_TTL.MEDIUM);
  return successResponse('Asset analytics retrieved successfully', data);
};

// ─── MAINTENANCE ANALYTICS ─────────────────────────────────

export const getMaintenanceAnalytics = async (filters?: {
  startDate?: string;
  endDate?: string;
  assetId?: string;
}) => {
  const cacheKey = REDIS_KEYS.ANALYTICS_CACHE(`maintenance:${JSON.stringify(filters || {})}`);
  const cached = await getCached(cacheKey);
  if (cached) return successResponse('Maintenance analytics retrieved (cached)', cached);

  const whereBase: Record<string, unknown> = { deletedAt: null };
  if (filters?.assetId) whereBase.assetId = filters.assetId;

  const dateFilter: Record<string, unknown> = {};
  if (filters?.startDate) dateFilter.gte = new Date(filters.startDate);
  if (filters?.endDate) dateFilter.lte = new Date(filters.endDate);
  if (Object.keys(dateFilter).length > 0) whereBase.createdAt = dateFilter;

  const [
    statusCounts,
    typeCounts,
    costAggregates,
    completionStats,
    monthlyCosts,
    tasksByPriority,
    overdueTasks,
    recentCompletedTasks,
  ] = await Promise.all([
    prisma.maintenanceTask.groupBy({
      by: ['status'],
      where: whereBase,
      _count: { id: true },
    }),
    prisma.maintenanceTask.groupBy({
      by: ['type'],
      where: whereBase,
      _count: { id: true },
      _sum: { actualCost: true },
    }),
    prisma.maintenanceTask.aggregate({
      where: { ...whereBase, status: 'COMPLETED' },
      _sum: { estimatedCost: true, actualCost: true },
      _avg: { actualCost: true },
      _count: { id: true },
    }),
    prisma.$queryRaw<
      Array<{ asset_id: string; asset_name: string; total_tasks: bigint; completed: bigint; avg_days: number | null }>
    >`
      SELECT 
        a.id as asset_id,
        a.name as asset_name,
        COUNT(mt.id) as total_tasks,
        COUNT(CASE WHEN mt.status = 'COMPLETED' THEN 1 END) as completed,
        AVG(
          CASE WHEN mt.status = 'COMPLETED' AND mt."startedAt" IS NOT NULL AND mt."completedAt" IS NOT NULL
          THEN EXTRACT(EPOCH FROM (mt."completedAt" - mt."startedAt")) / 86400.0
          ELSE NULL END
        )::float as avg_days
      FROM "MaintenanceTask" mt
      JOIN "Asset" a ON a.id = mt."assetId"
      WHERE mt."deletedAt" IS NULL
      GROUP BY a.id, a.name
      HAVING COUNT(mt.id) > 0
      ORDER BY COUNT(mt.id) DESC
      LIMIT 20
    `,
    prisma.$queryRaw<
      Array<{ month: string; cost: number; count: bigint }>
    >`
      SELECT 
        TO_CHAR("scheduledDate", 'YYYY-MM') as month,
        COALESCE(SUM("actualCost"), 0)::float as cost,
        COUNT(*) as count
      FROM "MaintenanceTask"
      WHERE "deletedAt" IS NULL
        AND "scheduledDate" IS NOT NULL
        AND "scheduledDate" >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR("scheduledDate", 'YYYY-MM')
      ORDER BY month ASC
    `,
    prisma.maintenanceTask.groupBy({
      by: ['priority'],
      where: whereBase,
      _count: { id: true },
    }),
    prisma.maintenanceTask.count({
      where: { ...whereBase, status: 'OVERDUE' },
    }),
    prisma.maintenanceTask.findMany({
      where: { ...whereBase, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        type: true,
        actualCost: true,
        scheduledDate: true,
        startedAt: true,
        completedAt: true,
        asset: { select: { id: true, name: true, assetTag: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
  ]);

  const completedCount = completionStats[0]?.completed || 0;
  const totalTasksCount = completionStats[0]?.total_tasks || 0;

  const data = {
    overview: {
      totalTasks: totalTasksCount,
      completedTasks: completedCount,
      overdueTasks,
      completionRate: totalTasksCount > 0
        ? Math.round((Number(completedCount) / Number(totalTasksCount)) * 10000) / 100
        : 0,
    },
    byStatus: statusCounts.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    byType: typeCounts.map((t) => ({
      type: t.type,
      count: t._count.id,
      totalCost: Number(t._sum.actualCost) || 0,
    })),
    costs: {
      totalEstimated: Number(costAggregates._sum.estimatedCost) || 0,
      totalActual: Number(costAggregates._sum.actualCost) || 0,
      averageCost: Number(costAggregates._avg.actualCost) || 0,
      completedCount: costAggregates._count.id,
    },
    monthlyTrend: monthlyCosts.map((m) => ({
      month: m.month,
      cost: m.cost,
      taskCount: Number(m.count),
    })),
    byPriority: tasksByPriority
      .map((p) => ({
        priority: p.priority,
        label: p.priority === 1 ? 'Critical' : p.priority === 2 ? 'High' : p.priority === 3 ? 'Medium' : p.priority === 4 ? 'Low' : 'Info',
        count: p._count.id,
      }))
      .sort((a, b) => a.priority - b.priority),
    assetCompletionRates: completionStats.map((c) => ({
      assetId: c.asset_id,
      assetName: c.asset_name,
      totalTasks: Number(c.total_tasks),
      completedTasks: Number(c.completed),
      averageDaysToComplete: c.avg_days ? Math.round(c.avg_days * 10) / 10 : null,
    })),
    recentCompleted: recentCompletedTasks,
  };

  await setCache(cacheKey, data, CACHE_TTL.MEDIUM);
  return successResponse('Maintenance analytics retrieved successfully', data);
};

// ─── BOOKING ANALYTICS ────────────────────────────────────

export const getBookingAnalytics = async (filters?: {
  startDate?: string;
  endDate?: string;
}) => {
  const cacheKey = REDIS_KEYS.ANALYTICS_CACHE(`bookings:${JSON.stringify(filters || {})}`);
  const cached = await getCached(cacheKey);
  if (cached) return successResponse('Booking analytics retrieved (cached)', cached);

  const now = new Date();

  const [
    statusCounts,
    popularAssets,
    monthlyBookings,
    utilizationByAsset,
    topBookers,
    peakPeriods,
  ] = await Promise.all([
    prisma.booking.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.booking.groupBy({
      by: ['assetId'],
      where: {
        deletedAt: null,
        ...(filters?.startDate && { createdAt: { gte: new Date(filters.startDate) } }),
        ...(filters?.endDate && { createdAt: { lte: new Date(filters.endDate) } }),
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    prisma.$queryRaw<
      Array<{ month: string; total: bigint; approved: bigint; rejected: bigint; cancelled: bigint }>
    >`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COUNT(*) as total,
        COUNT(CASE WHEN "status" = 'APPROVED' THEN 1 END) as approved,
        COUNT(CASE WHEN "status" = 'REJECTED' THEN 1 END) as rejected,
        COUNT(CASE WHEN "status" = 'CANCELLED' THEN 1 END) as cancelled
      FROM "Booking"
      WHERE "deletedAt" IS NULL
        AND "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month ASC
    `,
    prisma.$queryRaw<
      Array<{ asset_id: string; asset_name: string; asset_tag: string; booking_days: number; total_days: bigint }>
    >`
      SELECT 
        a.id as asset_id,
        a.name as asset_name,
        a."assetTag" as asset_tag,
        COALESCE(SUM(
          EXTRACT(EPOCH FROM (
            LEAST(b."endDate", NOW()) - GREATEST(b."startDate", NOW() - INTERVAL '365 days')
          )) / 86400.0
        ), 0)::float as booking_days,
        365.0 as total_days
      FROM "Asset" a
      LEFT JOIN "Booking" b ON b."assetId" = a.id AND b."status" = 'APPROVED'
        AND b."startDate" <= NOW() AND b."endDate" >= NOW() - INTERVAL '365 days'
      WHERE a."deletedAt" IS NULL
      GROUP BY a.id, a.name, a."assetTag"
      HAVING COUNT(b.id) > 0
      ORDER BY booking_days DESC
      LIMIT 15
    `,
    prisma.booking.groupBy({
      by: ['userId'],
      where: {
        deletedAt: null,
        status: { in: ['APPROVED', 'COMPLETED'] },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    prisma.$queryRaw<
      Array<{ day_of_week: string; count: bigint }>
    >`
      SELECT 
        CASE EXTRACT(DOW FROM "startDate")
          WHEN 0 THEN 'Sunday'
          WHEN 1 THEN 'Monday'
          WHEN 2 THEN 'Tuesday'
          WHEN 3 THEN 'Wednesday'
          WHEN 4 THEN 'Thursday'
          WHEN 5 THEN 'Friday'
          WHEN 6 THEN 'Saturday'
        END as day_of_week,
        COUNT(*) as count
      FROM "Booking"
      WHERE "deletedAt" IS NULL
        AND "startDate" >= NOW() - INTERVAL '6 months'
      GROUP BY EXTRACT(DOW FROM "startDate")
      ORDER BY EXTRACT(DOW FROM "startDate")
    `,
  ]);

  const assetIds = popularAssets.map((a) => a.assetId);
  const assets = assetIds.length > 0
    ? await prisma.asset.findMany({
        where: { id: { in: assetIds } },
        select: { id: true, name: true, assetTag: true },
      })
    : [];
  const assetMap = new Map(assets.map((a) => [a.id, a]));

  const userIds = topBookers.map((b) => b.userId);
  const users = userIds.length > 0
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, firstName: true, lastName: true, email: true },
      })
    : [];
  const userMap = new Map(users.map((u) => [u.id, u]));

  const data = {
    byStatus: statusCounts.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    popularAssets: popularAssets.map((a) => {
      const asset = assetMap.get(a.assetId);
      return {
        assetId: a.assetId,
        name: asset?.name || 'Unknown',
        assetTag: asset?.assetTag || 'N/A',
        bookingCount: a._count.id,
      };
    }),
    monthlyTrend: monthlyBookings.map((m) => ({
      month: m.month,
      total: Number(m.total),
      approved: Number(m.approved),
      rejected: Number(m.rejected),
      cancelled: Number(m.cancelled),
    })),
    utilizationByAsset: utilizationByAsset.map((u) => ({
      assetId: u.asset_id,
      name: u.asset_name,
      assetTag: u.asset_tag,
      utilizationRate: Math.round((u.booking_days / Number(u.total_days)) * 10000) / 100,
      bookingDays: Math.round(u.booking_days * 10) / 10,
    })),
    topBookers: topBookers.map((b) => {
      const user = userMap.get(b.userId);
      return {
        userId: b.userId,
        name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        email: user?.email || 'N/A',
        bookingCount: b._count.id,
      };
    }),
    peakDays: peakPeriods.map((p) => ({
      dayOfWeek: p.day_of_week,
      bookingCount: Number(p.count),
    })),
  };

  await setCache(cacheKey, data, CACHE_TTL.MEDIUM);
  return successResponse('Booking analytics retrieved successfully', data);
};

// ─── FINANCIAL ANALYTICS ──────────────────────────────────

export const getFinancialAnalytics = async (filters?: {
  departmentId?: string;
  categoryId?: string;
}) => {
  const cacheKey = REDIS_KEYS.ANALYTICS_CACHE(`financial:${JSON.stringify(filters || {})}`);
  const cached = await getCached(cacheKey);
  if (cached) return successResponse('Financial analytics retrieved (cached)', cached);

  const whereBase: Record<string, unknown> = { deletedAt: null };
  if (filters?.departmentId) whereBase.departmentId = filters.departmentId;
  if (filters?.categoryId) whereBase.categoryId = filters.categoryId;

  const [
    totalValues,
    valuesByDepartment,
    valuesByCategory,
    replacementCost,
    warrantyExpiring,
    depreciationByCategory,
  ] = await Promise.all([
    prisma.asset.aggregate({
      where: whereBase,
      _sum: { purchasePrice: true, currentValue: true, salvageValue: true },
      _count: { id: true },
    }),
    prisma.$queryRaw<
      Array<{ dept_id: string; dept_name: string; total_purchase: number; total_current: number; total_salvage: number; count: bigint }>
    >`
      SELECT 
        d.id as dept_id,
        d.name as dept_name,
        COALESCE(SUM(a."purchasePrice"), 0)::float as total_purchase,
        COALESCE(SUM(a."currentValue"), 0)::float as total_current,
        COALESCE(SUM(a."salvageValue"), 0)::float as total_salvage,
        COUNT(a.id) as count
      FROM "Department" d
      LEFT JOIN "Asset" a ON a."departmentId" = d.id AND a."deletedAt" IS NULL
      WHERE d."deletedAt" IS NULL AND d."isActive" = true
      GROUP BY d.id, d.name
      HAVING COUNT(a.id) > 0
      ORDER BY total_current DESC
    `,
    prisma.$queryRaw<
      Array<{ cat_id: string; cat_name: string; total_purchase: number; total_current: number; total_salvage: number; count: bigint }>
    >`
      SELECT 
        ac.id as cat_id,
        ac.name as cat_name,
        COALESCE(SUM(a."purchasePrice"), 0)::float as total_purchase,
        COALESCE(SUM(a."currentValue"), 0)::float as total_current,
        COALESCE(SUM(a."salvageValue"), 0)::float as total_salvage,
        COUNT(a.id) as count
      FROM "AssetCategory" ac
      LEFT JOIN "Asset" a ON a."categoryId" = ac.id AND a."deletedAt" IS NULL
      WHERE ac."deletedAt" IS NULL AND ac."isActive" = true
      GROUP BY ac.id, ac.name
      HAVING COUNT(a.id) > 0
      ORDER BY total_current DESC
    `,
    prisma.maintenanceTask.aggregate({
      where: {
        ...whereBase,
        status: 'COMPLETED',
        actualCost: { not: null },
      },
      _sum: { actualCost: true },
      _count: { id: true },
    }),
    prisma.asset.findMany({
      where: {
        ...whereBase,
        warrantyExpiry: { gte: new Date(), lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      },
      select: {
        id: true,
        name: true,
        assetTag: true,
        warrantyExpiry: true,
        warrantyProvider: true,
        currentValue: true,
      },
      orderBy: { warrantyExpiry: 'asc' },
      take: 20,
    }),
    prisma.$queryRaw<
      Array<{ cat_name: string; total_purchase: number; total_current: number; depreciation_pct: number }>
    >`
      SELECT 
        ac.name as cat_name,
        COALESCE(SUM(a."purchasePrice"), 0)::float as total_purchase,
        COALESCE(SUM(a."currentValue"), 0)::float as total_current,
        CASE 
          WHEN SUM(a."purchasePrice") > 0 
          THEN ROUND(((SUM(a."purchasePrice") - SUM(a."currentValue")) / SUM(a."purchasePrice") * 100)::numeric, 2)
          ELSE 0 
        END::float as depreciation_pct
      FROM "AssetCategory" ac
      LEFT JOIN "Asset" a ON a."categoryId" = ac.id AND a."deletedAt" IS NULL
      WHERE ac."deletedAt" IS NULL AND ac."isActive" = true
      GROUP BY ac.id, ac.name
      HAVING SUM(a."purchasePrice") > 0
      ORDER BY depreciation_pct DESC
    `,
  ]);

  const totalPurchase = Number(totalValues._sum.purchasePrice) || 0;
  const totalCurrent = Number(totalValues._sum.currentValue) || 0;
  const totalDepreciation = totalPurchase - totalCurrent;

  const data = {
    overview: {
      totalAssets: totalValues._count.id,
      totalPurchaseValue: totalPurchase,
      totalCurrentValue: totalCurrent,
      totalSalvageValue: Number(totalValues._sum.salvageValue) || 0,
      totalDepreciation,
      depreciationPercentage: totalPurchase > 0
        ? Math.round((totalDepreciation / totalPurchase) * 10000) / 100
        : 0,
      totalMaintenanceCost: Number(replacementCost._sum.actualCost) || 0,
      maintenanceTaskCount: replacementCost._count.id,
    },
    byDepartment: valuesByDepartment.map((d) => ({
      departmentId: d.dept_id,
      name: d.dept_name,
      totalPurchaseValue: d.total_purchase,
      totalCurrentValue: d.total_current,
      totalSalvageValue: d.total_salvage,
      assetCount: Number(d.count),
      depreciation: d.total_purchase - d.total_current,
    })),
    byCategory: valuesByCategory.map((c) => ({
      categoryId: c.cat_id,
      name: c.cat_name,
      totalPurchaseValue: c.total_purchase,
      totalCurrentValue: c.total_current,
      totalSalvageValue: c.total_salvage,
      assetCount: Number(c.count),
      depreciation: c.total_purchase - c.total_current,
    })),
    depreciationByCategory: depreciationByCategory.map((d) => ({
      name: d.cat_name,
      totalPurchase: d.total_purchase,
      totalCurrent: d.total_current,
      depreciationPercentage: d.depreciation_pct,
    })),
    warrantyExpiring: warrantyExpiring.map((w) => ({
      id: w.id,
      name: w.name,
      assetTag: w.assetTag,
      warrantyExpiry: w.warrantyExpiry,
      warrantyProvider: w.warrantyProvider,
      currentValue: Number(w.currentValue) || 0,
      daysUntilExpiry: Math.ceil(
        (new Date(w.warrantyExpiry!).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
      ),
    })),
  };

  await setCache(cacheKey, data, CACHE_TTL.MEDIUM);
  return successResponse('Financial analytics retrieved successfully', data);
};

// ─── DEPARTMENT ANALYTICS ─────────────────────────────────

export const getDepartmentAnalytics = async () => {
  const cacheKey = REDIS_KEYS.ANALYTICS_CACHE('departments');
  const cached = await getCached(cacheKey);
  if (cached) return successResponse('Department analytics retrieved (cached)', cached);

  const departments = await prisma.department.findMany({
    where: { deletedAt: null, isActive: true },
    select: {
      id: true,
      name: true,
      code: true,
      budget: true,
      costCenter: true,
      assets: {
        where: { deletedAt: null },
        select: {
          id: true,
          status: true,
          condition: true,
          currentValue: true,
          purchasePrice: true,
          allocations: {
            where: { status: 'ACTIVE' },
            select: { id: true },
          },
        },
      },
      users: {
        where: { deletedAt: null, status: 'ACTIVE' },
        select: { id: true },
      },
      allocations: {
        select: {
          id: true,
          status: true,
          allocatedAt: true,
          returnedAt: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const departmentAnalytics = departments.map((dept) => {
    const totalAssets = dept.assets.length;
    const allocatedAssets = dept.assets.filter(
      (a) => a.status === 'ALLOCATED'
    ).length;
    const totalValue = dept.assets.reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
    const totalPurchaseValue = dept.assets.reduce(
      (sum, a) => sum + (Number(a.purchasePrice) || 0),
      0
    );
    const utilizationRate =
      totalAssets > 0
        ? Math.round((allocatedAssets / totalAssets) * 10000) / 100
        : 0;

    const statusBreakdown: Record<string, number> = {};
    for (const asset of dept.assets) {
      statusBreakdown[asset.status] = (statusBreakdown[asset.status] || 0) + 1;
    }

    const conditionBreakdown: Record<string, number> = {};
    for (const asset of dept.assets) {
      conditionBreakdown[asset.condition] = (conditionBreakdown[asset.condition] || 0) + 1;
    }

    const activeAllocations = dept.allocations.filter((a) => a.status === 'ACTIVE').length;
    const totalAllocations = dept.allocations.length;
    const avgAllocationDuration =
      dept.allocations.filter((a) => a.returnedAt).length > 0
        ? dept.allocations
            .filter((a) => a.returnedAt)
            .reduce((sum, a) => {
              const duration =
                new Date(a.returnedAt!).getTime() - new Date(a.allocatedAt).getTime();
              return sum + duration / (24 * 60 * 60 * 1000);
            }, 0) /
          dept.allocations.filter((a) => a.returnedAt).length
        : 0;

    return {
      departmentId: dept.id,
      name: dept.name,
      code: dept.code,
      budget: dept.budget ? Number(dept.budget) : null,
      costCenter: dept.costCenter,
      userCount: dept.users.length,
      totalAssets,
      allocatedAssets,
      availableAssets: statusBreakdown['AVAILABLE'] || 0,
      maintenanceAssets: statusBreakdown['MAINTENANCE'] || 0,
      utilizationRate,
      totalValue,
      totalPurchaseValue,
      totalDepreciation: totalPurchaseValue - totalValue,
      statusBreakdown,
      conditionBreakdown,
      allocationStats: {
        active: activeAllocations,
        total: totalAllocations,
        avgDurationDays: Math.round(avgAllocationDuration * 10) / 10,
      },
    };
  });

  const data = {
    departments: departmentAnalytics,
    summary: {
      totalDepartments: departmentAnalytics.length,
      totalAssets: departmentAnalytics.reduce((sum, d) => sum + d.totalAssets, 0),
      totalValue: departmentAnalytics.reduce((sum, d) => sum + d.totalValue, 0),
      avgUtilization:
        departmentAnalytics.length > 0
          ? Math.round(
              (departmentAnalytics.reduce((sum, d) => sum + d.utilizationRate, 0) /
                departmentAnalytics.length) *
                100
            ) / 100
          : 0,
    },
  };

  await setCache(cacheKey, data, CACHE_TTL.MEDIUM);
  return successResponse('Department analytics retrieved successfully', data);
};

// ─── CACHE INVALIDATION ───────────────────────────────────

export const invalidateAnalyticsCache = async (): Promise<void> => {
  await invalidatePattern('analytics:*');
};
