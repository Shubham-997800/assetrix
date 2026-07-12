import prisma from '../config/database';
import { MaintenanceStatus, Prisma } from '@prisma/client';
import { AppError } from '../middleware/error';
import { HTTP_STATUS } from '../constants';
import { createAuditLog } from '../audit';
import { createNotification } from '../notifications';
import { addDays } from '../utils';
import {
  CreateMaintenanceTaskInput,
  UpdateMaintenanceTaskInput,
  MaintenanceTaskQueryInput,
  CreateMaintenanceScheduleInput,
  UpdateMaintenanceScheduleInput,
  MaintenanceScheduleQueryInput,
  ApproveMaintenanceInput,
  RejectMaintenanceInput,
} from '../validators/maintenance.schema';

const taskInclude = {
  asset: {
    select: {
      id: true,
      assetTag: true,
      name: true,
      status: true,
      condition: true,
      location: true,
      departmentId: true,
    },
  },
  assignedTo: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      designation: true,
    },
  },
  requestedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  schedule: {
    select: {
      id: true,
      name: true,
      type: true,
      intervalDays: true,
      nextRunDate: true,
    },
  },
  attachments: true,
};

// ─── GET ALL TASKS ──────────────────────────────────────────

export const getAllTasks = async (
  query: MaintenanceTaskQueryInput,
  userId: string,
  userRole: string
) => {
  const { page, limit, search, sortBy, sortOrder, status, type, assetId, assignedToId, requestedById, priority, startDate, endDate } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.MaintenanceTaskWhereInput = {
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } },
      { partsUsed: { contains: search, mode: 'insensitive' } },
      { externalVendor: { contains: search, mode: 'insensitive' } },
      { asset: { name: { contains: search, mode: 'insensitive' } } },
      { asset: { assetTag: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (status) where.status = status;
  if (type) where.type = type;
  if (assetId) where.assetId = assetId;
  if (assignedToId) where.assignedToId = assignedToId;
  if (requestedById) where.requestedById = requestedById;
  if (priority) where.priority = priority;

  if (startDate || endDate) {
    where.scheduledDate = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    };
  }

  if (userRole === 'TECHNICIAN') {
    where.assignedToId = userId;
  }

  const orderBy: Prisma.MaintenanceTaskOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const [tasks, totalItems] = await Promise.all([
    prisma.maintenanceTask.findMany({
      where,
      include: taskInclude,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.maintenanceTask.count({ where }),
  ]);

  return {
    tasks,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      hasNextPage: page * limit < totalItems,
      hasPreviousPage: page > 1,
    },
  };
};

// ─── GET TASK BY ID ─────────────────────────────────────────

export const getTaskById = async (taskId: string) => {
  const task = await prisma.maintenanceTask.findFirst({
    where: { id: taskId, deletedAt: null },
    include: taskInclude,
  });

  if (!task) {
    throw new AppError('Maintenance task not found', HTTP_STATUS.NOT_FOUND);
  }

  return task;
};

// ─── CREATE TASK ────────────────────────────────────────────

export const createTask = async (
  data: CreateMaintenanceTaskInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const asset = await prisma.asset.findFirst({
    where: { id: data.assetId, deletedAt: null },
  });

  if (!asset) {
    throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
  }

  if (data.assignedToId) {
    const technician = await prisma.user.findFirst({
      where: { id: data.assignedToId, role: 'TECHNICIAN', deletedAt: null },
    });

    if (!technician) {
      throw new AppError('Assigned technician not found', HTTP_STATUS.NOT_FOUND);
    }
  }

  if (data.scheduleId) {
    const schedule = await prisma.maintenanceSchedule.findFirst({
      where: { id: data.scheduleId },
    });

    if (!schedule) {
      throw new AppError('Maintenance schedule not found', HTTP_STATUS.NOT_FOUND);
    }
  }

  const task = await prisma.maintenanceTask.create({
    data: {
      title: data.title,
      description: data.description,
      assetId: data.assetId,
      scheduleId: data.scheduleId,
      type: data.type,
      priority: data.priority,
      status: 'SCHEDULED',
      assignedToId: data.assignedToId,
      requestedById: userId,
      scheduledDate: data.scheduledDate,
      estimatedCost: data.estimatedCost,
      notes: data.notes,
      findings: data.findings,
      partsUsed: data.partsUsed,
      externalVendor: data.externalVendor,
      createdBy: userId,
    },
    include: taskInclude,
  });

  if (data.assignedToId) {
    await createNotification({
      userId: data.assignedToId,
      type: 'MAINTENANCE_ASSIGNED',
      title: 'New Maintenance Task Assigned',
      message: `You have been assigned a maintenance task "${data.title}" for asset "${asset.name}".`,
      link: `/maintenance/tasks/${task.id}`,
      metadata: { taskId: task.id, assetId: data.assetId },
    });
  }

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'MaintenanceTask',
    entityId: task.id,
    newValues: {
      title: data.title,
      assetId: data.assetId,
      type: data.type,
      priority: data.priority,
      scheduledDate: data.scheduledDate,
      assignedToId: data.assignedToId,
    },
    ipAddress,
    userAgent,
  });

  return task;
};

