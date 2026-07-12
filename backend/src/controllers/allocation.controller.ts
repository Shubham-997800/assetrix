import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as allocationService from '../services/allocation.service';
import { HTTP_STATUS } from '../constants';
import { successResponse } from '../utils/response';

export const getAllAllocations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await allocationService.getAllAllocations(req.query as any);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getAllocationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await allocationService.getAllocationById(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(result);
};

export const createAllocation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await allocationService.createAllocation(
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.CREATED).json(result);
};

export const returnAllocation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await allocationService.returnAllocation(
    req.params.id as string,
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const getActiveAllocations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await allocationService.getActiveAllocations(req.query as any);
  res.status(HTTP_STATUS.OK).json(result);
};

export const transferAsset = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await allocationService.transferAsset(
    req.params.id as string,
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const approveTransfer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await allocationService.approveTransfer(
    req.params.id as string,
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const rejectTransfer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await allocationService.rejectTransfer(
    req.params.id as string,
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const getPendingTransfers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await allocationService.getPendingTransfers(req.query as any);
  res.status(HTTP_STATUS.OK).json(result);
};
