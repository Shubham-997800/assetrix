import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as auditCycleService from "./service";
import type {
  AssignAuditorsInput,
  AuditCycleParamsInput,
  CreateAuditCycleInput,
  CreateDiscrepancyInput,
  ResolveDiscrepancyParamsInput,
  ResolveDiscrepancyInput,
  UpdateAuditCycleInput,
  VerifyAssetInput,
} from "./validators";

export const getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.getAll(req.query as unknown as auditCycleService.GetAllCyclesParams);
  res.status(HTTP_STATUS.OK).json(successResponse("Audit cycles retrieved successfully", result.cycles, result.meta));
});

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.getById((req.params as AuditCycleParamsInput).id);
  res.status(HTTP_STATUS.OK).json(successResponse("Audit cycle retrieved successfully", result));
});

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.create(
    req.body as CreateAuditCycleInput,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.CREATED).json(successResponse("Audit cycle created successfully", result));
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.update(
    (req.params as AuditCycleParamsInput).id,
    req.body as UpdateAuditCycleInput,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Audit cycle updated successfully", result));
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await auditCycleService.remove(
    (req.params as AuditCycleParamsInput).id,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Audit cycle deleted successfully"));
});

export const assignAuditors = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.assignAuditors(
    (req.params as AuditCycleParamsInput).id,
    req.body as AssignAuditorsInput,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Auditors assigned successfully", result));
});

export const verifyAsset = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.verifyAsset(
    (req.params as AuditCycleParamsInput).id,
    req.body as VerifyAssetInput,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Asset verified successfully", result));
});

export const createDiscrepancy = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.createDiscrepancy(
    (req.params as AuditCycleParamsInput).id,
    req.body as CreateDiscrepancyInput,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.CREATED).json(successResponse("Discrepancy reported successfully", result));
});

export const resolveDiscrepancy = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.resolveDiscrepancy(
    (req.params as ResolveDiscrepancyParamsInput).discrepancyId,
    req.body as ResolveDiscrepancyInput,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Discrepancy resolved successfully", result));
});

export const closeCycle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.closeCycle(
    (req.params as AuditCycleParamsInput).id,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Audit cycle closed successfully", result));
});

export const getCycleHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await auditCycleService.getCycleHistory((req.params as AuditCycleParamsInput).id);
  res.status(HTTP_STATUS.OK).json(successResponse("Audit cycle history retrieved successfully", result));
});
