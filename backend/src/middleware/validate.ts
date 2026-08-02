import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { HTTP_STATUS } from "../constants";
import { errorResponse } from "../utils/response";

export const validate =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      if (source === "body") req.body = parsed;
      if (source === "query") req.query = parsed;
      if (source === "params") req.params = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => {
          const path = issue.path.join(".");
          return `${path}: ${issue.message}`;
        });
        res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .json(errorResponse("Validation failed", HTTP_STATUS.UNPROCESSABLE_ENTITY, errors));
        return;
      }
      next(error);
    }
  };
