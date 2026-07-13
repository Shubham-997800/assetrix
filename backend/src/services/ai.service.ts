import prisma from '../config/database';
import { getRedisConnection } from '../config/redis';
import { CACHE_TTL, REDIS_KEYS, HTTP_STATUS } from '../constants';
import { AppError } from '../middleware/error';
import { successResponse } from '../utils/response';
import { aiQueue } from '../queues';
import { createAuditLog } from '../audit';
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

// ─── HEALTH SCORE CALCULATION ─────────────────────────────

interface HealthScoreInput {
  condition: string;
  age: number;
  maintenanceCount: number;
  overdueMaintenance: number;
  lastMaintenanceDaysAgo: number | null;
  totalMaintenanceCost: number;
  purchasePrice: number;
  warrantyValid: boolean;
  allocationCount: number;
  currentStatus: string;
}

export const calculateHealthScore = (input: HealthScoreInput): {
  score: number;
  grade: string;
  factors: Array<{ name: string; impact: number; weight: number }>;
} => {
  let score = 100;
  const factors: Array<{ name: string; impact: number; weight: number }> = [];

  // Condition factor (weight: 30)
  const conditionPenalty: Record<string, number> = {
    EXCELLENT: 0,
    GOOD: 5,
    FAIR: 15,
    POOR: 30,
    DAMAGED: 50,
  };
  const conditionImpact = conditionPenalty[input.condition] ?? 20;
  score -= conditionImpact;
  factors.push({ name: 'Asset Condition', impact: -conditionImpact, weight: 30 });

  // Age factor (weight: 20)
  let ageImpact = 0;
  if (input.age > 10) ageImpact = 20;
  else if (input.age > 7) ageImpact = 15;
  else if (input.age > 5) ageImpact = 10;
  else if (input.age > 3) ageImpact = 5;
  score -= ageImpact;
  factors.push({ name: 'Asset Age', impact: -ageImpact, weight: 20 });

  // Maintenance frequency factor (weight: 20)
  let maintenanceImpact = 0;
  if (input.overdueMaintenance > 0) maintenanceImpact = 15;
  else if (input.maintenanceCount > 10) maintenanceImpact = 10;
  else if (input.maintenanceCount > 5) maintenanceImpact = 5;
  score -= maintenanceImpact;
  factors.push({ name: 'Maintenance History', impact: -maintenanceImpact, weight: 20 });

  // Recency of maintenance (weight: 15)
  let recencyImpact = 0;
  if (input.lastMaintenanceDaysAgo !== null) {
    if (input.lastMaintenanceDaysAgo > 365) recencyImpact = 15;
    else if (input.lastMaintenanceDaysAgo > 180) recencyImpact = 10;
    else if (input.lastMaintenanceDaysAgo > 90) recencyImpact = 5;
  } else {
    recencyImpact = 12;
  }
  score -= recencyImpact;
  factors.push({ name: 'Maintenance Recency', impact: -recencyImpact, weight: 15 });

  // Cost ratio factor (weight: 10)
  let costImpact = 0;
  if (input.purchasePrice > 0) {
    const costRatio = input.totalMaintenanceCost / input.purchasePrice;
    if (costRatio > 0.5) costImpact = 10;
    else if (costRatio > 0.3) costImpact = 7;
    else if (costRatio > 0.15) costImpact = 4;
  }
  score -= costImpact;
  factors.push({ name: 'Maintenance Cost Ratio', impact: -costImpact, weight: 10 });

  // Warranty factor (bonus/penalty)
  if (!input.warrantyValid && input.age < 3) {
    score -= 5;
    factors.push({ name: 'Warranty Status', impact: -5, weight: 5 });
  }

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score * 10) / 10));

  let grade: string;
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  return { score, grade, factors };
};

// ─── GET ASSET HEALTH SCORE ───────────────────────────────

