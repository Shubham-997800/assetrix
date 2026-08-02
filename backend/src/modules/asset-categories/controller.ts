import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { AppError, successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as assetCategoryService from "./service";

function getAuthUser(req: AuthenticatedRequest) {
  if (!req.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }
  return req.user;
}

export const getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { categories, meta } = await assetCategoryService.getAll(
    req.query as unknown as assetCategoryService.GetAllParams
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Categories retrieved successfully", categories, meta));
});

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const category = await assetCategoryService.getById(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(successResponse("Category retrieved successfully", category));
});

export const getTree = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const tree = await assetCategoryService.getTree();
  res.status(HTTP_STATUS.OK).json(successResponse("Category tree retrieved successfully", tree));
});

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const category = await assetCategoryService.create(
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.CREATED).json(successResponse("Category created successfully", category));
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const category = await assetCategoryService.update(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Category updated successfully", category));
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await assetCategoryService.remove(
    req.params.id as string,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Category deleted successfully", result));
});

export const getCategoryStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const stats = await assetCategoryService.getCategoryStats(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(successResponse("Category statistics retrieved", stats));
});
