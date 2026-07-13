import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { HTTP_STATUS } from '../constants';
import { errorResponse } from '../utils/response';

// NOTE: In production, replace the default MemoryStore with a Redis-backed store
// (e.g., rate-limit-redis) to share rate limits across multiple instances.
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: errorResponse('Too many requests. Please try again later.', HTTP_STATUS.TOO_MANY_REQUESTS),
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: errorResponse('Too many authentication attempts. Please try again later.', HTTP_STATUS.TOO_MANY_REQUESTS),
  standardHeaders: true,
  legacyHeaders: false,
});
