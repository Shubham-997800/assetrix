import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as analyticsService from "./service";

export const getDashboardStats = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const data = await analyticsService.getDashboardStats();
  res.status(HTTP_STATUS.OK).json(successResponse("Dashboard stats retrieved successfully", data));
});

export const getAssetAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const data = await analyticsService.getAssetAnalytics({
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
    departmentId: req.query.departmentId as string | undefined,
    categoryId: req.query.categoryId as string | undefined,
  });
  res.status(HTTP_STATUS.OK).json(successResponse("Asset analytics retrieved successfully", data));
});

export const getMaintenanceAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const data = await analyticsService.getMaintenanceAnalytics({
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
    assetId: req.query.assetId as string | undefined,
  });
  res.status(HTTP_STATUS.OK).json(successResponse("Maintenance analytics retrieved successfully", data));
});

export const getBookingAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const data = await analyticsService.getBookingAnalytics({
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
  });
  res.status(HTTP_STATUS.OK).json(successResponse("Booking analytics retrieved successfully", data));
});

export const getFinancialAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const data = await analyticsService.getFinancialAnalytics({
    departmentId: req.query.departmentId as string | undefined,
    categoryId: req.query.categoryId as string | undefined,
  });
  res.status(HTTP_STATUS.OK).json(successResponse("Financial analytics retrieved successfully", data));
});

export const getDepartmentAnalytics = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const data = await analyticsService.getDepartmentAnalytics();
  res.status(HTTP_STATUS.OK).json(successResponse("Department analytics retrieved successfully", data));
});
