import { z } from "zod";
import { NOTIFICATION_TYPE } from "../../constants";

const notificationTypeEnum = z.enum([
  NOTIFICATION_TYPE.USER_REGISTRATION,
  NOTIFICATION_TYPE.EMAIL_VERIFICATION,
  NOTIFICATION_TYPE.ASSET_ASSIGNED,
  NOTIFICATION_TYPE.ASSET_RETURNED,
  NOTIFICATION_TYPE.BOOKING_APPROVED,
  NOTIFICATION_TYPE.BOOKING_REJECTED,
  NOTIFICATION_TYPE.REQUEST_APPROVED,
  NOTIFICATION_TYPE.REQUEST_REJECTED,
  NOTIFICATION_TYPE.MAINTENANCE_ASSIGNED,
  NOTIFICATION_TYPE.MAINTENANCE_COMPLETED,
  NOTIFICATION_TYPE.WARRANTY_EXPIRY,
  NOTIFICATION_TYPE.PASSWORD_CHANGED,
  NOTIFICATION_TYPE.SYSTEM_ALERT,
]);

export const notificationQuerySchema = z.object({
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
  type: notificationTypeEnum.optional(),
  isRead: z.enum(["true", "false"]).optional(),
});

export const notificationIdParamSchema = z.object({
  id: z.string().uuid("Invalid notification ID"),
});

export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
export type NotificationIdParamInput = z.infer<typeof notificationIdParamSchema>;
