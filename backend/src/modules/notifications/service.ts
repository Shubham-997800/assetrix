import prisma from "../../config/prisma";
import type { Prisma } from "@prisma/client";
import { HTTP_STATUS } from "../../constants";
import { AppError, paginatedMeta } from "../../utils/response";
import type { NotificationQueryInput } from "./validators";

export const getAll = async (userId: string, query: NotificationQueryInput) => {
  const { page, limit, type, isRead } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.NotificationWhereInput = { userId };

  if (type) {
    where.type = type;
  }

  if (isRead !== undefined) {
    where.isRead = isRead === "true";
  }

  const [items, totalItems] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    items,
    meta: paginatedMeta(totalItems, page, limit),
  };
};

export const getActivity = async (userId: string, limit = 50) => {
  const safeLimit = Math.min(limit, 100);

  const actor = await prisma.user.findUnique({
    where: { id: userId },
    select: { ownerId: true },
  });

  const ownerId = actor?.ownerId ?? userId;

  const items = await prisma.activityLog.findMany({
    where: { user: { ownerId } },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: safeLimit,
  });

  return items;
};

export const getUnreadCount = async (userId: string): Promise<number> => {  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

export const markAsRead = async (notificationId: string, userId: string): Promise<void> => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new AppError("Notification not found", HTTP_STATUS.NOT_FOUND);
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
    throw new AppError("Notification not found", HTTP_STATUS.NOT_FOUND);
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
