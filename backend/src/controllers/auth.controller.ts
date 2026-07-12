import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as authService from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants';
import logger from '../config/logger';

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
    } = req.body;

    const result = await authService.register(
      {
        email,
        password,
        firstName,
        lastName,
        phone,
        employeeId,
        designation,
        departmentId,
      },
      req.ip,
      req.headers['user-agent']
    );

    res
      .status(HTTP_STATUS.CREATED)
      .cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as { statusCode: number; message: string };
      res
        .status(appError.statusCode)
        .json(errorResponse(appError.message, appError.statusCode));
      return;
    }

    logger.error({ error }, 'Registration error');
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          'An unexpected error occurred during registration',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(
      { email, password },
      req.ip,
      req.headers['user-agent']
    );

    res
      .status(HTTP_STATUS.OK)
      .cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      })
      .json(successResponse('Login successful', { user: result.user, accessToken: result.accessToken }));
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as { statusCode: number; message: string };
      res
        .status(appError.statusCode)
        .json(errorResponse(appError.message, appError.statusCode));
      return;
    }

    logger.error({ error }, 'Login error');
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse('An unexpected error occurred during login', HTTP_STATUS.INTERNAL_SERVER_ERROR)
      );
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
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      })
      .json(successResponse('Token refreshed successfully', { accessToken: tokens.accessToken }));
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as { statusCode: number; message: string };
      res
        .status(appError.statusCode)
        .json(errorResponse(appError.message, appError.statusCode));
      return;
    }

    logger.error({ error }, 'Token refresh error');
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          'An unexpected error occurred during token refresh',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
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
        sameSite: 'strict',
        path: '/api/v1/auth',
      })
      .json(successResponse('Logged out successfully'));
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as { statusCode: number; message: string };
      res
        .status(appError.statusCode)
        .json(errorResponse(appError.message, appError.statusCode));
      return;
    }

    logger.error({ error }, 'Logout error');
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse('An unexpected error occurred during logout', HTTP_STATUS.INTERNAL_SERVER_ERROR)
      );
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
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as { statusCode: number; message: string };
      res
        .status(appError.statusCode)
        .json(errorResponse(appError.message, appError.statusCode));
      return;
    }

    logger.error({ error }, 'Forgot password error');
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          'An unexpected error occurred. Please try again later.',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
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
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as { statusCode: number; message: string };
      res
        .status(appError.statusCode)
        .json(errorResponse(appError.message, appError.statusCode));
      return;
    }

    logger.error({ error }, 'Reset password error');
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          'An unexpected error occurred during password reset',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  }
};

export const verifyEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    await authService.verifyEmail(token);

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse('Email verified successfully. You can now log in.'));
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as { statusCode: number; message: string };
      res
        .status(appError.statusCode)
        .json(errorResponse(appError.message, appError.statusCode));
      return;
    }

    logger.error({ error }, 'Email verification error');
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          'An unexpected error occurred during email verification',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
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
    if (error instanceof Error && 'statusCode' in error) {
      const appError = error as { statusCode: number; message: string };
      res
        .status(appError.statusCode)
        .json(errorResponse(appError.message, appError.statusCode));
      return;
    }

    logger.error({ error }, 'Resend verification error');
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          'An unexpected error occurred. Please try again later.',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
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
