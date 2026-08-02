import { Prisma } from "@prisma/client";
import type { BookingStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError, paginatedMeta } from "../../utils/response";
import { BOOKING_STATUS, HTTP_STATUS, NOTIFICATION_TYPE } from "../../constants";
import { createAuditLog } from "../shared/audit";
import { createNotification } from "../shared/notifications";
import { getPagination } from "../shared/pagination";
import type { PaginationQuery } from "../../types";
import type {
  ApproveBookingInput,
  CancelBookingInput,
  CompleteBookingInput,
  CreateBookingInput,
  RejectBookingInput,
  UpdateBookingInput,
} from "./validators";

export interface GetAllBookingsParams extends PaginationQuery {
  status?: string;
  assetId?: string;
  userId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
}

export interface GetUpcomingBookingsParams extends PaginationQuery {}

const includeRelations = {
  asset: {
    select: {
      id: true,
      assetTag: true,
      name: true,
      status: true,
      condition: true,
      location: true,
    },
  },
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      employeeId: true,
    },
  },
  approvedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
};

export const getAll = async (params: GetAllBookingsParams) => {
  const { page, limit, skip, sortBy, sortOrder } = getPagination(params);

  const where: Prisma.BookingWhereInput = { deletedAt: null };

  if (params.status) where.status = params.status as BookingStatus;
  if (params.assetId) where.assetId = params.assetId;
  if (params.userId) where.userId = params.userId;

  if (params.startDateFrom || params.startDateTo) {
    where.startDate = {
      ...(params.startDateFrom && { gte: params.startDateFrom }),
      ...(params.startDateTo && { lte: params.startDateTo }),
    };
  }

  if (params.endDateFrom || params.endDateTo) {
    where.endDate = {
      ...(params.endDateFrom && { gte: params.endDateFrom }),
      ...(params.endDateTo && { lte: params.endDateTo }),
    };
  }

  if (params.search) {
    where.OR = [
      { asset: { name: { contains: params.search, mode: "insensitive" } } },
      { asset: { assetTag: { contains: params.search, mode: "insensitive" } } },
      { user: { firstName: { contains: params.search, mode: "insensitive" } } },
      { user: { lastName: { contains: params.search, mode: "insensitive" } } },
      { purpose: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [bookings, totalItems] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: includeRelations,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, meta: paginatedMeta(totalItems, page, limit) };
};

export const getById = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: includeRelations,
  });

  if (!booking) {
    throw new AppError("Booking not found", HTTP_STATUS.NOT_FOUND);
  }

  return booking;
};

export const create = async (
  data: CreateBookingInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const asset = await prisma.asset.findUnique({ where: { id: data.assetId } });
  if (!asset) {
    throw new AppError("Asset not found", HTTP_STATUS.NOT_FOUND);
  }

  if (!asset.isActive) {
    throw new AppError("Asset is not active and cannot be booked", HTTP_STATUS.BAD_REQUEST);
  }

  if (asset.status === "RETIRED" || asset.status === "LOST" || asset.status === "STOLEN") {
    throw new AppError(
      `Asset is currently ${asset.status.toLowerCase()} and cannot be booked`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      assetId: data.assetId,
      deletedAt: null,
      status: { in: ["PENDING", "APPROVED"] },
      startDate: { lt: data.endDate },
      endDate: { gt: data.startDate },
    },
  });

  if (overlappingBooking) {
    throw new AppError(
      "Asset is already booked for the selected dates. Please choose different dates.",
      HTTP_STATUS.CONFLICT
    );
  }

  const booking = await prisma.booking.create({
    data: {
      assetId: data.assetId,
      userId,
      purpose: data.purpose,
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes,
      status: BOOKING_STATUS.PENDING,
      createdBy: userId,
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: "CREATE",
    entity: "Booking",
    entityId: booking.id,
    newValues: {
      assetId: data.assetId,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PENDING",
    },
    ipAddress: ip,
    userAgent,
  });

  return booking;
};

