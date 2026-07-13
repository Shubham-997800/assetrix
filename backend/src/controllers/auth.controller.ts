import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as authService from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants';
import logger from '../config/logger';

const handleControllerError = (error: unknown, res: Response, context: string): void => {
  if (error instanceof Error && 'statusCode' in error) {
    const appError = error as { statusCode: number; message: string };
    res
      .status(appError.statusCode)
      .json(errorResponse(appError.message, appError.statusCode));
    return;
  }

  logger.error({ error }, `${context} error`);
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json(
      errorResponse(
        `An unexpected error occurred during ${context.toLowerCase()}`,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
};

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      employeeId,
      designation,
      departmentId,
      role,
      termsAccepted,
    } = req.body;

    const result = await authService.register(
      {
        email,
        password,
        confirmPassword: req.body.confirmPassword,
        firstName,
        lastName,
        phone,
        employeeId,
        designation,
        departmentId,
        role,
        termsAccepted,
      },
      req.ip,
      req.headers['user-agent']
    );

    res
      .status(HTTP_STATUS.CREATED)
      .cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      })
      .json(
        successResponse('Registration successful. Please verify your email.', {
          user: result.user,
          accessToken: result.accessToken,
        })
      );
  } catch (error) {
    handleControllerError(error, res, 'Registration');
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;

    const result = await authService.login(
      { email, password, rememberMe },
      req.ip,
      req.headers['user-agent']
    );

    const maxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;

    res
      .status(HTTP_STATUS.OK)
      .cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge,
        path: '/api/v1/auth',
      })
      .json(
        successResponse('Login successful', {
          user: result.user,
          accessToken: result.accessToken,
        })
      );
  } catch (error) {
    handleControllerError(error, res, 'Login');
  }
};

export const refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    const tokenFromBody = req.body?.refreshToken;
    const refreshTokenStr = tokenFromCookie || tokenFromBody;

    if (!refreshTokenStr) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse('Refresh token is required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    const tokens = await authService.refreshToken(
      refreshTokenStr,
      req.ip,
      req.headers['user-agent']
    );

    res
      .status(HTTP_STATUS.OK)
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      })
      .json(successResponse('Token refreshed successfully', { accessToken: tokens.accessToken }));
  } catch (error) {
    handleControllerError(error, res, 'Token refresh');
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const refreshTokenStr = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse('Authentication required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    await authService.logout(userId, refreshTokenStr);

    res
      .status(HTTP_STATUS.OK)
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/api/v1/auth',
      })
      .json(successResponse('Logged out successfully'));
  } catch (error) {
    handleControllerError(error, res, 'Logout');
  }
};

export const logoutAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse('Authentication required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    await authService.logoutAll(userId);

    res
      .status(HTTP_STATUS.OK)
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/api/v1/auth',
      })
      .json(successResponse('Logged out from all devices successfully'));
  } catch (error) {
    handleControllerError(error, res, 'Logout all');
  }
};

export const forgotPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    res
      .status(HTTP_STATUS.OK)
      .json(
        successResponse(
          'If an account with that email exists, a password reset link has been sent.'
        )
      );
  } catch (error) {
    handleControllerError(error, res, 'Forgot password');
  }
};

export const resetPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse('Password reset successful. Please log in with your new password.'));
  } catch (error) {
    handleControllerError(error, res, 'Reset password');
  }
};

export const verifyEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const tokenParam = req.query.token;
    const token = (Array.isArray(tokenParam) ? tokenParam[0] : tokenParam) || req.body?.token;

    if (!token) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Verification token is required', HTTP_STATUS.BAD_REQUEST));
      return;
    }

    await authService.verifyEmail(token);

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse('Email verified successfully. You can now log in.'));
  } catch (error) {
    handleControllerError(error, res, 'Email verification');
  }
};

export const resendVerification = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    await authService.resendVerification(email);

    res
      .status(HTTP_STATUS.OK)
      .json(
        successResponse(
          'If an account with that email exists, a new verification link has been sent.'
        )
      );
  } catch (error) {
    handleControllerError(error, res, 'Resend verification');
  }
};

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse('Authentication required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    const prisma = (await import('../config/database')).default;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        employeeId: true,
        designation: true,
        departmentId: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        department: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    if (!user) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(errorResponse('User not found', HTTP_STATUS.NOT_FOUND));
      return;
    }

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse('User profile retrieved', user));
  } catch (error) {
    logger.error({ error }, 'Get profile error');
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          'An unexpected error occurred while retrieving profile',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  }
};

export const getSessions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse('Authentication required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    const sessions = await authService.getSessions(userId);

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse('Sessions retrieved successfully', sessions));
  } catch (error) {
    handleControllerError(error, res, 'Get sessions');
  }
};

export const deleteSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;

    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse('Authentication required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    await authService.deleteSession(userId, id);

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse('Session deleted successfully'));
  } catch (error) {
    handleControllerError(error, res, 'Delete session');
  }
};

export const getLoginHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse('Authentication required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await authService.getLoginHistory(userId, page, limit);

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse('Login history retrieved successfully', result.items, result.meta));
  } catch (error) {
    handleControllerError(error, res, 'Get login history');
  }
};
