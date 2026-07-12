import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as reportService from '../services/report.service';
import { HTTP_STATUS } from '../constants';
import { successResponse } from '../utils/response';

export const generateReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await reportService.generateReport(
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.CREATED).json(result);
};

export const getAllReports = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await reportService.getAllReports(req.query as any);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getReportById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await reportService.getReportById(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(result);
};

export const deleteReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await reportService.deleteReport(
    req.params.id as string,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};
