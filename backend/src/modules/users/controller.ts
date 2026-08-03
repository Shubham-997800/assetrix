import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { AppError, successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as userService from "./service";

function getAuthUser(req: AuthenticatedRequest) {
  if (!req.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }
  return req.user;
}

export const getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { users, meta } = await userService.getAll(
    req.query as unknown as userService.GetAllUsersParams,
    getAuthUser(req).userId
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Users retrieved successfully", users, meta));
});

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.getById(req.params.id as string, getAuthUser(req).userId);
  res.status(HTTP_STATUS.OK).json(successResponse("User retrieved successfully", user));
});

export const getByEmail = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.getByEmail(req.params.email as string);
  res.status(HTTP_STATUS.OK).json(successResponse("User retrieved successfully", user));
});

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.create(req.body, getAuthUser(req).userId);
  res.status(HTTP_STATUS.CREATED).json(successResponse("User created successfully", user));
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = getAuthUser(req);
  const user = await userService.update(
    req.params.id as string,
    req.body,
    userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("User updated successfully", user));
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.updateProfile(getAuthUser(req).userId, req.body);
  res.status(HTTP_STATUS.OK).json(successResponse("Profile updated successfully", user));
});

export const changeStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = getAuthUser(req);
  const user = await userService.changeStatus(
    req.params.id as string,
    req.body,
    userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("User status changed successfully", user));
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = getAuthUser(req);
  const result = await userService.remove(
    req.params.id as string,
    userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("User deleted successfully", result));
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = getAuthUser(req);
  await userService.changePassword(userId, req.body.currentPassword, req.body.newPassword);
  res.status(HTTP_STATUS.OK).json(successResponse("Password changed successfully"));
});

export const getDirectReports = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const reports = await userService.getDirectReports(req.params.id as string, getAuthUser(req).userId);
  res.status(HTTP_STATUS.OK).json(successResponse("Direct reports retrieved successfully", reports));
});
