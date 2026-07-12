import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { HTTP_STATUS } from '../constants';
import { successResponse } from '../utils/response';
import * as assetCategoryService from '../services/asset-category.service';

export const getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await assetCategoryService.getAll(req.query as any);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await assetCategoryService.getById(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getTree = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await assetCategoryService.getTree();
  res.status(HTTP_STATUS.OK).json(result);
};

export const create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await assetCategoryService.create(
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.CREATED).json(result);
};

export const update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await assetCategoryService.update(
    req.params.id as string,
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await assetCategoryService.remove(
    req.params.id as string,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const getCategoryStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await assetCategoryService.getCategoryStats(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(result);
};