export const getAssetHealthScore = async (assetId: string) => {
  const cacheKey = REDIS_KEYS.AI_CACHE(`health:${assetId}`);
  const cached = await getCached(cacheKey);
  if (cached) return successResponse('Asset health score retrieved (cached)', cached);

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    include: {
      maintenanceTasks: {
        where: { deletedAt: null },
        select: {
          id: true,
          status: true,
          scheduledDate: true,
          completedAt: true,
          actualCost: true,
          type: true,
        },
        orderBy: { scheduledDate: 'desc' },
      },
    },
  });

  if (!asset) {
    throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
  }

  const now = new Date();
  const age = asset.purchaseDate
    ? (now.getTime() - new Date(asset.purchaseDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    : 0;

  const completedTasks = asset.maintenanceTasks.filter((t) => t.status === 'COMPLETED');
  const overdueCount = asset.maintenanceTasks.filter((t) => t.status === 'OVERDUE').length;
  const totalCost = completedTasks.reduce((sum, t) => sum + (Number(t.actualCost) || 0), 0);

  const lastCompleted = completedTasks.length > 0 ? completedTasks[0].completedAt : null;
  const lastMaintenanceDaysAgo = lastCompleted
    ? Math.floor((now.getTime() - new Date(lastCompleted).getTime()) / (24 * 60 * 60 * 1000))
    : null;

  const warrantyValid =
    asset.warrantyExpiry && new Date(asset.warrantyExpiry) > now;

  const healthResult = calculateHealthScore({
    condition: asset.condition,
    age: Math.round(age * 10) / 10,
    maintenanceCount: completedTasks.length,
    overdueMaintenance: overdueCount,
    lastMaintenanceDaysAgo,
    totalMaintenanceCost: totalCost,
    purchasePrice: Number(asset.purchasePrice) || 0,
    warrantyValid: !!warrantyValid,
    allocationCount: await prisma.allocation.count({
      where: { assetId },
    }),
    currentStatus: asset.status,
  });

  const recommendations = await prisma.aIRecommendation.findMany({
    where: { assetId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const data = {
    assetId: asset.id,
    assetTag: asset.assetTag,
    name: asset.name,
    healthScore: healthResult.score,
    grade: healthResult.grade,
    factors: healthResult.factors,
    maintenanceHistory: {
      totalTasks: asset.maintenanceTasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueCount,
      lastMaintenanceDate: lastCompleted,
      daysSinceLastMaintenance: lastMaintenanceDaysAgo,
    },
    costSummary: {
      totalMaintenanceCost: totalCost,
      purchasePrice: Number(asset.purchasePrice) || 0,
      currentValue: Number(asset.currentValue) || 0,
      costRatio:
        Number(asset.purchasePrice) > 0
          ? Math.round((totalCost / Number(asset.purchasePrice)) * 10000) / 100
          : 0,
    },
    warranty: {
      valid: !!warrantyValid,
      expiryDate: asset.warrantyExpiry,
      provider: asset.warrantyProvider,
    },
    recentRecommendations: recommendations.slice(0, 3),
  };

  await setCache(cacheKey, data, CACHE_TTL.SHORT);
  return successResponse('Asset health score calculated successfully', data);
};

// ─── GET RECOMMENDATIONS FOR ASSET ────────────────────────

export const getRecommendationsForAsset = async (assetId: string) => {
  const cacheKey = REDIS_KEYS.AI_CACHE(`recs:${assetId}`);
  const cached = await getCached(cacheKey);
  if (cached) return successResponse('Recommendations retrieved (cached)', cached);

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    include: {
      maintenanceTasks: {
        where: { deletedAt: null },
        orderBy: { scheduledDate: 'desc' },
        select: {
          id: true,
          type: true,
          status: true,
          scheduledDate: true,
          completedAt: true,
          actualCost: true,
          findings: true,
        },
      },
      maintenanceSchedules: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          type: true,
          intervalDays: true,
          nextRunDate: true,
        },
      },
      allocations: {
        where: { assetId, status: 'ACTIVE' },
        orderBy: { allocatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          allocatedAt: true,
          returnedAt: true,
          condition: true,
        },
      },
    },
  });

  if (!asset) {
    throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
  }

  const now = new Date();
  const recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: number;
    confidence: number;
  }> = [];

  // Age-based recommendations
  if (asset.purchaseDate) {
    const ageYears =
      (now.getTime() - new Date(asset.purchaseDate).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000);

    if (ageYears > 7) {
      recommendations.push({
        type: 'REPLACEMENT',
        title: 'Consider Asset Replacement',
        description: `This asset is approximately ${Math.round(ageYears)} years old. Consider evaluating replacement options to maintain operational efficiency.`,
        priority: 2,
        confidence: ageYears > 10 ? 85 : 65,
      });
    }

    if (ageYears > 3 && asset.purchaseDate) {
      const warrantyExpiry = asset.warrantyExpiry
        ? new Date(asset.warrantyExpiry)
        : null;
      if (warrantyExpiry && warrantyExpiry < now) {
        recommendations.push({
          type: 'WARRANTY',
          title: 'Extended Warranty Recommended',
          description:
            'This asset is out of warranty. Consider purchasing extended warranty coverage to mitigate repair costs.',
          priority: 3,
          confidence: 70,
        });
      }
    }
  }

  // Condition-based recommendations
  if (asset.condition === 'POOR' || asset.condition === 'DAMAGED') {
    recommendations.push({
      type: 'MAINTENANCE',
      title: 'Urgent Maintenance Required',
      description: `Asset condition is "${asset.condition}". Schedule immediate inspection and repair to prevent further deterioration.`,
      priority: asset.condition === 'DAMAGED' ? 1 : 2,
      confidence: 90,
    });
  }

  if (asset.condition === 'FAIR') {
    recommendations.push({
      type: 'MAINTENANCE',
      title: 'Preventive Maintenance Recommended',
      description:
        'Asset condition has degraded to "FAIR". Schedule preventive maintenance to avoid escalation.',
      priority: 3,
      confidence: 75,
    });
  }

  // Maintenance pattern recommendations
  const overdueTasks = asset.maintenanceTasks.filter(
    (t) => t.status === 'OVERDUE'
  );
  if (overdueTasks.length > 0) {
    recommendations.push({
      type: 'MAINTENANCE',
      title: 'Overdue Maintenance Tasks',
      description: `There are ${overdueTasks.length} overdue maintenance task(s). Reschedule and complete these to maintain asset reliability.`,
      priority: 1,
      confidence: 95,
    });
  }

  const recentFailures = asset.maintenanceTasks.filter(
    (t) =>
      t.type === 'CORRECTIVE' || t.type === 'EMERGENCY'
  );
  if (recentFailures.length >= 3) {
    recommendations.push({
      type: 'PATTERN',
      title: 'Recurring Failure Pattern Detected',
      description: `This asset has required ${recentFailures.length} corrective/emergency repairs. Investigate root cause or consider replacement.`,
      priority: 2,
      confidence: 80,
    });
  }

  // Schedule-based recommendations
  for (const schedule of asset.maintenanceSchedules) {
    if (schedule.nextRunDate && new Date(schedule.nextRunDate) < now) {
      recommendations.push({
        type: 'SCHEDULE',
        title: `Overdue Scheduled Maintenance: ${schedule.name}`,
        description: `Scheduled maintenance "${schedule.name}" is overdue (was due ${new Date(schedule.nextRunDate).toLocaleDateString()}).`,
        priority: 2,
        confidence: 100,
      });
    }
  }

  // Cost-based recommendations
  const completedTasks = asset.maintenanceTasks.filter(
    (t) => t.status === 'COMPLETED'
  );
  const totalCost = completedTasks.reduce(
    (sum, t) => sum + (Number(t.actualCost) || 0),
    0
  );
  const purchasePrice = Number(asset.purchasePrice) || 0;
  if (purchasePrice > 0 && totalCost > purchasePrice * 0.5) {
    recommendations.push({
      type: 'COST',
      title: 'High Maintenance Cost Ratio',
      description: `Maintenance costs (${totalCost.toLocaleString()}) have exceeded 50% of the original purchase price (${purchasePrice.toLocaleString()}). Consider cost-benefit analysis for replacement.`,
      priority: 2,
      confidence: 75,
    });
  }

  // Sort by priority (1 = highest)
  recommendations.sort((a, b) => a.priority - b.priority);

  // Store recommendations in database
  const storedRecommendations: any[] = [];
  for (const rec of recommendations) {
    const existing = await prisma.aIRecommendation.findFirst({
      where: {
        assetId,
        type: rec.type,
        title: rec.title,
        status: 'PENDING',
      },
    });

    if (!existing) {
      const stored = await prisma.aIRecommendation.create({
        data: {
          assetId,
          type: rec.type,
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
          confidence: rec.confidence,
          status: 'PENDING',
        },
      });
      storedRecommendations.push(stored);
    } else {
      storedRecommendations.push(existing);
    }
  }

  const data = {
    assetId: asset.id,
    assetTag: asset.assetTag,
    name: asset.name,
    condition: asset.condition,
    recommendations: storedRecommendations,
    summary: {
      total: storedRecommendations.length,
      critical: storedRecommendations.filter((r) => r.priority === 1).length,
      high: storedRecommendations.filter((r) => r.priority === 2).length,
      medium: storedRecommendations.filter((r) => r.priority === 3).length,
      low: storedRecommendations.filter((r) => r.priority >= 4).length,
    },
  };

  await setCache(cacheKey, data, CACHE_TTL.SHORT);
  return successResponse('Recommendations retrieved successfully', data);
};

