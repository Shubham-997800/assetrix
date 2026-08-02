import prisma from "../../config/prisma";
import type { UpdatePreferenceInput } from "./validators";

const DEFAULT_PREFERENCES = {
  emailEnabled: true,
  pushEnabled: true,
  securityAlerts: true,
  productUpdates: false,
  weeklyDigest: true,
  maintenanceAlerts: true,
  bookingAlerts: true,
  allocationAlerts: true,
  auditAlerts: true,
  emailAssetAssigned: true,
  emailAssetReturned: true,
  emailBookingApproved: true,
  emailBookingRejected: true,
  emailMaintenanceAssigned: true,
  emailMaintenanceCompleted: true,
  emailMaintenanceOverdue: true,
  emailWarrantyExpiry: true,
  emailSystemAlerts: true,
  emailPasswordChanged: true,
};

export const getPreferences = async (userId: string) => {
  const existing = await prisma.notificationPreference.findUnique({ where: { userId } });

  if (!existing) {
    return prisma.notificationPreference.create({
      data: { ...DEFAULT_PREFERENCES, userId },
    });
  }

  return existing;
};

export const updatePreferences = async (userId: string, data: UpdatePreferenceInput) => {
  const existing = await prisma.notificationPreference.findUnique({ where: { userId } });

  if (!existing) {
    return prisma.notificationPreference.create({
      data: { ...DEFAULT_PREFERENCES, userId, ...data },
    });
  }

  return prisma.notificationPreference.update({
    where: { userId },
    data,
  });
};

export const getPreferenceByKey = async (userId: string, key: string) => {
  const prefs = await getPreferences(userId);
  return (prefs as unknown as Record<string, unknown>)[key] ?? false;
};
