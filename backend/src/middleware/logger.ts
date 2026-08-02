import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

declare module "express-serve-static-core" {
  interface Request {
    id?: string;
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime.bigint();
  req.id = randomUUID();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    if (res.statusCode >= 400) {
      logger.warn(
        { id: req.id, method: req.method, url: req.originalUrl, status: res.statusCode, durationMs },
        "Request completed"
      );
      return;
    }
    logger.info(
      { id: req.id, method: req.method, url: req.originalUrl, status: res.statusCode, durationMs },
      "Request completed"
    );
  });

  next();
};
