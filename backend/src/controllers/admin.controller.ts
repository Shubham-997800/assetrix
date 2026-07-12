import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as adminService from '../services/admin.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants';

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get system-wide statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics retrieved successfully
 */
export const getSystemStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const stats = await adminService.getSystemStats();

  res.status(HTTP_STATUS.OK).json(
    successResponse('System statistics retrieved successfully', stats),
  );
};

/**
 * @swagger
 * /admin/stats/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get user statistics (by role, status, registrations over time)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 */
export const getUserStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const stats = await adminService.getUserStats();

  res.status(HTTP_STATUS.OK).json(
    successResponse('User statistics retrieved successfully', stats),
  );
};

/**
 * @swagger
 * /admin/stats/assets:
 *   get:
 *     tags: [Admin]
 *     summary: Get asset statistics (by status, condition, department, total value)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Asset statistics retrieved successfully
 */
export const getAssetStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const stats = await adminService.getAssetStats();

  res.status(HTTP_STATUS.OK).json(
    successResponse('Asset statistics retrieved successfully', stats),
  );
};

/**
 * @swagger
 * /admin/health:
 *   get:
 *     tags: [Admin]
 *     summary: Get system health status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System health retrieved successfully
 */
export const getSystemHealth = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const health = await adminService.getSystemHealth();

  res.status(HTTP_STATUS.OK).json(
    successResponse('System health retrieved successfully', health),
  );
};

/**
 * @swagger
 * /admin/settings:
 *   get:
 *     tags: [Admin]
 *     summary: Get all system settings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter settings by category
 *     responses:
 *       200:
 *         description: System settings retrieved successfully
 */
export const getSystemSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const category = req.query.category as string | undefined;
  const settings = await adminService.getSystemSettings(category);

  res.status(HTTP_STATUS.OK).json(
    successResponse('System settings retrieved successfully', settings),
  );
};

/**
 * @swagger
 * /admin/settings:
 *   put:
 *     tags: [Admin]
 *     summary: Create or update a system setting
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, value]
 *             properties:
 *               key:
 *                 type: string
 *                 description: Setting key
 *               value:
 *                 description: Setting value (any JSON type)
 *               description:
 *                 type: string
 *                 description: Optional description
 *     responses:
 *       200:
 *         description: System setting updated successfully
 */
export const updateSystemSetting = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { key, value, description } = req.body;
  const userId = req.user!.userId;

  const setting = await adminService.updateSystemSetting(key, value, userId, description);

  res.status(HTTP_STATUS.OK).json(
    successResponse('System setting updated successfully', setting),
  );
};

/**
 * @swagger
 * /admin/activity:
 *   get:
 *     tags: [Admin]
 *     summary: Get recent system activity across all modules
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: System activity retrieved successfully
 */
export const getSystemActivity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const limit = parseInt(req.query.limit as string || '50', 10);
  const activity = await adminService.getSystemActivity(limit);

  res.status(HTTP_STATUS.OK).json(
    successResponse('System activity retrieved successfully', activity),
  );
};

/**
 * @swagger
 * /admin/users/{userId}/force-logout:
 *   post:
 *     tags: [Admin]
 *     summary: Force logout a user by revoking all sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID
 *     responses:
 *       200:
 *         description: User sessions revoked successfully
 *       404:
 *         description: User not found
 */
export const forceLogout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.params.userId as string;
  const revokedCount = await adminService.forceLogout(userId);

  res.status(HTTP_STATUS.OK).json(
    successResponse('User sessions revoked successfully', { revokedSessions: revokedCount }),
  );
};

/**
 * @swagger
 * /admin/backup:
 *   post:
 *     tags: [Admin]
 *     summary: Initiate a database backup
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Database backup initiated successfully
 */
export const backupDatabase = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await adminService.backupDatabase();

  res.status(HTTP_STATUS.OK).json(
    successResponse('Database backup initiated successfully', result),
  );
};
