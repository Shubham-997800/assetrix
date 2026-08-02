import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { ROLES } from "../../constants";
import {
  approveMaintenanceSchema,
  assignTaskSchema,
  createMaintenanceScheduleSchema,
  createMaintenanceTaskSchema,
  maintenanceScheduleQuerySchema,
  maintenanceTaskQuerySchema,
  rejectMaintenanceSchema,
  scheduleIdParamSchema,
  taskIdParamSchema,
  updateMaintenanceScheduleSchema,
  updateMaintenanceTaskSchema,
} from "./validators";
import * as maintenanceController from "./controller";

const router = Router();

router.use(authenticate);

// ─── MAINTENANCE SCHEDULES ──────────────────────────────────

router.get(
  "/schedules",
  validate(maintenanceScheduleQuerySchema, "query"),
  maintenanceController.getAllSchedules
);

router.post(
  "/schedules",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(createMaintenanceScheduleSchema),
  maintenanceController.createSchedule
);

router.put(
  "/schedules/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(scheduleIdParamSchema, "params"),
  validate(updateMaintenanceScheduleSchema),
  maintenanceController.updateSchedule
);

router.delete(
  "/schedules/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(scheduleIdParamSchema, "params"),
  maintenanceController.deleteSchedule
);

// ─── MAINTENANCE TASKS ──────────────────────────────────────

router.get(
  "/",
  validate(maintenanceTaskQuerySchema, "query"),
  maintenanceController.getAllTasks
);

router.get(
  "/stats",
  maintenanceController.getMaintenanceStats
);

router.get(
  "/overdue",
  maintenanceController.getOverdueTasks
);

router.get(
  "/:id",
  validate(taskIdParamSchema, "params"),
  maintenanceController.getTaskById
);

router.post(
  "/",
  validate(createMaintenanceTaskSchema),
  maintenanceController.createTask
);

router.put(
  "/:id",
  validate(taskIdParamSchema, "params"),
  validate(updateMaintenanceTaskSchema),
  maintenanceController.updateTask
);

router.put(
  "/:id/assign",
  validate(taskIdParamSchema, "params"),
  validate(assignTaskSchema),
  maintenanceController.assignTask
);

router.put(
  "/:id/start",
  validate(taskIdParamSchema, "params"),
  maintenanceController.startTask
);

router.put(
  "/:id/complete",
  validate(taskIdParamSchema, "params"),
  maintenanceController.completeTask
);

router.put(
  "/:id/cancel",
  validate(taskIdParamSchema, "params"),
  maintenanceController.cancelTask
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(taskIdParamSchema, "params"),
  maintenanceController.deleteTask
);

router.post(
  "/:id/approve",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(taskIdParamSchema, "params"),
  validate(approveMaintenanceSchema),
  maintenanceController.approveTask
);

router.post(
  "/:id/reject",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(taskIdParamSchema, "params"),
  validate(rejectMaintenanceSchema),
  maintenanceController.rejectTask
);

export default router;
