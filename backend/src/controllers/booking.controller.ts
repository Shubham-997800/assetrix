import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as bookingService from '../services/booking.service';
import { HTTP_STATUS } from '../constants';

export const getAllBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await bookingService.getAllBookings(req.query as any);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getBookingById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await bookingService.getBookingById(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(result);
};

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await bookingService.createBooking(
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.CREATED).json(result);
};

export const approveBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await bookingService.approveBooking(
    req.params.id as string,
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const rejectBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await bookingService.rejectBooking(
    req.params.id as string,
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await bookingService.cancelBooking(
    req.params.id as string,
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const completeBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await bookingService.completeBooking(
    req.params.id as string,
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

export const getUpcomingBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await bookingService.getUpcomingBookings(req.user!.userId, page, limit);
  res.status(HTTP_STATUS.OK).json(result);
};
