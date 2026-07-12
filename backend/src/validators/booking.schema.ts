import { z } from 'zod';

export const createBookingSchema = z.object({
  assetId: z.string().uuid('Invalid asset ID'),
  purpose: z.string().min(1, 'Purpose is required').max(500),
  startDate: z.coerce.date({ invalid_type_error: 'Invalid start date' }),
  endDate: z.coerce.date({ invalid_type_error: 'Invalid end date' }),
  notes: z.string().max(500).optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const approveBookingSchema = z.object({
  notes: z.string().max(500).optional(),
});

export const rejectBookingSchema = z.object({
  rejectionReason: z.string().min(1, 'Rejection reason is required').max(500),
});

export const cancelBookingSchema = z.object({
  notes: z.string().max(500).optional(),
});

export const completeBookingSchema = z.object({
  notes: z.string().max(500).optional(),
});

export const bookingIdParamSchema = z.object({
  id: z.string().uuid('Invalid booking ID'),
});

export const bookingQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'startDate', 'endDate', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED']).optional(),
  assetId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  startDateFrom: z.coerce.date().optional(),
  startDateTo: z.coerce.date().optional(),
  endDateFrom: z.coerce.date().optional(),
  endDateTo: z.coerce.date().optional(),
});

export const updateBookingSchema = z.object({
  purpose: z.string().min(1).max(500).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) return data.endDate > data.startDate;
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ApproveBookingInput = z.infer<typeof approveBookingSchema>;
export type RejectBookingInput = z.infer<typeof rejectBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type CompleteBookingInput = z.infer<typeof completeBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>;
