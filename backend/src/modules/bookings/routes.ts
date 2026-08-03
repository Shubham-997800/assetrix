import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  approveBookingSchema,
  bookingIdParamSchema,
  bookingQuerySchema,
  cancelBookingSchema,
  completeBookingSchema,
  createBookingSchema,
  rejectBookingSchema,
  updateBookingSchema,
} from "./validators";
import * as bookingController from "./controller";

const router = Router();

router.use(authenticate);

router.get("/", validate(bookingQuerySchema, "query"), bookingController.getAllBookings);

router.get("/upcoming", bookingController.getUpcomingBookings);

router.get("/:id", validate(bookingIdParamSchema, "params"), bookingController.getBookingById);

router.post("/", validate(createBookingSchema), bookingController.createBooking);

router.post(
  "/:id/approve",
  validate(bookingIdParamSchema, "params"),
  validate(approveBookingSchema),
  bookingController.approveBooking
);

router.post(
  "/:id/reject",
  validate(bookingIdParamSchema, "params"),
  validate(rejectBookingSchema),
  bookingController.rejectBooking
);

router.post(
  "/:id/cancel",
  validate(bookingIdParamSchema, "params"),
  validate(cancelBookingSchema),
  bookingController.cancelBooking
);

router.post(
  "/:id/complete",
  validate(bookingIdParamSchema, "params"),
  validate(completeBookingSchema),
  bookingController.completeBooking
);

router.put(
  "/:id",
  validate(bookingIdParamSchema, "params"),
  validate(updateBookingSchema),
  bookingController.updateBooking
);

export default router;
