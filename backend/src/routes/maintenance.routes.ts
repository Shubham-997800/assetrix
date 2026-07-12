import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createMaintenanceTaskSchema,
  updateMaintenanceTaskSchema,
  assignTaskSchema,
  taskIdParamSchema,
  maintenanceTaskQuerySchema,
  createMaintenanceScheduleSchema,
  updateMaintenanceScheduleSchema,
  scheduleIdParamSchema,
  maintenanceScheduleQuerySchema,
} from '../validators/maintenance.schema';
import * as maintenanceController from '../controllers/maintenance.controller';

const router = Router();

router.use(authenticate);

// ─── MAINTENANCE TASKS ──────────────────────────────────────

/**
 * @openapi
 * /maintenance/tasks:
 *   get:
 *     tags: [Maintenance]
 *     summary: Get all maintenance tasks
 *     description: Retrieve a paginated list of maintenance tasks with filtering, sorting, and search capabilities.
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
 *         description: Search in title, description, notes, asset name, asset tag
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, status, type, priority, scheduledDate, createdAt, updatedAt, startedAt, completedAt]
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, OVERDUE]
 *         description: Filter by maintenance status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PREVENTIVE, CORRECTIVE, PREDICTIVE, EMERGENCY]
 *         description: Filter by maintenance type
 *       - in: query
 *         name: assetId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by asset ID
 *       - in: query
 *         name: assignedToId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by assigned technician ID
 *       - in: query
 *         name: priority
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by priority level
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks scheduled on or after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks scheduled on or before this date
 *     responses:
 *       200:
 *         description: Maintenance tasks retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get(
  '/',
  validate(maintenanceTaskQuerySchema, 'query'),
  maintenanceController.getAllTasks
);

/**
 * @openapi
 * /maintenance/tasks/stats:
 *   get:
 *     tags: [Maintenance]
 *     summary: Get maintenance statistics
 *     description: Retrieve maintenance statistics including counts by status, type, total costs, upcoming tasks, and recent completions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Maintenance statistics retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/stats',
  maintenanceController.getMaintenanceStats
);

/**
 * @openapi
 * /maintenance/tasks/overdue:
 *   get:
 *     tags: [Maintenance]
 *     summary: Get overdue maintenance tasks
 *     description: Retrieve a paginated list of overdue maintenance tasks. Automatically marks eligible tasks as OVERDUE.
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
 *     responses:
 *       200:
 *         description: Overdue tasks retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/overdue',
  maintenanceController.getOverdueTasks
);

/**
 * @openapi
 * /maintenance/tasks/{id}:
 *   get:
 *     tags: [Maintenance]
 *     summary: Get a maintenance task by ID
 *     description: Retrieve a single maintenance task with full details including asset, assigned technician, schedule, and attachments.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Maintenance task ID
 *     responses:
 *       200:
 *         description: Maintenance task retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:id',
  validate(taskIdParamSchema, 'params'),
  maintenanceController.getTaskById
);

/**
 * @openapi
 * /maintenance/tasks:
 *   post:
 *     tags: [Maintenance]
 *     summary: Create a maintenance task
 *     description: Create a new maintenance task. If a technician is assigned, they will receive a notification.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - assetId
 *               - scheduledDate
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 description: Task title
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Task description
 *               assetId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the asset to maintain
 *               scheduleId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Optional linked maintenance schedule ID
 *               type:
 *                 type: string
 *                 enum: [PREVENTIVE, CORRECTIVE, PREDICTIVE, EMERGENCY]
 *                 default: PREVENTIVE
 *                 description: Maintenance type
 *               priority:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 3
 *                 description: Priority level (1 = highest, 5 = lowest)
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Technician to assign the task to
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 description: When the maintenance is scheduled
 *               estimatedCost:
 *                 type: number
 *                 minimum: 0
 *                 nullable: true
 *                 description: Estimated maintenance cost
 *               notes:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Additional notes
 *               findings:
 *                 type: string
 *                 maxLength: 5000
 *                 description: Initial findings
 *               partsUsed:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Parts to be used
 *               externalVendor:
 *                 type: string
 *                 maxLength: 255
 *                 description: External vendor name
 *     responses:
 *       201:
 *         description: Maintenance task created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Asset or technician not found
 */
router.post(
  '/',
  validate(createMaintenanceTaskSchema),
  maintenanceController.createTask
);

/**
 * @openapi
 * /maintenance/tasks/{id}:
 *   put:
 *     tags: [Maintenance]
 *     summary: Update a maintenance task
 *     description: Update maintenance task fields. Cannot update completed or cancelled tasks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Maintenance task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *               type:
 *                 type: string
 *                 enum: [PREVENTIVE, CORRECTIVE, PREDICTIVE, EMERGENCY]
 *               priority:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               estimatedCost:
 *                 type: number
 *                 minimum: 0
 *               actualCost:
 *                 type: number
 *                 minimum: 0
 *               notes:
 *                 type: string
 *                 maxLength: 2000
 *               findings:
 *                 type: string
 *                 maxLength: 5000
 *               partsUsed:
 *                 type: string
 *                 maxLength: 2000
 *               externalVendor:
 *                 type: string
 *                 maxLength: 255
 *     responses:
 *       200:
 *         description: Maintenance task updated successfully
 *       400:
 *         description: Task is completed or cancelled
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.put(
  '/:id',
  validate(taskIdParamSchema, 'params'),
  validate(updateMaintenanceTaskSchema),
  maintenanceController.updateTask
);

/**
 * @openapi
 * /maintenance/tasks/{id}/assign:
 *   put:
 *     tags: [Maintenance]
 *     summary: Assign a maintenance task
 *     description: Assign or reassign a maintenance task to a technician. The technician will receive a notification.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Maintenance task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignedToId
 *             properties:
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *                 description: Technician user ID
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       400:
 *         description: Task is completed or cancelled
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Task or technician not found
 */
