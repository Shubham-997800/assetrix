import { z } from "zod";
import {
  AUDIT_CYCLE_STATUS,
  AUDIT_RESULT,
  DISCREPANCY_SEVERITY,
  DISCREPANCY_STATUS,
} from "../../constants";

const cycleStatusEnum = z.enum([
  AUDIT_CYCLE_STATUS.DRAFT,
  AUDIT_CYCLE_STATUS.IN_PROGRESS,
  AUDIT_CYCLE_STATUS.REVIEW,
  AUDIT_CYCLE_STATUS.COMPLETED,
  AUDIT_CYCLE_STATUS.CANCELLED,
]);

const auditResultEnum = z.enum([
  AUDIT_RESULT.VERIFIED,
  AUDIT_RESULT.MISSING,
  AUDIT_RESULT.DAMAGED,
  AUDIT_RESULT.DISCREPANCY,
]);

const discrepancySeverityEnum = z.enum([
  DISCREPANCY_SEVERITY.LOW,
  DISCREPANCY_SEVERITY.MEDIUM,
  DISCREPANCY_SEVERITY.HIGH,
  DISCREPANCY_SEVERITY.CRITICAL,
]);

const discrepancyResolutionStatusEnum = z.enum([
  DISCREPANCY_STATUS.RESOLVED,
  DISCREPANCY_STATUS.DISMISSED,
]);

export const createAuditCycleSchema = z
  .object({
    name: z.string().min(1, "Cycle name is required").max(200).trim(),
    description: z.string().max(500).trim().optional().nullable(),
    departmentScope: z.string().max(200).trim().optional().nullable(),
    locationScope: z.string().max(200).trim().optional().nullable(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    assetIds: z
      .array(z.string().uuid("Invalid asset ID"))
      .min(1, "At least one asset must be selected")
      .optional(),
    auditorIds: z
      .array(z.string().uuid("Invalid auditor ID"))
      .min(1, "At least one auditor must be assigned")
      .optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
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
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().int().min(1, "Page must be at least 1")),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform(Number)
    .pipe(z.number().int().min(1, "Limit must be at least 1").max(100, "Limit must not exceed 100")),
  search: z.string().max(200).optional(),
  sortBy: z.enum(["name", "startDate", "endDate", "status", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  status: cycleStatusEnum.optional(),
});

export const auditCycleParamsSchema = z.object({
  id: z.string().uuid("Invalid audit cycle ID"),
});

export const assignAuditorsSchema = z.object({
  auditorIds: z.array(z.string().uuid("Invalid auditor ID")).min(1, "At least one auditor must be selected"),
});

export const verifyAssetSchema = z.object({
  assetId: z.string().uuid("Invalid asset ID"),
  result: auditResultEnum,
  currentLocation: z.string().max(200).optional(),
  recordedHolder: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
});

export const createDiscrepancySchema = z.object({
  assetId: z.string().uuid("Invalid asset ID"),
  type: z.string().min(1, "Discrepancy type is required").max(100),
  severity: discrepancySeverityEnum.default("MEDIUM"),
  description: z.string().min(1, "Description is required").max(1000),
});

export const resolveDiscrepancyParamsSchema = z.object({
  discrepancyId: z.string().uuid("Invalid discrepancy ID"),
});

export const resolveDiscrepancySchema = z.object({
  status: discrepancyResolutionStatusEnum,
  resolutionNotes: z.string().max(500).optional(),
});

export type CreateAuditCycleInput = z.infer<typeof createAuditCycleSchema>;
export type UpdateAuditCycleInput = z.infer<typeof updateAuditCycleSchema>;
export type AuditCycleQueryInput = z.infer<typeof auditCycleQuerySchema>;
export type AuditCycleParamsInput = z.infer<typeof auditCycleParamsSchema>;
export type AssignAuditorsInput = z.infer<typeof assignAuditorsSchema>;
export type VerifyAssetInput = z.infer<typeof verifyAssetSchema>;
export type CreateDiscrepancyInput = z.infer<typeof createDiscrepancySchema>;
export type ResolveDiscrepancyParamsInput = z.infer<typeof resolveDiscrepancyParamsSchema>;
export type ResolveDiscrepancyInput = z.infer<typeof resolveDiscrepancySchema>;
