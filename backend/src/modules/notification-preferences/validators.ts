import { z } from "zod";

export const updatePreferenceSchema = z.object({
  emailEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  productUpdates: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  maintenanceAlerts: z.boolean().optional(),
  bookingAlerts: z.boolean().optional(),
  allocationAlerts: z.boolean().optional(),
  auditAlerts: z.boolean().optional(),
  emailAssetAssigned: z.boolean().optional(),
  emailAssetReturned: z.boolean().optional(),
  emailBookingApproved: z.boolean().optional(),
  emailBookingRejected: z.boolean().optional(),
  emailMaintenanceAssigned: z.boolean().optional(),
  emailMaintenanceCompleted: z.boolean().optional(),
  emailMaintenanceOverdue: z.boolean().optional(),
  emailWarrantyExpiry: z.boolean().optional(),
  emailSystemAlerts: z.boolean().optional(),
  emailPasswordChanged: z.boolean().optional(),
});

export type UpdatePreferenceInput = z.infer<typeof updatePreferenceSchema>;
