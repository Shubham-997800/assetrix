import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as notificationService from "./service";
import type { NotificationQueryInput } from "./validators";

export const getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const result = await notificationService.getAll(userId, req.query as unknown as NotificationQueryInput);

  res.status(HTTP_STATUS.OK).json(
    successResponse("Notifications retrieved successfully", result.items, result.meta)
  );
});

export const getUnreadCount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const count = await notificationService.getUnreadCount(userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse("Unread count retrieved successfully", { count })
  );
});

export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  await notificationService.markAsRead(id as string, userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse("Notification marked as read")
  );
});

export const markAllAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const updatedCount = await notificationService.markAllAsRead(userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse("All notifications marked as read", { updatedCount })
  );
});

export const deleteNotification = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  await notificationService.deleteNotification(id as string, userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse("Notification deleted successfully")
  );
});

export const deleteAllRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const deletedCount = await notificationService.deleteAllRead(userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse("Read notifications deleted successfully", { deletedCount })
  );
});
