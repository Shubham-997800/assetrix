import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { AppError, successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as bookingService from "./service";

function getAuthUser(req: AuthenticatedRequest) {
  if (!req.user) {
    throw new AppError("Authentication required", HTTP_STATUS.UNAUTHORIZED);
  }
  return req.user;
}

export const getAllBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { bookings, meta } = await bookingService.getAll(
    req.query as unknown as bookingService.GetAllBookingsParams
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Bookings retrieved successfully", bookings, meta));
});

export const getBookingById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const booking = await bookingService.getById(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(successResponse("Booking retrieved successfully", booking));
});

export const getUpcomingBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { bookings, meta } = await bookingService.getUpcomingBookings(
    req.query as unknown as bookingService.GetUpcomingBookingsParams
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Upcoming bookings retrieved successfully", bookings, meta));
});

export const createBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const booking = await bookingService.create(
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.CREATED).json(successResponse("Booking created successfully", booking));
});

export const approveBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const booking = await bookingService.approveBooking(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Booking approved successfully", booking));
});

export const rejectBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const booking = await bookingService.rejectBooking(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Booking rejected successfully", booking));
});

export const cancelBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const booking = await bookingService.cancelBooking(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Booking cancelled successfully", booking));
});

export const completeBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const booking = await bookingService.completeBooking(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Booking completed successfully", booking));
});

export const updateBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const booking = await bookingService.updateBooking(
    req.params.id as string,
    req.body,
    getAuthUser(req).userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Booking updated successfully", booking));
});
