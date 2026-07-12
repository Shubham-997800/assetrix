import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as reportController from '../controllers/report.controller';
import {
  generateReportSchema,
  reportIdParamSchema,
  reportQuerySchema,
} from '../validators/report.schema';

const router = Router();

/**
 * @swagger
 * /reports:
 *   post:
 *     tags: [Reports]
 *     summary: Generate a new report
 *     description: Generates a report of the specified type (ASSET, MAINTENANCE, FINANCIAL, BOOKING, AUDIT, DEPARTMENT)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Q4 Asset Report"
 *               type:
 *                 type: string
 *                 enum: [ASSET, MAINTENANCE, FINANCIAL, BOOKING, AUDIT, DEPARTMENT]
 *               format:
 *                 type: string
 *                 enum: [JSON, CSV, PDF]
 *                 default: JSON
 *               filters:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                   departmentId:
 *                     type: string
 *                     format: uuid
 *                   categoryId:
 *                     type: string
 *                     format: uuid
 *                   status:
 *                     type: string
 *                   assetId:
 *                     type: string
 *                     format: uuid
 *                   userId:
 *                     type: string
 *                     format: uuid
 *     responses:
 *       201:
 *         description: Report generated successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/',
  authenticate,
  validate(generateReportSchema, 'body'),
  reportController.generateReport
);

/**
 * @swagger
 * /reports:
 *   get:
 *     tags: [Reports]
 *     summary: List all reports
 *     description: Retrieves a paginated list of all generated reports with optional filtering
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
 *           maximum: 100
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ASSET, MAINTENANCE, FINANCIAL, BOOKING, AUDIT, DEPARTMENT]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PROCESSING, COMPLETED, FAILED]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, completedAt, name, type]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/',
  authenticate,
  validate(reportQuerySchema, 'query'),
  reportController.getAllReports
);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     tags: [Reports]
 *     summary: Get report by ID
 *     description: Retrieves a single report with full details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:id',
  authenticate,
  validate(reportIdParamSchema, 'params'),
  reportController.getReportById
);

/**
 * @swagger
 * /reports/{id}/download:
 *   get:
 *     tags: [Reports]
 *     summary: Download a report
 *     description: Downloads the report data as CSV, PDF, or Excel file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, pdf, excel]
 *           default: csv
 *     responses:
 *       200:
 *         description: Report file download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:id/download',
  authenticate,
  validate(reportIdParamSchema, 'params'),
  reportController.downloadReport
);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     tags: [Reports]
 *     summary: Delete a report
 *     description: Permanently deletes a generated report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(reportIdParamSchema, 'params'),
  reportController.deleteReport
);

export const reportRouter = router;
