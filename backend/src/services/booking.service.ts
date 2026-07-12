import prisma from '../config/database';
import { HTTP_STATUS } from '../constants';
import { AppError } from '../middleware/error';
import { successResponse, paginatedMeta } from '../utils/response';
import { createAuditLog } from '../audit';
import { createNotification } from '../notifications';
import { NotificationType } from '@prisma/client';
import {
  CreateBookingInput,
  ApproveBookingInput,
  RejectBookingInput,
  CancelBookingInput,
  CompleteBookingInput,
  BookingQueryInput,
} from '../validators/booking.schema';

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

export const getAllBookings = async (query: BookingQueryInput) => {
  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    status,
    assetId,
    userId,
    startDateFrom,
    startDateTo,
    endDateFrom,
    endDateTo,
  } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { deletedAt: null };

  if (status) where.status = status;
  if (assetId) where.assetId = assetId;
  if (userId) where.userId = userId;

  if (startDateFrom || startDateTo) {
    where.startDate = {
      ...(startDateFrom && { gte: startDateFrom }),
      ...(startDateTo && { lte: startDateTo }),
    };
  }

  if (endDateFrom || endDateTo) {
    where.endDate = {
      ...(endDateFrom && { gte: endDateFrom }),
      ...(endDateTo && { lte: endDateTo }),
    };
  }

  if (search) {
    where.OR = [
      { asset: { name: { contains: search, mode: 'insensitive' } } },
      { asset: { assetTag: { contains: search, mode: 'insensitive' } } },
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
      { purpose: { contains: search, mode: 'insensitive' } },
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

  return successResponse('Bookings retrieved successfully', bookings, paginatedMeta(totalItems, page, limit));
};

export const getBookingById = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: includeRelations,
  });

  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  return successResponse('Booking retrieved successfully', booking);
};

export const createBooking = async (
  data: CreateBookingInput,
  userId: string,
  ip?: string,
  userAgent?: string
) => {
  const asset = await prisma.asset.findUnique({ where: { id: data.assetId } });
  if (!asset) {
    throw new AppError('Asset not found', HTTP_STATUS.NOT_FOUND);
  }

  if (!asset.isActive) {
    throw new AppError('Asset is not active and cannot be booked', HTTP_STATUS.BAD_REQUEST);
  }

  if (asset.status === 'RETIRED' || asset.status === 'LOST' || asset.status === 'STOLEN') {
    throw new AppError(`Asset is currently ${asset.status.toLowerCase()} and cannot be booked`, HTTP_STATUS.BAD_REQUEST);
  }

  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      assetId: data.assetId,
      deletedAt: null,
      status: { in: ['PENDING', 'APPROVED'] },
      startDate: { lt: data.endDate },
      endDate: { gt: data.startDate },
    },
  });

  if (overlappingBooking) {
    throw new AppError(
      'Asset is already booked for the selected dates. Please choose different dates.',
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
      status: 'PENDING',
      createdBy: userId,
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'Booking',
    entityId: booking.id,
    newValues: { assetId: data.assetId, startDate: data.startDate, endDate: data.endDate, status: 'PENDING' },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Booking created successfully', booking, undefined);
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
    include: { asset: { select: { id: true, name: true, assetTag: true } }, user: { select: { id: true, firstName: true, lastName: true } } },
  });

  if (!existing) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status !== 'PENDING') {
    throw new AppError(`Booking cannot be approved. Current status: ${existing.status}`, HTTP_STATUS.BAD_REQUEST);
  }

  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      id: { not: id },
      assetId: existing.assetId,
      deletedAt: null,
      status: 'APPROVED',
      startDate: { lt: existing.endDate },
      endDate: { gt: existing.startDate },
    },
  });

  if (overlappingBooking) {
    throw new AppError(
      'Another approved booking already exists for this asset during the selected dates',
      HTTP_STATUS.CONFLICT
    );
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: 'APPROVED',
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
    action: 'UPDATE',
    entity: 'Booking',
    entityId: id,
    oldValues: { status: existing.status },
    newValues: { status: 'APPROVED' },
    ipAddress: ip,
    userAgent,
  });

  await createNotification({
    userId: existing.userId,
    type: NotificationType.BOOKING_APPROVED,
    title: 'Booking Approved',
    message: `Your booking for asset "${existing.asset.name}" (${existing.asset.assetTag}) has been approved`,
    link: `/bookings/${id}`,
  });

  return successResponse('Booking approved successfully', booking);
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
    include: { asset: { select: { id: true, name: true, assetTag: true } }, user: { select: { id: true, firstName: true, lastName: true } } },
  });

  if (!existing) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status !== 'PENDING') {
    throw new AppError(`Booking cannot be rejected. Current status: ${existing.status}`, HTTP_STATUS.BAD_REQUEST);
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: 'REJECTED',
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
    action: 'UPDATE',
    entity: 'Booking',
    entityId: id,
    oldValues: { status: existing.status },
    newValues: { status: 'REJECTED', rejectionReason: data.rejectionReason },
    ipAddress: ip,
    userAgent,
  });

  await createNotification({
    userId: existing.userId,
    type: NotificationType.BOOKING_REJECTED,
    title: 'Booking Rejected',
    message: `Your booking for asset "${existing.asset.name}" (${existing.asset.assetTag}) has been rejected. Reason: ${data.rejectionReason}`,
    link: `/bookings/${id}`,
  });

  return successResponse('Booking rejected successfully', booking);
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
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existing.userId !== userId) {
    throw new AppError('You can only cancel your own bookings', HTTP_STATUS.FORBIDDEN);
  }

  if (existing.status !== 'PENDING' && existing.status !== 'APPROVED') {
    throw new AppError(`Booking cannot be cancelled. Current status: ${existing.status}`, HTTP_STATUS.BAD_REQUEST);
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      notes: data.notes || existing.notes,
      updatedBy: userId,
      version: { increment: 1 },
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'Booking',
    entityId: id,
    oldValues: { status: existing.status },
    newValues: { status: 'CANCELLED' },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Booking cancelled successfully', booking);
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
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  if (existing.status !== 'APPROVED') {
    throw new AppError(`Booking cannot be completed. Current status: ${existing.status}`, HTTP_STATUS.BAD_REQUEST);
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      notes: data.notes || existing.notes,
      updatedBy: userId,
      version: { increment: 1 },
    },
    include: includeRelations,
  });

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'Booking',
    entityId: id,
    oldValues: { status: existing.status },
    newValues: { status: 'COMPLETED' },
    ipAddress: ip,
    userAgent,
  });

  return successResponse('Booking completed successfully', booking);
};

export const getUpcomingBookings = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const now = new Date();

  const where: Record<string, unknown> = {
    deletedAt: null,
    status: { in: ['PENDING', 'APPROVED'] },
    startDate: { gte: now },
  };

  const [bookings, totalItems] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: includeRelations,
      orderBy: { startDate: 'asc' },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return successResponse('Upcoming bookings retrieved successfully', bookings, paginatedMeta(totalItems, page, limit));
};
