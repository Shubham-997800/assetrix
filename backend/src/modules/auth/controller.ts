import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { errorResponse, successResponse } from "../../utils/response";
import { HTTP_STATUS, REFRESH_TOKEN_COOKIE } from "../../constants";
import * as authService from "./service";
import prisma from "../../config/prisma";
import type { AuthenticatedRequest } from "../../middleware/auth";

const isProduction = process.env.NODE_ENV === "production";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "none" as const,
    maxAge,
    path: "/api/v1/auth",
  };
}

function clearCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "none" as const,
    path: "/api/v1/auth",
  };
}

export const register = asyncHandler(async (req, res: Response) => {
  const result = await authService.register(req.body, req.ip, req.headers["user-agent"]);
  res
    .status(HTTP_STATUS.CREATED)
    .cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000))
    .json(
      successResponse("Registration successful", {
        user: result.user,
        accessToken: result.accessToken,
      })
    );
});

export const login = asyncHandler(async (req, res: Response) => {
  const { email, password, rememberMe } = req.body;
  const result = await authService.login({ email, password, rememberMe }, req.ip, req.headers["user-agent"]);
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  res
    .status(HTTP_STATUS.OK)
    .cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, cookieOptions(maxAge))
    .json(
      successResponse("Login successful", {
        user: result.user,
        accessToken: result.accessToken,
      })
    );
});

export const refreshToken = asyncHandler(async (req, res: Response) => {
  const tokenFromCookie = req.cookies?.refreshToken;
  const tokenFromBody = req.body?.refreshToken;
  const refreshTokenStr = tokenFromCookie || tokenFromBody;

  if (!refreshTokenStr) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json(errorResponse("Refresh token is required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  const tokens = await authService.refreshToken(refreshTokenStr, req.ip, req.headers["user-agent"]);

  res
    .status(HTTP_STATUS.OK)
    .cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000))
    .json(successResponse("Token refreshed successfully", { accessToken: tokens.accessToken }));
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Authentication required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }
  const refreshTokenStr = req.cookies?.refreshToken || req.body?.refreshToken;
  await authService.logout(userId, refreshTokenStr);
  res
    .status(HTTP_STATUS.OK)
    .clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions())
    .json(successResponse("Logged out successfully"));
});

export const logoutAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Authentication required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }
  await authService.logoutAll(userId);
  res
    .status(HTTP_STATUS.OK)
    .clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions())
    .json(successResponse("Logged out from all devices successfully"));
});

export const forgotPassword = asyncHandler(async (req, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res
    .status(HTTP_STATUS.OK)
    .json(successResponse("If an account with that email exists, a password reset link has been sent."));
});

export const resetPassword = asyncHandler(async (req, res: Response) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.status(HTTP_STATUS.OK).json(successResponse("Password reset successful. Please log in with your new password."));
});

export const verifyEmail = asyncHandler(async (req, res: Response) => {
  const tokenParam = req.query.token;
  const token = (Array.isArray(tokenParam) ? tokenParam[0] : tokenParam) || req.body?.token;

  if (!token) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse("Verification token is required", HTTP_STATUS.BAD_REQUEST));
    return;
  }

  await authService.verifyEmail(String(token));
  res.status(HTTP_STATUS.OK).json(successResponse("Email verified successfully. You can now log in."));
});

export const resendVerification = asyncHandler(async (req, res: Response) => {
  const { email } = req.body;
  await authService.resendVerification(email);
  res
    .status(HTTP_STATUS.OK)
    .json(successResponse("If an account with that email exists, a new verification link has been sent."));
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Authentication required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true,
      role: true, status: true, employeeId: true, designation: true, departmentId: true,
      emailVerified: true, lastLoginAt: true, createdAt: true,
      department: { select: { id: true, name: true, code: true } },
    },
  });

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("User not found", HTTP_STATUS.NOT_FOUND));
    return;
  }

  res.status(HTTP_STATUS.OK).json(successResponse("User profile retrieved", user));
});

export const getSessions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Authentication required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }
  const sessions = await authService.getSessions(userId);
  res.status(HTTP_STATUS.OK).json(successResponse("Sessions retrieved successfully", sessions));
});

export const deleteSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const id = req.params.id as string;
  if (!userId) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Authentication required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }
  await authService.deleteSession(userId, id);
  res.status(HTTP_STATUS.OK).json(successResponse("Session deleted successfully"));
});

export const getLoginHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Authentication required", HTTP_STATUS.UNAUTHORIZED));
    return;
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await authService.getLoginHistory(userId, page, limit);
  res.status(HTTP_STATUS.OK).json(successResponse("Login history retrieved successfully", result.items, result.meta));
});
