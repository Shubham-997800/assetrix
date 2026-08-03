import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as maintenanceService from "./service";
import type {
  MaintenanceScheduleQueryInput,
  MaintenanceTaskQueryInput,
} from "./validators";

// ─── TASK CONTROLLERS ───────────────────────────────────────

export const getAllTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await maintenanceService.getAllTasks(
    req.query as unknown as MaintenanceTaskQueryInput
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance tasks retrieved successfully", result.tasks, result.meta)
  );
});

export const getTaskById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const task = await maintenanceService.getTaskById(req.params.id as string);

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance task retrieved successfully", task)
  );
});

export const createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const task = await maintenanceService.createTask(req.body, userId, req.ip, req.get("user-agent"));

  res.status(HTTP_STATUS.CREATED).json(
    successResponse("Maintenance task created successfully", task)
  );
});

export const updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const task = await maintenanceService.updateTask(
    req.params.id as string,
    req.body,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance task updated successfully", task)
  );
});

export const assignTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { assignedToId } = req.body;
  const task = await maintenanceService.assignTask(
    req.params.id as string,
    assignedToId,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance task assigned successfully", task)
  );
});

export const startTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const task = await maintenanceService.startTask(
    req.params.id as string,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance task started successfully", task)
  );
});

export const completeTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const data = req.body as {
    actualCost?: number;
    findings?: string;
    partsUsed?: string;
    notes?: string;
  };
  const task = await maintenanceService.completeTask(
    req.params.id as string,
    data,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance task completed successfully", task)
  );
});

export const cancelTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const task = await maintenanceService.cancelTask(
    req.params.id as string,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance task cancelled successfully", task)
  );
});

export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  await maintenanceService.deleteTask(
    req.params.id as string,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance task deleted successfully")
  );
});

export const getOverdueTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await maintenanceService.getOverdueTasks(page, limit);

  res.status(HTTP_STATUS.OK).json(
    successResponse("Overdue maintenance tasks retrieved successfully", result.tasks, result.meta)
  );
});

export const getMaintenanceStats = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const stats = await maintenanceService.getMaintenanceStats();

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance statistics retrieved successfully", stats)
  );
});

// ─── SCHEDULE CONTROLLERS ───────────────────────────────────

export const getAllSchedules = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await maintenanceService.getAllSchedules(
    req.query as unknown as MaintenanceScheduleQueryInput
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance schedules retrieved successfully", result.schedules, result.meta)
  );
});

export const createSchedule = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const schedule = await maintenanceService.createSchedule(req.body, userId, req.ip, req.get("user-agent"));

  res.status(HTTP_STATUS.CREATED).json(
    successResponse("Maintenance schedule created successfully", schedule)
  );
});

export const updateSchedule = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const schedule = await maintenanceService.updateSchedule(
    req.params.id as string,
    req.body,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance schedule updated successfully", schedule)
  );
});

export const deleteSchedule = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  await maintenanceService.deleteSchedule(
    req.params.id as string,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance schedule deleted successfully")
  );
});

export const approveTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const task = await maintenanceService.approveTask(
    req.params.id as string,
    req.body,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance task approved successfully", task)
  );
});

export const rejectTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const task = await maintenanceService.rejectTask(
    req.params.id as string,
    req.body,
    userId,
    req.ip,
    req.get("user-agent")
  );

  res.status(HTTP_STATUS.OK).json(
    successResponse("Maintenance task rejected", task)
  );
});
