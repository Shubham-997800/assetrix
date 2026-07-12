import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { HTTP_STATUS } from '../constants';
import * as auditCycleService from '../services/audit-cycle.service';

export const getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.getAll(req.query as any);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.getById(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(result);
};

export const create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.create(req.body, req.user!.userId, req.ip, req.headers['user-agent']);
  res.status(HTTP_STATUS.CREATED).json(result);
};

export const update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.update(req.params.id as string, req.body, req.user!.userId, req.ip, req.headers['user-agent']);
  res.status(HTTP_STATUS.OK).json(result);
};

export const remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.remove(req.params.id as string, req.user!.userId, req.ip, req.headers['user-agent']);
  res.status(HTTP_STATUS.OK).json(result);
};

export const assignAuditors = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.assignAuditors(req.params.id as string, req.body, req.user!.userId, req.ip, req.headers['user-agent']);
  res.status(HTTP_STATUS.OK).json(result);
};

export const verifyAsset = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.verifyAsset(req.params.id as string, req.body, req.user!.userId, req.ip, req.headers['user-agent']);
  res.status(HTTP_STATUS.OK).json(result);
};

export const createDiscrepancy = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.createDiscrepancy(req.params.id as string, req.body, req.user!.userId, req.ip, req.headers['user-agent']);
  res.status(HTTP_STATUS.CREATED).json(result);
};

export const resolveDiscrepancy = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.resolveDiscrepancy(req.params.discrepancyId as string, req.body, req.user!.userId, req.ip, req.headers['user-agent']);
  res.status(HTTP_STATUS.OK).json(result);
};

export const closeCycle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.closeCycle(req.params.id as string, req.user!.userId, req.ip, req.headers['user-agent']);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getCycleHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditCycleService.getCycleHistory(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(result);
};
