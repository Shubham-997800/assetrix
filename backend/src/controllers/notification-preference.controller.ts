import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { HTTP_STATUS } from '../constants';
import { successResponse } from '../utils/response';
import * as notificationPreferenceService from '../services/notification-preference.service';

export const getPreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const prefs = await notificationPreferenceService.getPreferences(req.user!.userId);
  res.status(HTTP_STATUS.OK).json(successResponse('Notification preferences retrieved', prefs));
};

export const updatePreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const updated = await notificationPreferenceService.updatePreferences(req.user!.userId, req.body);
  res.status(HTTP_STATUS.OK).json(successResponse('Notification preferences updated', updated));
};