// ─── GENERATE RECOMMENDATIONS (BATCH) ────────────────────

export const generateRecommendations = async (userId: string) => {
  const assets = await prisma.asset.findMany({
    where: { deletedAt: null, status: { not: 'RETIRED' } },
    select: { id: true, assetTag: true, name: true },
  });

  const job = await aiQueue.add('batch-recommendations', {
    assetIds: assets.map((a) => a.id),
    generatedBy: userId,
  });

  return successResponse('Batch recommendation generation queued', {
    jobId: job.id,
    assetCount: assets.length,
    message: 'Recommendations will be generated asynchronously. Check the AI recommendations endpoint for results.',
  });
};

// ─── GET RECOMMENDATION STATS ─────────────────────────────

export const getRecommendationStats = async (filters?: {
  status?: string;
  type?: string;
}) => {
  const cacheKey = REDIS_KEYS.AI_CACHE(`stats:${JSON.stringify(filters || {})}`);
  const cached = await getCached(cacheKey);
  if (cached) return successResponse('Recommendation stats retrieved (cached)', cached);

  const where: Record<string, unknown> = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.type) where.type = filters.type;

  const [byType, byStatus, byPriority, totalCount, recentRecommendations] =
    await Promise.all([
      prisma.aIRecommendation.groupBy({
        by: ['type'],
        where,
        _count: { id: true },
        _avg: { confidence: true },
      }),
      prisma.aIRecommendation.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.aIRecommendation.groupBy({
        by: ['priority'],
        where,
        _count: { id: true },
      }),
      prisma.aIRecommendation.count({ where }),
      prisma.aIRecommendation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          asset: {
            select: { id: true, name: true, assetTag: true },
          },
        },
      }),
    ]);

  const data = {
    total: totalCount,
    byType: byType.map((t) => ({
      type: t.type,
      count: t._count.id,
      avgConfidence: t._avg.confidence
        ? Math.round(Number(t._avg.confidence) * 100) / 100
        : 0,
    })),
    byStatus: byStatus.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    byPriority: byPriority
      .map((p) => ({
        priority: p.priority,
        label:
          p.priority === 1
            ? 'Critical'
            : p.priority === 2
            ? 'High'
            : p.priority === 3
            ? 'Medium'
            : 'Low',
        count: p._count.id,
      }))
      .sort((a, b) => a.priority - b.priority),
    recent: recentRecommendations,
  };

  await setCache(cacheKey, data, CACHE_TTL.SHORT);
  return successResponse('Recommendation stats retrieved successfully', data);
};

