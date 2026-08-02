import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { AppError, successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as allocationService from "./service";

function getAuthUser(req: AuthenticatedRequest) {
  if (!req.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }
  return req.user;
}

export const getAllAllocations = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { allocations, meta } = await allocationService.getAll(
    req.query as unknown as allocationService.GetAllAllocationsParams,
    getAuthUser(req).userId
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Allocations retrieved successfully", allocations, meta));
});

export const getAllocationById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const allocation = await allocationService.getById(req.params.id as string, getAuthUser(req).userId);
  res.status(HTTP_STATUS.OK).json(successResponse("Allocation retrieved successfully", allocation));
});

export const createAllocation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const allocation = await allocationService.create(
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.CREATED).json(successResponse("Allocation created successfully", allocation));
});

export const returnAllocation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const allocation = await allocationService.returnAllocation(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Allocation returned successfully", allocation));
});

export const getActiveAllocations = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { allocations, meta } = await allocationService.getActive(
    req.query as unknown as allocationService.GetAllAllocationsParams,
    getAuthUser(req).userId
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Active allocations retrieved successfully", allocations, meta));
});

export const transferAsset = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const allocation = await allocationService.transferAsset(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Asset transfer initiated (pending approval)", allocation));
});

export const approveTransfer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const allocation = await allocationService.approveTransfer(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Transfer approved and completed", allocation));
});

export const rejectTransfer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const allocation = await allocationService.rejectTransfer(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Transfer rejected", allocation));
});

export const getPendingTransfers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { allocations, meta } = await allocationService.getPendingTransfers(
    req.query as unknown as allocationService.GetAllAllocationsParams,
    getAuthUser(req).userId
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Pending transfers retrieved successfully", allocations, meta));
});
