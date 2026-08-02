import rateLimit from "express-rate-limit";
import { config } from "../config/env";
import { errorResponse } from "../utils/response";
import { HTTP_STATUS } from "../constants";

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(errorResponse("Too many attempts. Please try again later.", HTTP_STATUS.TOO_MANY_REQUESTS));
  },
});
