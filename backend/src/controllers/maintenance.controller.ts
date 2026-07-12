import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { HTTP_STATUS } from '../constants';
import { successResponse } from '../utils/response';
import * as maintenanceService from '../services/maintenance.service';
import {
  CreateMaintenanceTaskInput,
  UpdateMaintenanceTaskInput,
  AssignTaskInput,
  MaintenanceTaskQueryInput,
  CreateMaintenanceScheduleInput,
  UpdateMaintenanceScheduleInput,
  MaintenanceScheduleQueryInput,
  ApproveMaintenanceInput,
  RejectMaintenanceInput,
} from '../validators/maintenance.schema';

// ─── TASK CONTROLLERS ───────────────────────────────────────

export const getAllTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const query = req.query as unknown as MaintenanceTaskQueryInput;
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  const result = await maintenanceService.getAllTasks(query, userId, userRole);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance tasks retrieved successfully', result.tasks, result.meta)
  );
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;

  const task = await maintenanceService.getTaskById(id);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance task retrieved successfully', task)
  );
};

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const data = req.body as CreateMaintenanceTaskInput;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const task = await maintenanceService.createTask(data, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse('Maintenance task created successfully', task)
  );
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const data = req.body as UpdateMaintenanceTaskInput;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const task = await maintenanceService.updateTask(id, data, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance task updated successfully', task)
  );
};

export const assignTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { assignedToId } = req.body as AssignTaskInput;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const task = await maintenanceService.assignTask(id, assignedToId, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance task assigned successfully', task)
  );
};

export const startTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const task = await maintenanceService.startTask(id, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance task started successfully', task)
  );
};

export const completeTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const data = req.body as {
    actualCost?: number;
    findings?: string;
    partsUsed?: string;
    notes?: string;
  };
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const task = await maintenanceService.completeTask(id, data, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance task completed successfully', task)
  );
};

export const cancelTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const task = await maintenanceService.cancelTask(id, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance task cancelled successfully', task)
  );
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  await maintenanceService.deleteTask(id, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance task deleted successfully')
  );
};

export const getOverdueTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await maintenanceService.getOverdueTasks(page, limit);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Overdue maintenance tasks retrieved successfully', result.tasks, result.meta)
  );
};

export const getMaintenanceStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const stats = await maintenanceService.getMaintenanceStats();

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance statistics retrieved successfully', stats)
  );
};

// ─── SCHEDULE CONTROLLERS ───────────────────────────────────

export const getAllSchedules = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const query = req.query as unknown as MaintenanceScheduleQueryInput;

  const result = await maintenanceService.getAllSchedules(query);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance schedules retrieved successfully', result.schedules, result.meta)
  );
};

export const createSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const data = req.body as CreateMaintenanceScheduleInput;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const schedule = await maintenanceService.createSchedule(data, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse('Maintenance schedule created successfully', schedule)
  );
};

export const updateSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const data = req.body as UpdateMaintenanceScheduleInput;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const schedule = await maintenanceService.updateSchedule(id, data, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance schedule updated successfully', schedule)
  );
};

export const deleteSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  await maintenanceService.deleteSchedule(id, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance schedule deleted successfully')
  );
};

export const approveTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const data = req.body as ApproveMaintenanceInput;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const task = await maintenanceService.approveTask(id, data, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance task approved successfully', task)
  );
};

export const rejectTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const data = req.body as RejectMaintenanceInput;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const task = await maintenanceService.rejectTask(id, data, userId, ipAddress, userAgent);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Maintenance task rejected', task)
  );
};
