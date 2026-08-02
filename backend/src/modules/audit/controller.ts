import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as auditService from "./service";

export const getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditService.getAll(req.query as unknown as auditService.AuditFilters);

  res.status(HTTP_STATUS.OK).json(successResponse("Audit logs retrieved successfully", result.items, result.meta));
});

export const getByEntity = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const items = await auditService.getByEntity(req.params.entity as string, req.params.entityId as string);

  res.status(HTTP_STATUS.OK).json(successResponse("Entity audit logs retrieved successfully", items));
});

export const getByUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.userId as string;
  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "20", 10);

  const result = await auditService.getByUser(userId, page, limit);

  res.status(HTTP_STATUS.OK).json(successResponse("User audit logs retrieved successfully", result.items, result.meta));
});

export const getRecentActivity = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string || "50", 10);
  const items = await auditService.getRecentActivity(limit);

  res.status(HTTP_STATUS.OK).json(successResponse("Recent activity retrieved successfully", items));
});

export const exportAuditLogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { format, ...filters } = req.body || {};
  const result = await auditService.exportAuditLogs(filters, format);

  res.status(HTTP_STATUS.OK).json(successResponse("Audit logs exported successfully", result));
});
