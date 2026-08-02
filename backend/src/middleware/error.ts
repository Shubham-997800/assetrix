import type { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import { HTTP_STATUS } from "../constants";
import { AppError, errorResponse } from "../utils/response";

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(errorResponse(error.message, error.statusCode, error.errors));
    return;
  }

  logger.error({ err: error.message, stack: error.stack }, "Unhandled error");

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
    errorResponse("Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR)
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json(
    errorResponse(`Route ${req.method} ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND)
  );
};
