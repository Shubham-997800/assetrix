import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { AppError, successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as departmentService from "./service";

function getAuthUser(req: AuthenticatedRequest) {
  if (!req.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }
  return req.user;
}

export const getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { departments, meta } = await departmentService.getAll(
    req.query as unknown as departmentService.GetAllParams,
    getAuthUser(req).userId
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Departments retrieved successfully", departments, meta));
});

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const department = await departmentService.getById(req.params.id as string, getAuthUser(req).userId);
  res.status(HTTP_STATUS.OK).json(successResponse("Department retrieved successfully", department));
});

export const getTree = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const departments = await departmentService.getTree(getAuthUser(req).userId);
  res.status(HTTP_STATUS.OK).json(successResponse("Department tree retrieved successfully", departments));
});

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const department = await departmentService.create(
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.CREATED).json(successResponse("Department created successfully", department));
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const department = await departmentService.update(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Department updated successfully", department));
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await departmentService.remove(
    req.params.id as string,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Department deleted successfully", result));
});

export const getDepartmentStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const stats = await departmentService.getDepartmentStats(req.params.id as string, getAuthUser(req).userId);
  res.status(HTTP_STATUS.OK).json(successResponse("Department stats retrieved successfully", stats));
});
