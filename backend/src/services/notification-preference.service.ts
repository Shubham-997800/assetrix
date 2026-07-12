import prisma from '../config/database';
import { AppError } from '../middleware/error';
import { HTTP_STATUS } from '../constants';

export const getPreferences = async (userId: string) => {
  const existing = await prisma.notificationPreference.findUnique({ where: { userId } });

  if (!existing) {
    const defaults = await prisma.notificationPreference.create({
      data: {
        userId,
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
        pushEnabled: true,
        emailEnabled: true,
      },
    });
    return defaults;
  }

  return existing;
};

export const updatePreferences = async (
  userId: string,
  data: Record<string, unknown>
) => {
  const existing = await prisma.notificationPreference.findUnique({ where: { userId } });

  if (!existing) {
    const created = await prisma.notificationPreference.create({
      data: { userId, ...data } as any,
    });
    return created;
  }

  const updated = await prisma.notificationPreference.update({
    where: { userId },
    data,
  });

  return updated;
};

export const getPreferenceByKey = async (userId: string, key: string) => {
  const prefs = await getPreferences(userId);
  return (prefs as Record<string, unknown>)[key] ?? false;
};
