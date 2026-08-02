import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import * as aiService from "./service";
import type { AuthenticatedRequest } from "../../middleware/auth";

export const getAssetHealthScore = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await aiService.getAssetHealthScore(req.params.assetId as string);
  res.status(HTTP_STATUS.OK).json(successResponse("Asset health score calculated successfully", result));
});

export const getRecommendationsForAsset = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await aiService.getRecommendationsForAsset(req.params.assetId as string);
    res.status(HTTP_STATUS.OK).json(successResponse("Recommendations retrieved successfully", result));
  }
);

export const generateRecommendations = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await aiService.generateRecommendations(req.user!.userId);
    res.status(HTTP_STATUS.OK).json(successResponse("Batch recommendation generation queued", result));
  }
);

export const getRecommendationStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await aiService.getRecommendationStats({
      status: req.query.status as string | undefined,
      type: req.query.type as string | undefined,
    });
    res.status(HTTP_STATUS.OK).json(successResponse("Recommendation stats retrieved successfully", result));
  }
);

export const markAsActioned = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await aiService.markAsActioned(
    req.params.id as string,
    req.body.actionTaken,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Recommendation marked as actioned", result));
});

export const getPredictiveMaintenance = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await aiService.getPredictiveMaintenance(
      req.query.assetId as string | undefined
    );
    res.status(HTTP_STATUS.OK).json(
      successResponse("Predictive maintenance analysis retrieved", result)
    );
  }
);
