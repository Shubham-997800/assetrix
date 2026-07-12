import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as notificationService from '../services/notification.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants';

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get all notifications for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [USER_REGISTRATION, EMAIL_VERIFICATION, ASSET_ASSIGNED, ASSET_RETURNED, BOOKING_APPROVED, BOOKING_REJECTED, REQUEST_APPROVED, REQUEST_REJECTED, MAINTENANCE_ASSIGNED, MAINTENANCE_COMPLETED, WARRANTY_EXPIRY, PASSWORD_CHANGED, SYSTEM_ALERT]
 *         description: Filter by notification type
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Filter by read status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
export const getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const result = await notificationService.getAll(userId, req.query as Record<string, string>);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Notifications retrieved successfully', result.items, {
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    }),
  );
};

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notification count
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 */
export const getUnreadCount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const count = await notificationService.getUnreadCount(userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Unread count retrieved successfully', { count }),
  );
};

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const { id } = req.params;

  await notificationService.markAsRead(id as string, userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Notification marked as read'),
  );
};

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const updatedCount = await notificationService.markAllAsRead(userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse('All notifications marked as read', { updatedCount }),
  );
};

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
export const deleteNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const { id } = req.params;

  await notificationService.deleteNotification(id as string, userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Notification deleted successfully'),
  );
};

/**
 * @swagger
 * /notifications/read:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete all read notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Read notifications deleted successfully
 */
export const deleteAllRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const deletedCount = await notificationService.deleteAllRead(userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Read notifications deleted successfully', { deletedCount }),
  );
};
