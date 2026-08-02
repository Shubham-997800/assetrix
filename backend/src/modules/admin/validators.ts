import { z } from "zod";

export const updateSystemSettingSchema = z.object({
  key: z.string().trim().min(1, "Setting key is required").max(100),
  value: z.unknown().refine((v) => v !== undefined, { message: "Setting value is required" }),
  description: z.string().trim().max(500).optional(),
});

export const forceLogoutParamsSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});
