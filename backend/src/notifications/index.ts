import prisma from '../config/database';
import { NotificationType, NotificationChannel } from '@prisma/client';
import { notificationQueue } from '../queues';
import { generateId } from '../utils';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  channel?: NotificationChannel;
  link?: string;
  metadata?: Record<string, unknown>;
}

export const createNotification = async (params: CreateNotificationParams): Promise<void> => {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        channel: params.channel || NotificationChannel.IN_APP,
        link: params.link,
        metadata: (params.metadata || {}) as any,
      },
    });

    await notificationQueue.add('send-notification', {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      channel: params.channel || NotificationChannel.IN_APP,
      link: params.link,
    });
  } catch (error) {
    // Notification failures should never block the main flow
  }
};

export const createBulkNotifications = async (
  userIds: string[],
  type: NotificationType,
  title: string,
  message: string,
  link?: string
): Promise<void> => {
  try {
    const notifications = userIds.map((userId) => ({
      userId,
      type,
      title,
      message,
      channel: NotificationChannel.IN_APP,
      link,
    }));

    await prisma.notification.createMany({ data: notifications });
  } catch (error) {
    // Silent fail for bulk notifications
  }
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

export const markAsRead = async (notificationId: string, userId: string): Promise<void> => {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true, readAt: new Date() },
  });
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
};
