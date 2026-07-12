import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as aiService from '../services/ai.service';
import { HTTP_STATUS } from '../constants';

export const getRecommendationsForAsset = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const result = await aiService.getRecommendationsForAsset(req.params.assetId as string);
  res.status(HTTP_STATUS.OK).json(result);
};

export const generateRecommendations = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const result = await aiService.generateRecommendations(req.user!.userId);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getRecommendationStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const result = await aiService.getRecommendationStats({
    status: req.query.status as string | undefined,
    type: req.query.type as string | undefined,
  });
  res.status(HTTP_STATUS.OK).json(result);
};

export const markAsActioned = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const result = await aiService.markAsActioned(
    req.params.id as string,
    req.body.actionTaken,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const getPredictiveMaintenance = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const result = await aiService.getPredictiveMaintenance(
    req.query.assetId as string | undefined
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const getAssetHealthScore = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const result = await aiService.getAssetHealthScore(req.params.assetId as string);
  res.status(HTTP_STATUS.OK).json(result);
};
