import cron from "node-cron";
import logger from "../config/logger";
import prisma from "../config/prisma";
import { createNotification } from "../modules/shared/notifications";

async function markOverdueAllocations(): Promise<void> {
  const now = new Date();
  const result = await prisma.allocation.updateMany({
    where: {
      status: "ACTIVE",
      expectedReturn: { lt: now },
      returnedAt: null,
    },
    data: { status: "OVERDUE" },
  });
  if (result.count > 0) {
    logger.info({ count: result.count }, "Marked overdue allocations");
  }
}

async function markOverdueMaintenance(): Promise<void> {
  const now = new Date();
  const result = await prisma.maintenanceTask.updateMany({
    where: {
      status: "SCHEDULED",
      scheduledDate: { lt: now },
      deletedAt: null,
    },
    data: { status: "OVERDUE" },
  });
  if (result.count > 0) {
    logger.info({ count: result.count }, "Marked overdue maintenance tasks");
  }
}

async function checkWarrantyExpiries(): Promise<void> {
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const assets = await prisma.asset.findMany({
    where: {
      deletedAt: null,
      warrantyExpiry: { gte: now, lte: thirtyDays },
      status: { not: "RETIRED" },
    },
    select: {
      id: true,
      name: true,
      assetTag: true,
      warrantyExpiry: true,
      allocations: {
        where: { status: { in: ["ACTIVE", "OVERDUE"] } },
        select: { userId: true },
      },
    },
  });

  for (const asset of assets) {
    const expiryDate = asset.warrantyExpiry;
    if (!expiryDate) continue;
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    const title = `Warranty expiring soon`;
    const message = `${asset.name} (${asset.assetTag}) warranty expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`;

    const recipients = new Set<string>();
    for (const allocation of asset.allocations) {
      if (allocation.userId) recipients.add(allocation.userId);
    }
    const admins = await prisma.user.findMany({
      where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, status: "ACTIVE", deletedAt: null },
      select: { id: true },
    });
    for (const admin of admins) recipients.add(admin.id);

    for (const userId of recipients) {
      await createNotification({
        userId,
        type: "WARRANTY_EXPIRY",
        title,
        message,
        link: `/assets/${asset.id}`,
      });
    }
  }
}

export function startJobs(): void {
  cron.schedule("0 * * * *", () => {
    void markOverdueAllocations();
    void markOverdueMaintenance();
  });

  cron.schedule("0 6 * * *", () => {
    void checkWarrantyExpiries();
  });

  logger.info("Cron jobs scheduled");
}
