import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as analyticsService from '../services/analytics.service';
import { HTTP_STATUS } from '../constants';

export const getDashboardStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await analyticsService.getDashboardStats();
  res.status(HTTP_STATUS.OK).json(result);
};

export const getAssetAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await analyticsService.getAssetAnalytics({
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
    departmentId: req.query.departmentId as string | undefined,
    categoryId: req.query.categoryId as string | undefined,
  });
  res.status(HTTP_STATUS.OK).json(result);
};

export const getMaintenanceAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await analyticsService.getMaintenanceAnalytics({
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
    assetId: req.query.assetId as string | undefined,
  });
  res.status(HTTP_STATUS.OK).json(result);
};

export const getBookingAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await analyticsService.getBookingAnalytics({
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
  });
  res.status(HTTP_STATUS.OK).json(result);
};

export const getFinancialAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await analyticsService.getFinancialAnalytics({
    departmentId: req.query.departmentId as string | undefined,
    categoryId: req.query.categoryId as string | undefined,
  });
  res.status(HTTP_STATUS.OK).json(result);
};

export const getDepartmentAnalytics = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await analyticsService.getDepartmentAnalytics();
  res.status(HTTP_STATUS.OK).json(result);
};