// ─── UPDATE TASK ────────────────────────────────────────────

export const updateTask = async (
  taskId: string,
  data: UpdateMaintenanceTaskInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingTask = await prisma.maintenanceTask.findFirst({
    where: { id: taskId, deletedAt: null },
  });

  if (!existingTask) {
    throw new AppError('Maintenance task not found', HTTP_STATUS.NOT_FOUND);
  }

  if (
    existingTask.status === 'COMPLETED' ||
    existingTask.status === 'CANCELLED'
  ) {
    throw new AppError(
      'Cannot update a completed or cancelled task',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const oldValues = {
    title: existingTask.title,
    description: existingTask.description,
    type: existingTask.type,
    priority: existingTask.priority,
    scheduledDate: existingTask.scheduledDate,
    estimatedCost: existingTask.estimatedCost?.toString(),
    notes: existingTask.notes,
    findings: existingTask.findings,
    partsUsed: existingTask.partsUsed,
    externalVendor: existingTask.externalVendor,
  };

  const task = await prisma.maintenanceTask.update({
    where: { id: taskId },
    data: {
      ...data,
      updatedBy: userId,
    },
    include: taskInclude,
  });

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'MaintenanceTask',
    entityId: taskId,
    oldValues,
    newValues: data,
    ipAddress,
    userAgent,
  });

  return task;
};

// ─── ASSIGN TASK ────────────────────────────────────────────

