import { z } from "zod";

export const auditQuerySchema = z.object({
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
  sortBy: z.enum(["createdAt", "action", "entity", "entityId"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  entity: z.string().max(100).optional(),
  entityId: z.string().max(100).optional(),
  userId: z.string().uuid("Invalid user ID").optional(),
  action: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const entityParamsSchema = z.object({
  entity: z.string().min(1, "Entity is required").max(100),
  entityId: z.string().min(1, "Entity ID is required").max(100),
});

export const userParamsSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export const recentActivityQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .default("50")
    .transform(Number)
    .pipe(z.number().int().min(1, "Limit must be at least 1").max(100, "Limit must not exceed 100")),
});

export const exportAuditLogsSchema = z.object({
  format: z.enum(["csv", "json", "xlsx"]).optional().default("csv"),
  entity: z.string().max(100).optional(),
  entityId: z.string().max(100).optional(),
  userId: z.string().uuid("Invalid user ID").optional(),
  action: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type AuditQueryInput = z.infer<typeof auditQuerySchema>;
export type EntityParamsInput = z.infer<typeof entityParamsSchema>;
export type UserParamsInput = z.infer<typeof userParamsSchema>;
export type RecentActivityQueryInput = z.infer<typeof recentActivityQuerySchema>;
export type ExportAuditLogsInput = z.infer<typeof exportAuditLogsSchema>;
