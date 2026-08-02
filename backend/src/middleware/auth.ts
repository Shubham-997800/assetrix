import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { HTTP_STATUS, type Role } from "../constants";
import { errorResponse } from "../utils/response";
import type { JwtPayload } from "../types";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Access denied. No token provided.", HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    if (decoded.type && decoded.type !== "access") {
      throw new Error("Invalid token type");
    }
    req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role, sessionId: decoded.sessionId };
    next();
  } catch {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Invalid or expired token.", HTTP_STATUS.UNAUTHORIZED));
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Access denied. No token provided.", HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(HTTP_STATUS.FORBIDDEN).json(errorResponse("Insufficient permissions.", HTTP_STATUS.FORBIDDEN));
      return;
    }

    next();
  };
};
