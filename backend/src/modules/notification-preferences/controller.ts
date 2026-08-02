import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as notificationPreferenceService from "./service";

export const getPreferences = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const prefs = await notificationPreferenceService.getPreferences(req.user!.userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse("Notification preferences retrieved", prefs)
  );
});

export const updatePreferences = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const updated = await notificationPreferenceService.updatePreferences(req.user!.userId, req.body);

  res.status(HTTP_STATUS.OK).json(
    successResponse("Notification preferences updated", updated)
  );
});
