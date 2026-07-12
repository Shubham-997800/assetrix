import { z } from 'zod';

const maintenanceStatusEnum = z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE']);
const maintenanceTypeEnum = z.enum(['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'EMERGENCY']);

// ─── CREATE MAINTENANCE TASK ────────────────────────────────

export const createMaintenanceTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),
  assetId: z.string().uuid('Invalid asset ID'),
  scheduleId: z.string().uuid('Invalid schedule ID').optional().nullable(),
  type: maintenanceTypeEnum.default('PREVENTIVE'),
  priority: z
    .number()
    .int()
    .min(1, 'Priority must be at least 1')
    .max(5, 'Priority must not exceed 5')
    .default(3),
  assignedToId: z.string().uuid('Invalid technician ID').optional().nullable(),
  scheduledDate: z.coerce.date({ required_error: 'Scheduled date is required' }),
  estimatedCost: z
    .number()
    .min(0, 'Estimated cost cannot be negative')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .trim()
    .optional(),
  findings: z
    .string()
    .max(5000, 'Findings must not exceed 5000 characters')
    .trim()
    .optional(),
  partsUsed: z
    .string()
    .max(2000, 'Parts used must not exceed 2000 characters')
    .trim()
    .optional(),
  externalVendor: z
    .string()
    .max(255, 'External vendor must not exceed 255 characters')
    .trim()
    .optional(),
});

// ─── UPDATE MAINTENANCE TASK ────────────────────────────────

export const updateMaintenanceTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),
  type: maintenanceTypeEnum.optional(),
  priority: z
    .number()
    .int()
    .min(1, 'Priority must be at least 1')
    .max(5, 'Priority must not exceed 5')
    .optional(),
  scheduledDate: z.coerce.date().optional(),
  estimatedCost: z
    .number()
    .min(0, 'Estimated cost cannot be negative')
    .optional()
    .nullable(),
  actualCost: z
    .number()
    .min(0, 'Actual cost cannot be negative')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),
  findings: z
    .string()
    .max(5000, 'Findings must not exceed 5000 characters')
    .trim()
    .optional()
    .nullable(),
  partsUsed: z
    .string()
    .max(2000, 'Parts used must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),
  externalVendor: z
    .string()
    .max(255, 'External vendor must not exceed 255 characters')
    .trim()
    .optional()
    .nullable(),
});

// ─── ASSIGN TASK ────────────────────────────────────────────

export const assignTaskSchema = z.object({
  assignedToId: z.string().uuid('Invalid technician ID'),
});

// ─── TASK ID PARAM ──────────────────────────────────────────

export const taskIdParamSchema = z.object({
  id: z.string().uuid('Invalid maintenance task ID'),
});

// ─── MAINTENANCE TASK FILTER ────────────────────────────────

export const maintenanceTaskQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().max(200).optional(),
  sortBy: z
    .enum([
      'title',
      'status',
      'type',
      'priority',
      'scheduledDate',
      'createdAt',
      'updatedAt',
      'startedAt',
      'completedAt',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: maintenanceStatusEnum.optional(),
  type: maintenanceTypeEnum.optional(),
  assetId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
  requestedById: z.string().uuid().optional(),
  priority: z.coerce.number().int().min(1).max(5).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// ─── CREATE MAINTENANCE SCHEDULE ────────────────────────────

export const createMaintenanceScheduleSchema = z.object({
  assetId: z.string().uuid('Invalid asset ID'),
  name: z
    .string()
    .min(1, 'Schedule name is required')
    .max(255, 'Name must not exceed 255 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),
  type: maintenanceTypeEnum.default('PREVENTIVE'),
  intervalDays: z
    .number()
    .int()
    .min(1, 'Interval must be at least 1 day')
    .optional()
    .nullable(),
  nextRunDate: z.coerce.date().optional().nullable(),
});

// ─── UPDATE MAINTENANCE SCHEDULE ────────────────────────────

export const updateMaintenanceScheduleSchema = z.object({
  name: z
    .string()
    .min(1, 'Schedule name is required')
    .max(255, 'Name must not exceed 255 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional()
    .nullable(),
  type: maintenanceTypeEnum.optional(),
  intervalDays: z
    .number()
    .int()
    .min(1, 'Interval must be at least 1 day')
    .optional()
    .nullable(),
  nextRunDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
});

// ─── SCHEDULE ID PARAM ──────────────────────────────────────

export const scheduleIdParamSchema = z.object({
  id: z.string().uuid('Invalid maintenance schedule ID'),
});

// ─── SCHEDULE QUERY ─────────────────────────────────────────

export const maintenanceScheduleQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().max(200).optional(),
  sortBy: z
    .enum(['name', 'type', 'intervalDays', 'nextRunDate', 'isActive', 'createdAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  assetId: z.string().uuid().optional(),
  type: maintenanceTypeEnum.optional(),
  isActive: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

// ─── TYPES ──────────────────────────────────────────────────

export type CreateMaintenanceTaskInput = z.infer<typeof createMaintenanceTaskSchema>;
export type UpdateMaintenanceTaskInput = z.infer<typeof updateMaintenanceTaskSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
export type MaintenanceTaskQueryInput = z.infer<typeof maintenanceTaskQuerySchema>;
export type CreateMaintenanceScheduleInput = z.infer<typeof createMaintenanceScheduleSchema>;
export type UpdateMaintenanceScheduleInput = z.infer<typeof updateMaintenanceScheduleSchema>;
export type MaintenanceScheduleQueryInput = z.infer<typeof maintenanceScheduleQuerySchema>;
