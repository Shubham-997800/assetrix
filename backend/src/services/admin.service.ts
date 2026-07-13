import prisma from '../config/database';
import { getRedisConnection } from '../config/redis';
import { AppError } from '../middleware/error';
import { HTTP_STATUS } from '../constants';
import { Prisma } from '@prisma/client';
import * as os from 'os';
import * as fs from 'fs';

export const getSystemStats = async () => {
  const [
    totalUsers,
    totalAssets,
    totalDepartments,
    totalBookings,
    totalMaintenanceTasks,
    activeUsers,
    activeAssets,
    pendingBookings,
    overdueMaintenanceTasks,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.asset.count({ where: { deletedAt: null } }),
    prisma.department.count({ where: { deletedAt: null } }),
    prisma.booking.count({ where: { deletedAt: null } }),
    prisma.maintenanceTask.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
    prisma.asset.count({ where: { deletedAt: null, status: 'AVAILABLE' } }),
    prisma.booking.count({ where: { deletedAt: null, status: 'PENDING' } }),
    prisma.maintenanceTask.count({ where: { deletedAt: null, status: 'OVERDUE' } }),
  ]);

  return {
    totalUsers,
    activeUsers,
    totalAssets,
    activeAssets,
    totalDepartments,
    totalBookings,
    pendingBookings,
    totalMaintenanceTasks,
    overdueMaintenanceTasks,
  };
};

export const getUserStats = async () => {
  const [byRole, byStatus, registrationsOverTime] = await Promise.all([
    prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
      where: { deletedAt: null },
    }),
    prisma.user.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { deletedAt: null },
    }),
    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT
        DATE_TRUNC('day', "createdAt")::date AS date,
        COUNT(*)::int AS count
      FROM "User"
      WHERE "deletedAt" IS NULL
        AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `,
  ]);

  return {
    byRole: byRole.map((r) => ({ role: r.role, count: Number(r._count.id) })),
    byStatus: byStatus.map((s) => ({ status: s.status, count: Number(s._count.id) })),
    registrationsOverTime: registrationsOverTime.map((r) => ({
      date: r.date,
      count: Number(r.count),
    })),
  };
};

export const getAssetStats = async () => {
  const [byStatus, byCondition, byDepartment, totalValueResult] = await Promise.all([
    prisma.asset.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { deletedAt: null },
    }),
    prisma.asset.groupBy({
      by: ['condition'],
      _count: { id: true },
      where: { deletedAt: null },
    }),
    prisma.asset.groupBy({
      by: ['departmentId'],
      _count: { id: true },
      where: { deletedAt: null },
    }),
    prisma.asset.aggregate({
      _sum: { currentValue: true, purchasePrice: true },
      where: { deletedAt: null },
    }),
  ]);

  const departmentIds = byDepartment
    .map((d) => d.departmentId)
    .filter((id): id is string => id !== null);

  const departments = departmentIds.length > 0
    ? await prisma.department.findMany({
        where: { id: { in: departmentIds } },
        select: { id: true, name: true },
      })
    : [];

  const departmentMap = new Map(departments.map((d) => [d.id, d.name]));

  return {
    byStatus: byStatus.map((s) => ({ status: s.status, count: Number(s._count.id) })),
    byCondition: byCondition.map((c) => ({
      condition: c.condition,
      count: Number(c._count.id),
    })),
    byDepartment: byDepartment.map((d) => ({
      departmentId: d.departmentId,
      departmentName: d.departmentId ? departmentMap.get(d.departmentId) || 'Unknown' : 'Unassigned',
      count: Number(d._count.id),
    })),
    totalValue: {
      currentValue: totalValueResult._sum.currentValue
        ? Number(totalValueResult._sum.currentValue)
        : 0,
      purchasePrice: totalValueResult._sum.purchasePrice
        ? Number(totalValueResult._sum.purchasePrice)
        : 0,
    },
  };
};

export const getSystemHealth = async () => {
  const diskUsage = (() => {
    try {
      const stats = fs.statfsSync('/');
      const totalBytes = stats.blocks * stats.bsize;
      const freeBytes = stats.bavail * stats.bsize;
      const usedBytes = totalBytes - freeBytes;
      return {
        totalGB: Math.round((totalBytes / (1024 ** 3)) * 100) / 100,
        usedGB: Math.round((usedBytes / (1024 ** 3)) * 100) / 100,
        freeGB: Math.round((freeBytes / (1024 ** 3)) * 100) / 100,
        usagePercent: Math.round((usedBytes / totalBytes) * 10000) / 100,
      };
    } catch {
      return { totalGB: 0, usedGB: 0, freeGB: 0, usagePercent: 0 };
    }
  })();

  let databaseStatus: 'healthy' | 'unhealthy' = 'healthy';
  let databaseLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    databaseLatencyMs = Date.now() - dbStart;
  } catch {
    databaseStatus = 'unhealthy';
  }

  let redisStatus: 'healthy' | 'unhealthy' = 'healthy';
  let redisLatencyMs = 0;

  try {
    const redis = await getRedisConnection();
    const redisStart = Date.now();
    await redis.ping();
    redisLatencyMs = Date.now() - redisStart;
  } catch {
    redisStatus = 'unhealthy';
  }

  return {
    database: {
      status: databaseStatus,
      latencyMs: databaseLatencyMs,
    },
    redis: {
      status: redisStatus,
      latencyMs: redisLatencyMs,
    },
    disk: diskUsage,
    memory: {
      totalGB: Math.round((os.totalmem() / (1024 ** 3)) * 100) / 100,
      freeGB: Math.round((os.freemem() / (1024 ** 3)) * 100) / 100,
      usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 10000) / 100,
    },
    uptime: Math.round(os.uptime()),
    cpuCores: os.cpus().length,
  };
};

export const getSystemSettings = async (category?: string) => {
  const where: Record<string, unknown> = {};
  if (category) {
    where.category = category;
  }

  const settings = await prisma.systemSetting.findMany({
    where,
    orderBy: [{ category: 'asc' }, { key: 'asc' }],
  });

  return settings;
};

export const updateSystemSetting = async (
  key: string,
  value: Prisma.InputJsonValue,
  updatedBy: string,
  description?: string,
) => {
  const existing = await prisma.systemSetting.findUnique({
    where: { key },
  });

  if (existing) {
    const updated = await prisma.systemSetting.update({
      where: { key },
      data: {
        value,
        updatedBy,
        ...(description !== undefined && { description }),
      },
    });
    return updated;
  }

  const created = await prisma.systemSetting.create({
    data: {
      key,
      value,
      updatedBy,
      ...(description !== undefined && { description }),
    },
  });

  return created;
};

export const getSystemActivity = async (limit: number = 50) => {
  const safeLimit = Math.min(limit, 100);

  const items = await prisma.activityLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });

  return items;
};

export const forceLogout = async (userId: string): Promise<number> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  const result = await prisma.session.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });

  const redis = await getRedisConnection();
  await redis.del(`auth:session:${userId}`);
  await redis.del(`auth:refresh:${userId}`);

  return result.count;
};

export const backupDatabase = async (): Promise<{ backupId: string }> => {
  const backupId = `backup-${Date.now()}`;

  const job = await prisma.report.create({
    data: {
      name: `Database Backup - ${backupId}`,
      type: 'DATABASE_BACKUP',
      format: 'sql',
      status: 'IN_PROGRESS',
      generatedById: 'system',
    },
  });

  return { backupId: job.id };
};
