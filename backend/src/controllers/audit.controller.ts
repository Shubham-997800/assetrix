import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as auditService from '../services/audit.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants';

/**
 * @swagger
 * /audit:
 *   get:
 *     tags: [Audit]
 *     summary: Get all audit logs (paginated, filterable)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *         description: Filter by entity type (e.g. Asset, User, Booking)
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *         description: Filter by specific entity ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user who performed the action
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type (e.g. CREATE, UPDATE, DELETE)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs before this date
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 */
export const getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await auditService.getAll(req.query as Record<string, string>);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Audit logs retrieved successfully', result.items, {
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
 * /audit/entity/{entity}/{entityId}:
 *   get:
 *     tags: [Audit]
 *     summary: Get audit logs for a specific entity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *         description: Entity type
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Entity audit logs retrieved successfully
 */
export const getByEntity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const entity = req.params.entity as string;
  const entityId = req.params.entityId as string;
  const items = await auditService.getByEntity(entity, entityId);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Entity audit logs retrieved successfully', items),
  );
};

/**
 * @swagger
 * /audit/user/{userId}:
 *   get:
 *     tags: [Audit]
 *     summary: Get audit logs for a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *         description: User audit logs retrieved successfully
 */
export const getByUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.params.userId as string;
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '20', 10);

  const result = await auditService.getByUser(userId, page, limit);

  res.status(HTTP_STATUS.OK).json(
    successResponse('User audit logs retrieved successfully', result.items, {
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
 * /audit/recent:
 *   get:
 *     tags: [Audit]
 *     summary: Get recent activity across all modules
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
 *         description: Recent activity retrieved successfully
 */
export const getRecentActivity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const limit = parseInt(req.query.limit as string || '50', 10);
  const items = await auditService.getRecentActivity(limit);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Recent activity retrieved successfully', items),
  );
};

/**
 * @swagger
 * /audit/export:
 *   post:
 *     tags: [Audit]
 *     summary: Export audit logs (queued job)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entity:
 *                 type: string
 *               entityId:
 *                 type: string
 *               userId:
 *                 type: string
 *               action:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               format:
 *                 type: string
 *                 enum: [csv, json, xlsx]
 *                 default: csv
 *     responses:
 *       202:
 *         description: Export job queued successfully
 */
export const exportAuditLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { format, ...filters } = req.body || {};
  const jobId = await auditService.exportAuditLogs(filters, format);

  res.status(HTTP_STATUS.OK).json(
    successResponse('Audit export job queued successfully', { jobId }),
  );
};
