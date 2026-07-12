import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as analyticsController from '../controllers/analytics.controller';

const router = Router();

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     tags: [Analytics]
 *     summary: Get dashboard statistics
 *     description: Returns aggregated dashboard stats including total assets, value, utilization, maintenance alerts, and recent activity
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/dashboard',
  authenticate,
  analyticsController.getDashboardStats
);

/**
 * @swagger
 * /analytics/assets:
 *   get:
 *     tags: [Analytics]
 *     summary: Get asset analytics
 *     description: Returns asset breakdown by status, condition, department, category, depreciation trends, age distribution, and top manufacturers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter end date
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by department ID
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: Asset analytics retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/assets',
  authenticate,
  analyticsController.getAssetAnalytics
);

/**
 * @swagger
 * /analytics/maintenance:
 *   get:
 *     tags: [Analytics]
 *     summary: Get maintenance analytics
 *     description: Returns maintenance cost trends, completion rates, MTBF/MTTR, and overdue task counts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: assetId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Maintenance analytics retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/maintenance',
  authenticate,
  analyticsController.getMaintenanceAnalytics
);

/**
 * @swagger
 * /analytics/bookings:
 *   get:
 *     tags: [Analytics]
 *     summary: Get booking analytics
 *     description: Returns booking utilization, popular assets, peak booking periods, and top bookers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Booking analytics retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/bookings',
  authenticate,
  analyticsController.getBookingAnalytics
);

/**
 * @swagger
 * /analytics/financial:
 *   get:
 *     tags: [Analytics]
 *     summary: Get financial analytics
 *     description: Returns total asset values, depreciation analysis, replacement costs, and warranty expiry alerts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Financial analytics retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/financial',
  authenticate,
  analyticsController.getFinancialAnalytics
);

/**
 * @swagger
 * /analytics/departments:
 *   get:
 *     tags: [Analytics]
 *     summary: Get department analytics
 *     description: Returns per-department asset counts, utilization rates, costs, and allocation statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department analytics retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/departments',
  authenticate,
  analyticsController.getDepartmentAnalytics
);

export const analyticsRouter = router;
