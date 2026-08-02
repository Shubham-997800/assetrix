import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import * as adminService from "./service";
import type { AuthenticatedRequest } from "../../middleware/auth";

export const getSystemStats = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const stats = await adminService.getSystemStats();

  res.status(HTTP_STATUS.OK).json(successResponse("System statistics retrieved successfully", stats));
});

export const getUserStats = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const stats = await adminService.getUserStats();

  res.status(HTTP_STATUS.OK).json(successResponse("User statistics retrieved successfully", stats));
});

export const getAssetStats = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const stats = await adminService.getAssetStats();

  res.status(HTTP_STATUS.OK).json(successResponse("Asset statistics retrieved successfully", stats));
});

export const getSystemHealth = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const health = await adminService.getSystemHealth();

  res.status(HTTP_STATUS.OK).json(successResponse("System health retrieved successfully", health));
});

export const getSystemSettings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const category = req.query.category as string | undefined;
  const settings = await adminService.getSystemSettings(category);

  res.status(HTTP_STATUS.OK).json(successResponse("System settings retrieved successfully", settings));
});

export const updateSystemSetting = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { key, value, description } = req.body;
  const userId = req.user!.userId;

  const setting = await adminService.updateSystemSetting(key, value, userId, description);

  res.status(HTTP_STATUS.OK).json(successResponse("System setting updated successfully", setting));
});

export const getSystemActivity = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string || "50", 10);
  const activity = await adminService.getSystemActivity(limit);

  res.status(HTTP_STATUS.OK).json(successResponse("System activity retrieved successfully", activity));
});

export const forceLogout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.userId as string;
  const revokedCount = await adminService.forceLogout(userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse("User sessions revoked successfully", { revokedSessions: revokedCount })
  );
});

export const backupDatabase = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const result = await adminService.backupDatabase();

  res.status(HTTP_STATUS.OK).json(successResponse("Database backup initiated successfully", result));
});