export const assignTask = async (
  taskId: string,
  assignedToId: string,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingTask = await prisma.maintenanceTask.findFirst({
    where: { id: taskId, deletedAt: null },
    include: { asset: { select: { id: true, name: true } } },
  });

  if (!existingTask) {
    throw new AppError('Maintenance task not found', HTTP_STATUS.NOT_FOUND);
  }

  if (
    existingTask.status === 'COMPLETED' ||
    existingTask.status === 'CANCELLED'
  ) {
    throw new AppError(
      'Cannot assign a completed or cancelled task',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const technician = await prisma.user.findFirst({
    where: { id: assignedToId, role: 'TECHNICIAN', deletedAt: null },
  });

  if (!technician) {
    throw new AppError('Technician not found', HTTP_STATUS.NOT_FOUND);
  }

  const oldAssignedTo = existingTask.assignedToId;

  const task = await prisma.maintenanceTask.update({
    where: { id: taskId },
    data: {
      assignedToId,
      updatedBy: userId,
    },
    include: taskInclude,
  });

  await createNotification({
    userId: assignedToId,
    type: 'MAINTENANCE_ASSIGNED',
    title: 'Maintenance Task Assigned',
    message: `You have been assigned the maintenance task "${existingTask.title}" for asset "${existingTask.asset.name}".`,
    link: `/maintenance/tasks/${taskId}`,
    metadata: { taskId, assetId: existingTask.assetId },
  });

  await createAuditLog({
    userId,
    action: 'ASSIGN',
    entity: 'MaintenanceTask',
    entityId: taskId,
    oldValues: { assignedToId: oldAssignedTo },
    newValues: { assignedToId },
    ipAddress,
    userAgent,
  });

  return task;
};

// ─── START TASK ─────────────────────────────────────────────

export const startTask = async (
  taskId: string,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingTask = await prisma.maintenanceTask.findFirst({
    where: { id: taskId, deletedAt: null },
  });

  if (!existingTask) {
    throw new AppError('Maintenance task not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existingTask.status !== 'SCHEDULED' && existingTask.status !== 'OVERDUE') {
    throw new AppError(
      'Only scheduled or overdue tasks can be started',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const now = new Date();

  const task = await prisma.maintenanceTask.update({
    where: { id: taskId },
    data: {
      status: 'IN_PROGRESS',
      startedAt: now,
      updatedBy: userId,
    },
    include: taskInclude,
  });

  await createAuditLog({
    userId,
    action: 'START',
    entity: 'MaintenanceTask',
    entityId: taskId,
    oldValues: { status: existingTask.status, startedAt: existingTask.startedAt?.toISOString() },
    newValues: { status: 'IN_PROGRESS', startedAt: now.toISOString() },
    ipAddress,
    userAgent,
  });

  return task;
};

// ─── COMPLETE TASK ──────────────────────────────────────────

export const completeTask = async (
  taskId: string,
  data: { actualCost?: number; findings?: string; partsUsed?: string; notes?: string },
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingTask = await prisma.maintenanceTask.findFirst({
    where: { id: taskId, deletedAt: null },
  });

  if (!existingTask) {
    throw new AppError('Maintenance task not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existingTask.status !== 'IN_PROGRESS') {
    throw new AppError(
      'Only in-progress tasks can be completed',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const now = new Date();

  const task = await prisma.$transaction(async (tx) => {
    const updatedTask = await tx.maintenanceTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        completedAt: now,
        actualCost: data.actualCost,
        findings: data.findings,
        partsUsed: data.partsUsed,
        notes: data.notes || existingTask.notes,
        updatedBy: userId,
      },
      include: taskInclude,
    });

    await tx.asset.update({
      where: { id: existingTask.assetId },
      data: { lastMaintenanceDate: now },
    });

    return updatedTask;
  });

  await createAuditLog({
    userId,
    action: 'COMPLETE',
    entity: 'MaintenanceTask',
    entityId: taskId,
    oldValues: {
      status: existingTask.status,
      completedAt: existingTask.completedAt?.toISOString(),
    },
    newValues: {
      status: 'COMPLETED',
      completedAt: now.toISOString(),
      actualCost: data.actualCost,
    },
    ipAddress,
    userAgent,
  });

  if (existingTask.requestedById) {
    await createNotification({
      userId: existingTask.requestedById,
      type: 'MAINTENANCE_COMPLETED',
      title: 'Maintenance Task Completed',
      message: `Maintenance task "${existingTask.title}" has been marked as completed.`,
      link: `/maintenance/tasks/${taskId}`,
      metadata: { taskId },
    });
  }

  if (existingTask.assignedToId && existingTask.assignedToId !== userId) {
    await createNotification({
      userId: existingTask.assignedToId,
      type: 'MAINTENANCE_COMPLETED',
      title: 'Maintenance Task Completed',
      message: `Maintenance task "${existingTask.title}" has been marked as completed.`,
      link: `/maintenance/tasks/${taskId}`,
      metadata: { taskId },
    });
  }

  return task;
};

// ─── CANCEL TASK ────────────────────────────────────────────

export const cancelTask = async (
  taskId: string,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingTask = await prisma.maintenanceTask.findFirst({
    where: { id: taskId, deletedAt: null },
  });

  if (!existingTask) {
    throw new AppError('Maintenance task not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existingTask.status === 'COMPLETED') {
    throw new AppError(
      'Cannot cancel a completed task',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (existingTask.status === 'CANCELLED') {
    throw new AppError(
      'Task is already cancelled',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const task = await prisma.maintenanceTask.update({
    where: { id: taskId },
    data: {
      status: 'CANCELLED',
      updatedBy: userId,
    },
    include: taskInclude,
  });

  await createAuditLog({
    userId,
    action: 'CANCEL',
    entity: 'MaintenanceTask',
    entityId: taskId,
    oldValues: { status: existingTask.status },
    newValues: { status: 'CANCELLED' },
    ipAddress,
    userAgent,
  });

  if (existingTask.assignedToId) {
    await createNotification({
      userId: existingTask.assignedToId,
      type: 'SYSTEM_ALERT',
      title: 'Maintenance Task Cancelled',
      message: `Maintenance task "${existingTask.title}" has been cancelled.`,
      link: `/maintenance/tasks/${taskId}`,
      metadata: { taskId },
    });
  }

  return task;
};

// ─── DELETE TASK (SOFT) ─────────────────────────────────────

export const deleteTask = async (
  taskId: string,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingTask = await prisma.maintenanceTask.findFirst({
    where: { id: taskId, deletedAt: null },
  });

  if (!existingTask) {
    throw new AppError('Maintenance task not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existingTask.status === 'IN_PROGRESS') {
    throw new AppError(
      'Cannot delete an in-progress task. Cancel it first.',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  await prisma.maintenanceTask.update({
    where: { id: taskId },
    data: { deletedAt: new Date(), updatedBy: userId },
  });

  await createAuditLog({
    userId,
    action: 'DELETE',
    entity: 'MaintenanceTask',
    entityId: taskId,
    oldValues: { deletedAt: null },
    newValues: { deletedAt: new Date().toISOString() },
    ipAddress,
    userAgent,
  });
};

// ─── GET ALL SCHEDULES ──────────────────────────────────────

export const getAllSchedules = async (query: MaintenanceScheduleQueryInput) => {
  const { page, limit, search, sortBy, sortOrder, assetId, type, isActive } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.MaintenanceScheduleWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { asset: { name: { contains: search, mode: 'insensitive' } } },
      { asset: { assetTag: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (assetId) where.assetId = assetId;
  if (type) where.type = type;
  if (isActive !== undefined) where.isActive = isActive;

  const orderBy: Prisma.MaintenanceScheduleOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const [schedules, totalItems] = await Promise.all([
    prisma.maintenanceSchedule.findMany({
      where,
      include: {
        asset: {
          select: {
            id: true,
            assetTag: true,
            name: true,
            status: true,
          },
        },
        _count: {
          select: { tasks: { where: { deletedAt: null } } },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.maintenanceSchedule.count({ where }),
  ]);

  return {
    schedules,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      hasNextPage: page * limit < totalItems,
      hasPreviousPage: page > 1,
    },
  };
};

// ─── CREATE SCHEDULE ────────────────────────────────────────

export const createSchedule = async (
  data: CreateMaintenanceScheduleInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const asset = await prisma.asset.findFirst({
    where: { id: data.assetId, deletedAt: null },
  });

  if (!asset) {
    throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
  }

  const schedule = await prisma.maintenanceSchedule.create({
    data: {
      assetId: data.assetId,
      name: data.name,
      description: data.description,
      type: data.type,
      intervalDays: data.intervalDays,
      nextRunDate: data.nextRunDate,
      createdBy: userId,
    },
    include: {
      asset: {
        select: {
          id: true,
          assetTag: true,
          name: true,
          status: true,
        },
      },
      _count: {
        select: { tasks: { where: { deletedAt: null } } },
      },
    },
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'MaintenanceSchedule',
    entityId: schedule.id,
    newValues: {
      name: data.name,
      assetId: data.assetId,
      type: data.type,
      intervalDays: data.intervalDays,
    },
    ipAddress,
    userAgent,
  });

  return schedule;
};

// ─── UPDATE SCHEDULE ────────────────────────────────────────

export const updateSchedule = async (
  scheduleId: string,
  data: UpdateMaintenanceScheduleInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingSchedule = await prisma.maintenanceSchedule.findFirst({
    where: { id: scheduleId },
  });

  if (!existingSchedule) {
    throw new AppError('Maintenance schedule not found', HTTP_STATUS.NOT_FOUND);
  }

  const oldValues = {
    name: existingSchedule.name,
    description: existingSchedule.description,
    type: existingSchedule.type,
    intervalDays: existingSchedule.intervalDays,
    nextRunDate: existingSchedule.nextRunDate?.toISOString(),
    isActive: existingSchedule.isActive,
  };

  const schedule = await prisma.maintenanceSchedule.update({
    where: { id: scheduleId },
    data: {
      ...data,
      updatedBy: userId,
    },
    include: {
      asset: {
        select: {
          id: true,
          assetTag: true,
          name: true,
          status: true,
        },
      },
      _count: {
        select: { tasks: { where: { deletedAt: null } } },
      },
    },
  });

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'MaintenanceSchedule',
    entityId: scheduleId,
    oldValues,
    newValues: data,
    ipAddress,
    userAgent,
  });

  return schedule;
};

// ─── DELETE SCHEDULE ────────────────────────────────────────

export const deleteSchedule = async (
  scheduleId: string,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingSchedule = await prisma.maintenanceSchedule.findFirst({
    where: { id: scheduleId },
    include: {
      _count: {
        select: {
          tasks: { where: { status: { in: ['SCHEDULED', 'IN_PROGRESS', 'OVERDUE'] }, deletedAt: null } },
        },
      },
    },
  });

  if (!existingSchedule) {
    throw new AppError('Maintenance schedule not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existingSchedule._count.tasks > 0) {
    throw new AppError(
      'Cannot delete schedule with active tasks. Complete or cancel all tasks first.',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  await prisma.maintenanceSchedule.delete({
    where: { id: scheduleId },
  });

  await createAuditLog({
    userId,
    action: 'DELETE',
    entity: 'MaintenanceSchedule',
    entityId: scheduleId,
    oldValues: { name: existingSchedule.name },
    newValues: {},
    ipAddress,
    userAgent,
  });
};

// ─── GET OVERDUE TASKS ──────────────────────────────────────

export const getOverdueTasks = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const now = new Date();

  const where: Prisma.MaintenanceTaskWhereInput = {
    deletedAt: null,
    status: { notIn: ['COMPLETED', 'CANCELLED'] },
    scheduledDate: { lt: now },
  };

  const [tasks, totalItems] = await Promise.all([
    prisma.maintenanceTask.findMany({
      where,
      include: taskInclude,
      orderBy: [{ priority: 'asc' }, { scheduledDate: 'asc' }],
      skip,
      take: limit,
    }),
    prisma.maintenanceTask.count({ where }),
  ]);

  // Auto-mark overdue
  const overdueIds = tasks
    .filter((t) => t.status !== 'OVERDUE')
    .map((t) => t.id);

  if (overdueIds.length > 0) {
    await prisma.maintenanceTask.updateMany({
      where: { id: { in: overdueIds } },
      data: { status: 'OVERDUE' },
    });

    for (const task of tasks.filter((t) => overdueIds.includes(t.id))) {
      if (task.assignedToId) {
        await createNotification({
          userId: task.assignedToId,
          type: 'SYSTEM_ALERT',
          title: 'Maintenance Task Overdue',
          message: `Maintenance task "${task.title}" is overdue. It was scheduled for ${task.scheduledDate.toDateString()}.`,
          link: `/maintenance/tasks/${task.id}`,
          metadata: { taskId: task.id },
        });
      }
    }
  }

  return {
    tasks: tasks.map((t) =>
      overdueIds.includes(t.id) ? { ...t, status: 'OVERDUE' as const } : t
    ),
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      hasNextPage: page * limit < totalItems,
      hasPreviousPage: page > 1,
    },
  };
};

// ─── GET MAINTENANCE STATS ──────────────────────────────────

export const getMaintenanceStats = async () => {
  const now = new Date();
  const thirtyDaysFromNow = addDays(now, 30);

  const [
    totalTasks,
    tasksByStatus,
    tasksByType,
    upcomingTasks,
    costAggregation,
    recentCompleted,
  ] = await Promise.all([
    prisma.maintenanceTask.count({
      where: { deletedAt: null },
    }),
    prisma.maintenanceTask.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.maintenanceTask.groupBy({
      by: ['type'],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.maintenanceTask.findMany({
      where: {
        deletedAt: null,
        status: { in: ['SCHEDULED'] },
        scheduledDate: { gte: now, lte: thirtyDaysFromNow },
      },
      include: {
        asset: { select: { id: true, name: true, assetTag: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { scheduledDate: 'asc' },
      take: 10,
    }),
    prisma.maintenanceTask.aggregate({
      where: { deletedAt: null, actualCost: { not: null } },
      _sum: { actualCost: true, estimatedCost: true },
      _avg: { actualCost: true },
      _count: { actualCost: true },
    }),
    prisma.maintenanceTask.findMany({
      where: { deletedAt: null, status: 'COMPLETED', completedAt: { not: null } },
      include: {
        asset: { select: { id: true, name: true, assetTag: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { completedAt: 'desc' },
      take: 5,
    }),
  ]);

  const statusMap: Record<string, number> = {};
  tasksByStatus.forEach((item) => {
    statusMap[item.status] = item._count.id;
  });

  const typeMap: Record<string, number> = {};
  tasksByType.forEach((item) => {
    typeMap[item.type] = item._count.id;
  });

  return {
    totalTasks,
    byStatus: statusMap,
    byType: typeMap,
    totalCost: {
      actual: costAggregation._sum.actualCost?.toString() ?? '0',
      estimated: costAggregation._sum.estimatedCost?.toString() ?? '0',
      average: costAggregation._avg.actualCost?.toString() ?? '0',
      tasksWithCost: costAggregation._count.actualCost,
    },
    upcomingTasks,
    recentCompleted,
  };
};

// ─── APPROVE TASK ──────────────────────────────────────────

export const approveTask = async (
  taskId: string,
  data: ApproveMaintenanceInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingTask = await prisma.maintenanceTask.findFirst({
    where: { id: taskId, deletedAt: null },
    include: { asset: { select: { id: true, name: true, assetTag: true } }, assignedTo: { select: { id: true, firstName: true, lastName: true } } },
  });

  if (!existingTask) {
    throw new AppError('Maintenance task not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existingTask.status === 'COMPLETED' || existingTask.status === 'CANCELLED') {
    throw new AppError('Cannot approve a completed or cancelled task', HTTP_STATUS.BAD_REQUEST);
  }

  const now = new Date();

  const task = await prisma.$transaction(async (tx) => {
    const updatedTask = await tx.maintenanceTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        completedAt: now,
        actualCost: data.actualCost,
        notes: data.notes || existingTask.notes,
        updatedBy: userId,
      },
      include: taskInclude,
    });

    await tx.asset.update({
      where: { id: existingTask.assetId },
      data: { lastMaintenanceDate: now },
    });

    return updatedTask;
  });

  await createAuditLog({
    userId,
    action: 'APPROVE',
    entity: 'MaintenanceTask',
    entityId: taskId,
    oldValues: { status: existingTask.status },
    newValues: { status: 'COMPLETED', approved: true, actualCost: data.actualCost },
    ipAddress,
    userAgent,
  });

  if (existingTask.requestedById) {
    await createNotification({
      userId: existingTask.requestedById,
      type: 'MAINTENANCE_COMPLETED',
      title: 'Maintenance Approved & Completed',
      message: `Maintenance task "${existingTask.title}" has been approved and marked as completed.`,
      link: `/maintenance/tasks/${taskId}`,
      metadata: { taskId },
    });
  }

  if (existingTask.assignedToId && existingTask.assignedToId !== userId) {
    await createNotification({
      userId: existingTask.assignedToId,
      type: 'MAINTENANCE_COMPLETED',
      title: 'Maintenance Approved & Completed',
      message: `Maintenance task "${existingTask.title}" has been approved and completed.`,
      link: `/maintenance/tasks/${taskId}`,
      metadata: { taskId },
    });
  }

  return task;
};

// ─── REJECT TASK ───────────────────────────────────────────

export const rejectTask = async (
  taskId: string,
  data: RejectMaintenanceInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const existingTask = await prisma.maintenanceTask.findFirst({
    where: { id: taskId, deletedAt: null },
    include: { asset: { select: { id: true, name: true, assetTag: true } }, assignedTo: { select: { id: true, firstName: true, lastName: true } } },
  });

  if (!existingTask) {
    throw new AppError('Maintenance task not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existingTask.status === 'COMPLETED' || existingTask.status === 'CANCELLED') {
    throw new AppError('Cannot reject a completed or cancelled task', HTTP_STATUS.BAD_REQUEST);
  }

  const task = await prisma.maintenanceTask.update({
    where: { id: taskId },
    data: {
      status: 'CANCELLED',
      notes: `Rejected: ${data.rejectionReason}${existingTask.notes ? '\n' + existingTask.notes : ''}`,
      updatedBy: userId,
    },
    include: taskInclude,
  });

  await createAuditLog({
    userId,
    action: 'REJECT',
    entity: 'MaintenanceTask',
    entityId: taskId,
    oldValues: { status: existingTask.status },
    newValues: { status: 'CANCELLED', rejectionReason: data.rejectionReason },
    ipAddress,
    userAgent,
  });

  if (existingTask.assignedToId) {
    await createNotification({
      userId: existingTask.assignedToId,
      type: 'SYSTEM_ALERT',
      title: 'Maintenance Task Rejected',
      message: `Maintenance task "${existingTask.title}" has been rejected. Reason: ${data.rejectionReason}`,
      link: `/maintenance/tasks/${taskId}`,
      metadata: { taskId },
    });
  }

  return task;
};