// ─── MARK AS ACTIONED ─────────────────────────────────────

export const markAsActioned = async (
  recommendationId: string,
  actionTaken: string,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const recommendation = await prisma.aIRecommendation.findUnique({
    where: { id: recommendationId },
    include: { asset: { select: { id: true, name: true, assetTag: true } } },
  });

  if (!recommendation) {
    throw new AppError('Recommendation not found', HTTP_STATUS.NOT_FOUND);
  }

  if (recommendation.status === 'ACTIONED') {
    throw new AppError('Recommendation has already been actioned', HTTP_STATUS.BAD_REQUEST);
  }

  const updated = await prisma.aIRecommendation.update({
    where: { id: recommendationId },
    data: {
      status: 'ACTIONED',
      actionTaken,
      updatedAt: new Date(),
    },
  });

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'AIRecommendation',
    entityId: recommendationId,
    oldValues: { status: recommendation.status },
    newValues: { status: 'ACTIONED', actionTaken },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Recommendation marked as actioned', updated);
};

// ─── PREDICTIVE MAINTENANCE ──────────────────────────────

export const getPredictiveMaintenance = async (assetId?: string) => {
  const where: Record<string, unknown> = { deletedAt: null };
  if (assetId) where.id = assetId;

  const assets = await prisma.asset.findMany({
    where,
    include: {
      maintenanceTasks: {
        where: { deletedAt: null, status: 'COMPLETED' },
        orderBy: { completedAt: 'desc' },
        select: {
          id: true,
          type: true,
          status: true,
          scheduledDate: true,
          completedAt: true,
          actualCost: true,
        },
      },
      maintenanceSchedules: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          intervalDays: true,
          nextRunDate: true,
          type: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const predictions = assets
    .map((asset) => {
      const completedTasks = asset.maintenanceTasks.filter(
        (t) => t.status === 'COMPLETED' || true
      );

      if (completedTasks.length < 2) {
        return {
          assetId: asset.id,
          assetTag: asset.assetTag,
          name: asset.name,
          condition: asset.condition,
          predictions: [],
          confidence: 0,
        };
      }

      // Calculate average interval between maintenance tasks
      const intervals: number[] = [];
      for (let i = 0; i < completedTasks.length - 1; i++) {
        const current = new Date(
          completedTasks[i].completedAt || completedTasks[i].scheduledDate
        ).getTime();
        const next = new Date(
          completedTasks[i + 1].completedAt || completedTasks[i + 1].scheduledDate
        ).getTime();
        intervals.push(Math.abs(current - next) / (24 * 60 * 60 * 1000));
      }

      const avgInterval =
        intervals.length > 0
          ? intervals.reduce((a, b) => a + b, 0) / intervals.length
          : 90;

      const lastMaintenance = completedTasks[0];
      const lastDate = new Date(
        lastMaintenance.completedAt || lastMaintenance.scheduledDate
      );
      const predictedNextDate = new Date(
        lastDate.getTime() + avgInterval * 24 * 60 * 60 * 1000
      );
      const now = new Date();
      const daysUntil =
        (predictedNextDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);

      const isOverdue = daysUntil < 0;
      const isUrgent = daysUntil >= 0 && daysUntil <= 14;

      // Calculate confidence based on data consistency
      const stdDev =
        intervals.length > 1
          ? Math.sqrt(
              intervals.reduce(
                (sum, val) => sum + Math.pow(val - avgInterval, 2),
                0
              ) / intervals.length
            )
          : avgInterval * 0.5;
      const coefficientOfVariation = avgInterval > 0 ? stdDev / avgInterval : 1;
      const confidence = Math.max(
        20,
        Math.min(95, Math.round((1 - coefficientOfVariation) * 100))
      );

      const taskPredictions: any[] = [];
      if (isOverdue) {
        taskPredictions.push({
          type: 'OVERDUE',
          title: 'Maintenance Overdue',
          predictedDate: predictedNextDate.toISOString(),
          daysOverdue: Math.round(Math.abs(daysUntil)),
          avgIntervalDays: Math.round(avgInterval),
          priority: 1,
        });
      } else if (isUrgent) {
        taskPredictions.push({
          type: 'UPCOMING',
          title: 'Maintenance Due Soon',
          predictedDate: predictedNextDate.toISOString(),
          daysUntilMaintenance: Math.round(daysUntil),
          avgIntervalDays: Math.round(avgInterval),
          priority: 2,
        });
      } else {
        taskPredictions.push({
          type: 'SCHEDULED',
          title: 'Predicted Next Maintenance',
          predictedDate: predictedNextDate.toISOString(),
          daysUntilMaintenance: Math.round(daysUntil),
          avgIntervalDays: Math.round(avgInterval),
          priority: 4,
        });
      }

      // Check scheduled maintenance
      for (const schedule of asset.maintenanceSchedules) {
        if (schedule.nextRunDate) {
          const schedDate = new Date(schedule.nextRunDate);
          const schedDays =
            (schedDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);

          if (schedDays < 0) {
            taskPredictions.push({
              type: 'SCHEDULE_OVERDUE',
              title: `Scheduled Maintenance Overdue: ${schedule.name}`,
              predictedDate: schedDate.toISOString(),
              daysOverdue: Math.round(Math.abs(schedDays)),
              intervalDays: schedule.intervalDays,
              priority: 1,
            });
          } else if (schedDays <= 14) {
            taskPredictions.push({
              type: 'SCHEDULE_UPCOMING',
              title: `Scheduled Maintenance Due: ${schedule.name}`,
              predictedDate: schedDate.toISOString(),
              daysUntilMaintenance: Math.round(schedDays),
              intervalDays: schedule.intervalDays,
              priority: 2,
            });
          }
        }
      }

      taskPredictions.sort((a, b) => a.priority - b.priority);

      return {
        assetId: asset.id,
        assetTag: asset.assetTag,
        name: asset.name,
        condition: asset.condition,
        predictions: taskPredictions,
        confidence,
        historicalData: {
          completedTaskCount: completedTasks.length,
          avgMaintenanceIntervalDays: Math.round(avgInterval),
          lastMaintenanceDate:
            lastMaintenance.completedAt || lastMaintenance.scheduledDate,
        },
      };
    })
    .filter((p) => p.predictions.length > 0);

  const overdueCount = predictions.reduce(
    (sum, p) =>
      sum + p.predictions.filter((pr) => pr.type.includes('OVERDUE')).length,
    0
  );
  const urgentCount = predictions.reduce(
    (sum, p) =>
      sum + p.predictions.filter((pr) => pr.type.includes('UPCOMING')).length,
    0
  );

  const data = {
    summary: {
      totalAssetsAnalyzed: assets.length,
      assetsWithPredictions: predictions.length,
      overdueCount,
      urgentCount,
    },
    predictions,
  };

  return successResponse('Predictive maintenance analysis retrieved', data);
};
