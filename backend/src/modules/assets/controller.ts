import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { AppError, successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as assetService from "./service";

function getAuthUser(req: AuthenticatedRequest) {
  if (!req.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }
  return req.user;
}

export const getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { assets, meta } = await assetService.getAll(
    req.query as unknown as assetService.GetAllAssetsParams,
    getAuthUser(req).userId
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Assets retrieved successfully", assets, meta));
});

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const asset = await assetService.getById(req.params.id as string, getAuthUser(req).userId);
  res.status(HTTP_STATUS.OK).json(successResponse("Asset retrieved successfully", asset));
});

export const getByQrCode = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const asset = await assetService.getByQrCode(req.params.qrCode as string, getAuthUser(req).userId);
  res.status(HTTP_STATUS.OK).json(successResponse("Asset retrieved successfully", asset));
});

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const asset = await assetService.create(
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.CREATED).json(successResponse("Asset created successfully", asset));
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const asset = await assetService.update(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Asset updated successfully", asset));
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await assetService.remove(
    req.params.id as string,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Asset deleted successfully"));
});

export const assign = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const asset = await assetService.assign(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Asset assigned successfully", asset));
});

export const unallocate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const asset = await assetService.unallocate(
    req.params.id as string,
    req.body.condition,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Asset unallocated successfully", asset));
});

export const changeStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const asset = await assetService.changeStatus(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Asset status updated successfully", asset));
});

export const changeCondition = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const asset = await assetService.changeCondition(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Asset condition updated successfully", asset));
});

export const getHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await assetService.getHistory(req.params.id as string, getAuthUser(req).userId, page, limit);
  res.status(HTTP_STATUS.OK).json(successResponse("Asset history retrieved successfully", result.items, result.meta));
});

export const getStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const stats = await assetService.getStats(getAuthUser(req).userId);
  res.status(HTTP_STATUS.OK).json(successResponse("Asset statistics retrieved successfully", stats));
});

export const search = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const query = req.query.q as string;
  const limit = parseInt(req.query.limit as string) || 20;
  const assets = await assetService.search(query, getAuthUser(req).userId, limit);
  res.status(HTTP_STATUS.OK).json(successResponse("Search results retrieved successfully", assets));
});
