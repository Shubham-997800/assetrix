import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createAllocationSchema,
  returnAllocationSchema,
  allocationIdParamSchema,
  allocationQuerySchema,
} from '../validators/allocation.schema';
import * as allocationController from '../controllers/allocation.controller';
import { ROLES } from '../constants';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /allocations:
 *   get:
 *     summary: Get all allocations (paginated)
 *     tags: [Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by asset name, tag, user name, or email
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, allocatedAt, returnedAt, status]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RETURNED, OVERDUE]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: assetId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Allocations retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/',
  validate(allocationQuerySchema, 'query'),
  allocationController.getAllAllocations
);

/**
 * @swagger
 * /allocations/active:
 *   get:
 *     summary: Get active allocations
 *     tags: [Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, allocatedAt, returnedAt, status]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Active allocations retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/active',
  validate(allocationQuerySchema, 'query'),
  allocationController.getActiveAllocations
);

/**
 * @swagger
 * /allocations/{id}:
 *   get:
 *     summary: Get allocation by ID
 *     tags: [Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Allocation ID
 *     responses:
 *       200:
 *         description: Allocation retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:id',
  validate(allocationIdParamSchema, 'params'),
  allocationController.getAllocationById
);

/**
 * @swagger
 * /allocations:
 *   post:
 *     summary: Create a new allocation
 *     tags: [Allocations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetId
 *               - userId
 *             properties:
 *               assetId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *               expectedReturn:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *               condition:
 *                 type: string
 *                 enum: [EXCELLENT, GOOD, FAIR, POOR, DAMAGED]
 *     responses:
 *       201:
 *         description: Allocation created successfully
 *       400:
 *         description: Asset is not available
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(createAllocationSchema),
  allocationController.createAllocation
);

/**
 * @swagger
 * /allocations/{id}/return:
 *   post:
 *     summary: Return an allocated asset
 *     tags: [Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Allocation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - returnCondition
 *             properties:
 *               returnCondition:
 *                 type: string
 *                 enum: [EXCELLENT, GOOD, FAIR, POOR, DAMAGED]
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Asset returned successfully
 *       400:
 *         description: Allocation already returned
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/:id/return',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER, ROLES.TECHNICIAN),
  validate(allocationIdParamSchema, 'params'),
  validate(returnAllocationSchema),
  allocationController.returnAllocation
);

export { router as allocationRouter };
