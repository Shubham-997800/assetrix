import prisma from "../../config/prisma";

interface ActivityLogData {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createActivityLog(data: ActivityLogData): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        description: data.description,
        metadata: (data.metadata as object) || undefined,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  } catch {
    // logging must never break the main flow
  }
}
