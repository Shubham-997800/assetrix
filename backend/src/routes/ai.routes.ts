import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as aiController from '../controllers/ai.controller';
import { z } from 'zod';

const router = Router();

const assetIdParamSchema = z.object({
  assetId: z.string().uuid('Invalid asset ID'),
});

const recommendationIdParamSchema = z.object({
  id: z.string().uuid('Invalid recommendation ID'),
});

const actionedBodySchema = z.object({
  actionTaken: z.string().min(1, 'Action description is required').max(500),
});

/**
 * @swagger
 * /ai/health/{assetId}:
 *   get:
 *     tags: [AI]
 *     summary: Get asset health score
 *     description: Calculates a comprehensive health score for an asset based on condition, age, maintenance history, cost ratio, and warranty status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Health score calculated successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/health/:assetId',
  authenticate,
  validate(assetIdParamSchema, 'params'),
  aiController.getAssetHealthScore
);

/**
 * @swagger
 * /ai/recommendations/{assetId}:
 *   get:
 *     tags: [AI]
 *     summary: Get AI recommendations for an asset
 *     description: Generates and retrieves AI-powered recommendations based on asset age, condition, maintenance history, cost analysis, and patterns
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Recommendations retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/recommendations/:assetId',
  authenticate,
  validate(assetIdParamSchema, 'params'),
  aiController.getRecommendationsForAsset
);

/**
 * @swagger
 * /ai/recommendations/generate:
 *   post:
 *     tags: [AI]
 *     summary: Generate recommendations for all assets
 *     description: Queues a batch job to generate AI recommendations for all active assets asynchronously
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Batch generation queued successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  '/recommendations/generate',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN', 'DEPARTMENT_MANAGER'),
  aiController.generateRecommendations
);

/**
 * @swagger
 * /ai/recommendations/stats:
 *   get:
 *     tags: [AI]
 *     summary: Get recommendation statistics
 *     description: Returns aggregated statistics about AI recommendations by type, status, and priority
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACTIONED, DISMISSED]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [REPLACEMENT, WARRANTY, MAINTENANCE, PATTERN, SCHEDULE, COST]
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/recommendations/stats',
  authenticate,
  aiController.getRecommendationStats
);

/**
 * @swagger
 * /ai/recommendations/{id}/action:
 *   patch:
 *     tags: [AI]
 *     summary: Mark recommendation as actioned
 *     description: Marks an AI recommendation as actioned with a description of the action taken
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [actionTaken]
 *             properties:
 *               actionTaken:
 *                 type: string
 *                 example: "Scheduled replacement for next quarter"
 *     responses:
 *       200:
 *         description: Recommendation marked as actioned
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.patch(
  '/recommendations/:id/action',
  authenticate,
  validate(recommendationIdParamSchema, 'params'),
  validate(actionedBodySchema, 'body'),
  aiController.markAsActioned
);

/**
 * @swagger
 * /ai/predictive-maintenance:
 *   get:
 *     tags: [AI]
 *     summary: Get predictive maintenance analysis
 *     description: Analyzes maintenance patterns to predict upcoming maintenance needs, detect overdue tasks, and calculate confidence intervals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assetId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter predictions for a specific asset
 *     responses:
 *       200:
 *         description: Predictive maintenance analysis retrieved
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/predictive-maintenance',
  authenticate,
  aiController.getPredictiveMaintenance
);

export const aiRouter = router;
