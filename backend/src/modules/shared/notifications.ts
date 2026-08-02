import prisma from "../../config/prisma";
import { NOTIFICATION_CHANNEL } from "../../constants";

interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  message: string;
  channel?: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(data: CreateNotificationInput): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as never,
        title: data.title,
        message: data.message,
        channel: (data.channel as never) || NOTIFICATION_CHANNEL.IN_APP,
        link: data.link,
        metadata: (data.metadata as object) || undefined,
      },
    });
  } catch {
    // notification creation must never break the main flow
  }
}

export async function createNotifications(inputs: CreateNotificationInput[]): Promise<void> {
  try {
    if (inputs.length === 0) return;
    await prisma.notification.createMany({
      data: inputs.map((n) => ({
        userId: n.userId,
        type: n.type as never,
        title: n.title,
        message: n.message,
        channel: (n.channel as never) || NOTIFICATION_CHANNEL.IN_APP,
        link: n.link,
        metadata: (n.metadata as object) || undefined,
      })),
    });
  } catch {
    // ignore
  }
}
