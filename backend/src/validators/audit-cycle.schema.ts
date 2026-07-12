import { z } from 'zod';

export const createAuditCycleSchema = z.object({
  name: z.string().min(1, 'Cycle name is required').max(200).trim(),
  description: z.string().max(500).trim().optional().nullable(),
  departmentScope: z.string().max(200).trim().optional().nullable(),
  locationScope: z.string().max(200).trim().optional().nullable(),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  assetIds: z.array(z.string().uuid()).min(1, 'At least one asset must be selected').optional(),
  auditorIds: z.array(z.string().uuid()).min(1, 'At least one auditor must be assigned').optional(),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const updateAuditCycleSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(500).trim().optional().nullable(),
  departmentScope: z.string().max(200).trim().optional().nullable(),
  locationScope: z.string().max(200).trim().optional().nullable(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const auditCycleQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().min(1)),
  limit: z.string().optional().default('20').transform(Number).pipe(z.number().int().min(1).max(100)),
  search: z.string().max(200).optional(),
  sortBy: z.enum(['name', 'startDate', 'endDate', 'status', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED']).optional(),
});

export const auditCycleParamsSchema = z.object({
  id: z.string().uuid('Invalid audit cycle ID'),
});

export const assignAuditorsSchema = z.object({
  auditorIds: z.array(z.string().uuid()).min(1, 'At least one auditor must be selected'),
});

export const verifyAssetSchema = z.object({
  assetId: z.string().uuid('Invalid asset ID'),
  result: z.enum(['VERIFIED', 'MISSING', 'DAMAGED', 'DISCREPANCY']),
  currentLocation: z.string().max(200).optional(),
  recordedHolder: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
});

export const createDiscrepancySchema = z.object({
  assetId: z.string().uuid('Invalid asset ID'),
  type: z.string().min(1, 'Discrepancy type is required').max(100),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  description: z.string().min(1, 'Description is required').max(1000),
});

export const resolveDiscrepancySchema = z.object({
  status: z.enum(['RESOLVED', 'DISMISSED']),
  resolutionNotes: z.string().max(500).optional(),
});

export type CreateAuditCycleInput = z.infer<typeof createAuditCycleSchema>;
export type UpdateAuditCycleInput = z.infer<typeof updateAuditCycleSchema>;
export type AuditCycleQueryInput = z.infer<typeof auditCycleQuerySchema>;
export type AssignAuditorsInput = z.infer<typeof assignAuditorsSchema>;
export type VerifyAssetInput = z.infer<typeof verifyAssetSchema>;
export type CreateDiscrepancyInput = z.infer<typeof createDiscrepancySchema>;
export type ResolveDiscrepancyInput = z.infer<typeof resolveDiscrepancySchema>;
