import { z } from "zod";

export const assetIdParamSchema = z.object({
  assetId: z.string().uuid("Invalid asset ID"),
});

export const recommendationIdParamSchema = z.object({
  id: z.string().uuid("Invalid recommendation ID"),
});

export const actionedBodySchema = z.object({
  actionTaken: z.string().min(1, "Action description is required").max(500),
});

export const recommendationStatsQuerySchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
});

export const predictiveMaintenanceQuerySchema = z.object({
  assetId: z.string().uuid("Invalid asset ID").optional(),
});
