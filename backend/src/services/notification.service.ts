import prisma from '../config/database';
import { NotificationType } from '@prisma/client';
import { AppError } from '../middleware/error';
import { HTTP_STATUS, PAGINATION_DEFAULTS } from '../constants';

interface NotificationFilters {
  type?: NotificationType;
  isRead?: string;
  page?: string;
  limit?: string;
}

export const getAll = async (userId: string, filters: NotificationFilters) => {
  const page = parseInt(filters.page || String(PAGINATION_DEFAULTS.PAGE), 10);
  const limit = Math.min(
    parseInt(filters.limit || String(PAGINATION_DEFAULTS.LIMIT), 10),
    PAGINATION_DEFAULTS.MAX_LIMIT,
  );
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { userId };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.isRead !== undefined) {
    where.isRead = filters.isRead === 'true';
  }

  const [items, totalItems] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    hasNextPage: page * limit < totalItems,
    hasPreviousPage: page > 1,
  };
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

export const markAsRead = async (notificationId: string, userId: string): Promise<void> => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new AppError('Notification not found', HTTP_STATUS.NOT_FOUND);
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true, readAt: new Date() },
  });
};

export const markAllAsRead = async (userId: string): Promise<number> => {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  return result.count;
};

export const deleteNotification = async (notificationId: string, userId: string): Promise<void> => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new AppError('Notification not found', HTTP_STATUS.NOT_FOUND);
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });
};

export const deleteAllRead = async (userId: string): Promise<number> => {
  const result = await prisma.notification.deleteMany({
    where: { userId, isRead: true },
  });

  return result.count;
};
