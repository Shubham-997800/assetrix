import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createBookingSchema,
  approveBookingSchema,
  rejectBookingSchema,
  cancelBookingSchema,
  completeBookingSchema,
  updateBookingSchema,
  bookingIdParamSchema,
  bookingQuerySchema,
} from '../validators/booking.schema';
import * as bookingController from '../controllers/booking.controller';
import { ROLES } from '../constants';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (paginated, filterable)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by asset name, tag, user name, or purpose
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, startDate, endDate, status]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED]
 *       - in: query
 *         name: assetId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: startDateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: startDateTo
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDateTo
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/',
  validate(bookingQuerySchema, 'query'),
  bookingController.getAllBookings
);

/**
 * @swagger
 * /bookings/upcoming:
 *   get:
 *     summary: Get upcoming bookings for the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Upcoming bookings retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/upcoming',
  bookingController.getUpcomingBookings
);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:id',
  validate(bookingIdParamSchema, 'params'),
  bookingController.getBookingById
);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetId
 *               - purpose
 *               - startDate
 *               - endDate
 *             properties:
 *               assetId:
 *                 type: string
 *                 format: uuid
 *               purpose:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Asset is not available for booking
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Overlapping booking exists
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/',
  validate(createBookingSchema),
  bookingController.createBooking
);

/**
 * @swagger
 * /bookings/{id}/approve:
 *   post:
 *     summary: Approve a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Booking approved successfully
 *       400:
 *         description: Booking cannot be approved
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Conflicting approved booking exists
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/:id/approve',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(bookingIdParamSchema, 'params'),
  validate(approveBookingSchema),
  bookingController.approveBooking
);

/**
 * @swagger
 * /bookings/{id}/reject:
 *   post:
 *     summary: Reject a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Booking rejected successfully
 *       400:
 *         description: Booking cannot be rejected
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/:id/reject',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(bookingIdParamSchema, 'params'),
  validate(rejectBookingSchema),
  bookingController.rejectBooking
);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   post:
 *     summary: Cancel a booking (owner only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking cannot be cancelled
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/:id/cancel',
  validate(bookingIdParamSchema, 'params'),
  validate(cancelBookingSchema),
  bookingController.cancelBooking
);

/**
 * @swagger
 * /bookings/{id}/complete:
 *   post:
 *     summary: Mark a booking as completed
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Booking completed successfully
 *       400:
 *         description: Booking cannot be completed
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/:id/complete',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(bookingIdParamSchema, 'params'),
  validate(completeBookingSchema),
  bookingController.completeBooking
);

router.put(
  '/:id',
  validate(bookingIdParamSchema, 'params'),
  validate(updateBookingSchema),
  bookingController.updateBooking
);

export { router as bookingRouter };