export const approveBooking = async (
  id: string,
  data: ApproveBookingInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.booking.findUnique({
    where: { id },
    include: {
      asset: { select: { id: true, name: true, assetTag: true } },
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!existing) {
    throw new AppError("Booking not found", HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status !== "PENDING") {
    throw new AppError(
      `Booking cannot be approved. Current status: ${existing.status}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      id: { not: id },
      assetId: existing.assetId,
      deletedAt: null,
      status: "APPROVED",
      startDate: { lt: existing.endDate },
      endDate: { gt: existing.startDate },
    },
  });

  if (overlappingBooking) {
    throw new AppError(
      "Another approved booking already exists for this asset during the selected dates",
      HTTP_STATUS.CONFLICT
    );
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: BOOKING_STATUS.APPROVED,
      approvedById: userId,
      approvedAt: new Date(),
      notes: data.notes || existing.notes,
      updatedBy: userId,
      version: { increment: 1 },
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: "UPDATE",
    entity: "Booking",
    entityId: id,
    oldValues: { status: existing.status },
    newValues: { status: "APPROVED" },
    ipAddress: ip,
    userAgent,
  });

  await createNotification({
    userId: existing.userId,
    type: NOTIFICATION_TYPE.BOOKING_APPROVED,
    title: "Booking Approved",
    message: `Your booking for asset "${existing.asset.name}" (${existing.asset.assetTag}) has been approved`,
    link: `/bookings/${id}`,
  });

  return booking;
};

export const rejectBooking = async (
  id: string,
  data: RejectBookingInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.booking.findUnique({
    where: { id },
    include: {
      asset: { select: { id: true, name: true, assetTag: true } },
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!existing) {
    throw new AppError("Booking not found", HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status !== "PENDING") {
    throw new AppError(
      `Booking cannot be rejected. Current status: ${existing.status}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: BOOKING_STATUS.REJECTED,
      rejectionReason: data.rejectionReason,
      approvedById: userId,
      approvedAt: new Date(),
      updatedBy: userId,
      version: { increment: 1 },
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: "UPDATE",
    entity: "Booking",
    entityId: id,
    oldValues: { status: existing.status },
    newValues: { status: "REJECTED", rejectionReason: data.rejectionReason },
    ipAddress: ip,
    userAgent,
  });

  await createNotification({
    userId: existing.userId,
    type: NOTIFICATION_TYPE.BOOKING_REJECTED,
    title: "Booking Rejected",
    message: `Your booking for asset "${existing.asset.name}" (${existing.asset.assetTag}) has been rejected. Reason: ${data.rejectionReason}`,
    link: `/bookings/${id}`,
  });

  return booking;
};

export const cancelBooking = async (
  id: string,
  data: CancelBookingInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.booking.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError("Booking not found", HTTP_STATUS.NOT_FOUND);
  }

  if (existing.userId !== userId) {
    throw new AppError("You can only cancel your own bookings", HTTP_STATUS.FORBIDDEN);
  }

  if (existing.status !== "PENDING" && existing.status !== "APPROVED") {
    throw new AppError(
      `Booking cannot be cancelled. Current status: ${existing.status}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: BOOKING_STATUS.CANCELLED,
      notes: data.notes || existing.notes,
      updatedBy: userId,
      version: { increment: 1 },
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: "UPDATE",
    entity: "Booking",
    entityId: id,
    oldValues: { status: existing.status },
    newValues: { status: "CANCELLED" },
    ipAddress: ip,
    userAgent,
  });

  return booking;
};

export const completeBooking = async (
  id: string,
  data: CompleteBookingInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.booking.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError("Booking not found", HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status !== "APPROVED") {
    throw new AppError(
      `Booking cannot be completed. Current status: ${existing.status}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: BOOKING_STATUS.COMPLETED,
      notes: data.notes || existing.notes,
      updatedBy: userId,
      version: { increment: 1 },
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: "UPDATE",
    entity: "Booking",
    entityId: id,
    oldValues: { status: existing.status },
    newValues: { status: "COMPLETED" },
    ipAddress: ip,
    userAgent,
  });

  return booking;
};

export const updateBooking = async (
  id: string,
  data: UpdateBookingInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const existing = await prisma.booking.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError("Booking not found", HTTP_STATUS.NOT_FOUND);
  }

  if (existing.userId !== userId) {
    throw new AppError("You can only update your own bookings", HTTP_STATUS.FORBIDDEN);
  }

  if (existing.status !== "PENDING") {
    throw new AppError("Only pending bookings can be updated", HTTP_STATUS.BAD_REQUEST);
  }

  const startDate = data.startDate || existing.startDate;
  const endDate = data.endDate || existing.endDate;

  if (endDate <= startDate) {
    throw new AppError("End date must be after start date", HTTP_STATUS.BAD_REQUEST);
  }

  if (data.startDate || data.endDate) {
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        id: { not: id },
        assetId: existing.assetId,
        deletedAt: null,
        status: { in: ["PENDING", "APPROVED"] },
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
    });

    if (overlappingBooking) {
      throw new AppError("Asset is already booked for the selected dates", HTTP_STATUS.CONFLICT);
    }
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      purpose: data.purpose || existing.purpose,
      startDate,
      endDate,
      notes: data.notes !== undefined ? data.notes : existing.notes,
      updatedBy: userId,
      version: { increment: 1 },
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: "UPDATE",
    entity: "Booking",
    entityId: id,
    oldValues: {
      purpose: existing.purpose,
      startDate: existing.startDate,
      endDate: existing.endDate,
    },
    newValues: { purpose: booking.purpose, startDate: booking.startDate, endDate: booking.endDate },
    ipAddress: ip,
    userAgent,
  });

  return booking;
};

export const getUpcomingBookings = async (params: GetUpcomingBookingsParams = {}) => {
  const { page, limit, skip } = getPagination(params);
  const now = new Date();

  const where: Prisma.BookingWhereInput = {
    deletedAt: null,
    status: { in: ["PENDING", "APPROVED"] },
    startDate: { gte: now },
  };

  const [bookings, totalItems] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: includeRelations,
      orderBy: { startDate: "asc" },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, meta: paginatedMeta(totalItems, page, limit) };
};