router.put(
  '/:id/assign',
  validate(taskIdParamSchema, 'params'),
  validate(assignTaskSchema),
  maintenanceController.assignTask
);

/**
 * @openapi
 * /maintenance/tasks/{id}/start:
 *   put:
 *     tags: [Maintenance]
 *     summary: Start a maintenance task
 *     description: Mark a scheduled or overdue task as in-progress and record the start time.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Maintenance task ID
 *     responses:
 *       200:
 *         description: Task started successfully
 *       400:
 *         description: Task cannot be started in its current status
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  '/:id/start',
  validate(taskIdParamSchema, 'params'),
  maintenanceController.startTask
);

/**
 * @openapi
 * /maintenance/tasks/{id}/complete:
 *   put:
 *     tags: [Maintenance]
 *     summary: Complete a maintenance task
 *     description: Mark an in-progress task as completed, record the completion time, and update the asset's last maintenance date.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Maintenance task ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualCost:
 *                 type: number
 *                 minimum: 0
 *                 description: Actual maintenance cost
 *               findings:
 *                 type: string
 *                 maxLength: 5000
 *                 description: Maintenance findings
 *               partsUsed:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Parts used during maintenance
 *               notes:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Additional completion notes
 *     responses:
 *       200:
 *         description: Task completed successfully
 *       400:
 *         description: Task is not in-progress
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  '/:id/complete',
  validate(taskIdParamSchema, 'params'),
  maintenanceController.completeTask
);

/**
 * @openapi
 * /maintenance/tasks/{id}/cancel:
 *   put:
 *     tags: [Maintenance]
 *     summary: Cancel a maintenance task
 *     description: Cancel a scheduled, in-progress, or overdue task. Completed tasks cannot be cancelled.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Maintenance task ID
 *     responses:
 *       200:
 *         description: Task cancelled successfully
 *       400:
 *         description: Task is completed or already cancelled
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  '/:id/cancel',
  validate(taskIdParamSchema, 'params'),
  maintenanceController.cancelTask
);

/**
 * @openapi
 * /maintenance/tasks/{id}:
 *   delete:
 *     tags: [Maintenance]
 *     summary: Delete a maintenance task
 *     description: Soft-delete a maintenance task. In-progress tasks must be cancelled before deletion.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Maintenance task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       400:
 *         description: Cannot delete an in-progress task
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(taskIdParamSchema, 'params'),
  maintenanceController.deleteTask
);

// ─── MAINTENANCE SCHEDULES ──────────────────────────────────

/**
 * @openapi
 * /maintenance/schedules:
 *   get:
 *     tags: [Maintenance Schedules]
 *     summary: Get all maintenance schedules
 *     description: Retrieve a paginated list of maintenance schedules with filtering, sorting, and search.
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
 *         description: Search in name, description, asset name, asset tag
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, type, intervalDays, nextRunDate, isActive, createdAt]
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: assetId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by asset ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PREVENTIVE, CORRECTIVE, PREDICTIVE, EMERGENCY]
 *         description: Filter by maintenance type
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Maintenance schedules retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get(
  '/schedules',
  validate(maintenanceScheduleQuerySchema, 'query'),
  maintenanceController.getAllSchedules
);

/**
 * @openapi
 * /maintenance/schedules:
 *   post:
 *     tags: [Maintenance Schedules]
 *     summary: Create a maintenance schedule
 *     description: Create a recurring maintenance schedule for an asset.
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
 *               - name
 *             properties:
 *               assetId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the asset to schedule maintenance for
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 description: Schedule name
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Schedule description
 *               type:
 *                 type: string
 *                 enum: [PREVENTIVE, CORRECTIVE, PREDICTIVE, EMERGENCY]
 *                 default: PREVENTIVE
 *                 description: Maintenance type
 *               intervalDays:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *                 description: Interval in days between scheduled runs
 *               nextRunDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Next scheduled run date
 *     responses:
 *       201:
 *         description: Maintenance schedule created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Asset not found
 */
router.post(
  '/schedules',
  authorize('SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_MANAGER'),
  validate(createMaintenanceScheduleSchema),
  maintenanceController.createSchedule
);

/**
 * @openapi
 * /maintenance/schedules/{id}:
 *   put:
 *     tags: [Maintenance Schedules]
 *     summary: Update a maintenance schedule
 *     description: Update an existing maintenance schedule's properties.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Maintenance schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *               type:
 *                 type: string
 *                 enum: [PREVENTIVE, CORRECTIVE, PREDICTIVE, EMERGENCY]
 *               intervalDays:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *               nextRunDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Maintenance schedule updated successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.put(
  '/schedules/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_MANAGER'),
  validate(scheduleIdParamSchema, 'params'),
  validate(updateMaintenanceScheduleSchema),
  maintenanceController.updateSchedule
);

/**
 * @openapi
 * /maintenance/schedules/{id}:
 *   delete:
 *     tags: [Maintenance Schedules]
 *     summary: Delete a maintenance schedule
 *     description: Permanently delete a maintenance schedule. Cannot delete schedules with active tasks.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Maintenance schedule ID
 *     responses:
 *       200:
 *         description: Maintenance schedule deleted successfully
 *       400:
 *         description: Schedule has active tasks
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/schedules/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_MANAGER'),
  validate(scheduleIdParamSchema, 'params'),
  maintenanceController.deleteSchedule
);

export { router as maintenanceRouter };
