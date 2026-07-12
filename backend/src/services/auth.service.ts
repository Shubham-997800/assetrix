import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { config } from '../config';
import logger from '../config/logger';
import { getRedisConnection } from '../config/redis';
import { hashPassword, comparePassword, generateToken, generateId } from '../utils';
import { HTTP_STATUS, REDIS_KEYS } from '../constants';
import { createNotification } from '../notifications';
import { createAuditLog } from '../audit';
import { emailQueue } from '../queues';
import { AppError } from '../middleware/error';
import { JwtPayload } from '../types';
import { NotificationType } from '@prisma/client';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 30;
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;
const PASSWORD_RESET_TTL_SECONDS = 60 * 60;
const EMAIL_VERIFICATION_TTL_SECONDS = 24 * 60 * 60;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface RegisterResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface LoginResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    avatar: string | null;
    lastLoginAt: Date | null;
  };
  accessToken: string;
  refreshToken: string;
}

const generateTokenPair = (payload: JwtPayload): TokenPair => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiry as any,
  });

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiry as any }
  );

  return { accessToken, refreshToken };
};

const storeSession = async (
  userId: string,
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> => {
  const redis = getRedisConnection();

  await prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      isActive: true,
      expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),
    },
  });

  await redis.setex(
    REDIS_KEYS.REFRESH_TOKEN(userId),
    REFRESH_TTL_SECONDS,
    refreshToken
  );

  await redis.setex(
    REDIS_KEYS.SESSION(userId),
    SESSION_TTL_SECONDS,
    JSON.stringify({
      refreshToken,
      userAgent,
      ipAddress,
      createdAt: new Date().toISOString(),
    })
  );
};

const revokeSession = async (userId: string): Promise<void> => {
  const redis = getRedisConnection();

  await prisma.session.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });

  await redis.del(REDIS_KEYS.REFRESH_TOKEN(userId));
  await redis.del(REDIS_KEYS.SESSION(userId));
};

const parseExpiryToSeconds = (expiry: string): number => {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 900;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return 900;
  }
};

export const register = async (
  data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    employeeId?: string;
    designation?: string;
    departmentId?: string;
  },
  ipAddress?: string,
  userAgent?: string
): Promise<RegisterResult> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('An account with this email already exists', HTTP_STATUS.CONFLICT);
  }

  const hashedPassword = await hashPassword(data.password);
  const verificationToken = generateToken(32);
  const verificationTtl = parseExpiryToSeconds(EMAIL_VERIFICATION_TTL_SECONDS.toString());

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      employeeId: data.employeeId || null,
      designation: data.designation || null,
      departmentId: data.departmentId || null,
      status: 'PENDING_VERIFICATION',
      emailVerified: false,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
    },
  });

  const redis = getRedisConnection();
  await redis.setex(
    REDIS_KEYS.EMAIL_VERIFICATION(user.email),
    verificationTtl,
    verificationToken
  );

  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await storeSession(user.id, tokens.refreshToken, userAgent, ipAddress);

  await emailQueue.add('send-email', {
    to: user.email,
    subject: 'Verify your Assetrix account',
    html: `
      <h1>Welcome to Assetrix, ${user.firstName}!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${config.frontendUrl}/verify-email?token=${verificationToken}">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  });

  await createNotification({
    userId: user.id,
    type: NotificationType.EMAIL_VERIFICATION,
    title: 'Verify your email',
    message: `Welcome to Assetrix! Please verify your email address.`,
    channel: 'IN_APP',
    link: `/verify-email?token=${verificationToken}`,
  });

  await createAuditLog({
    userId: user.id,
    action: 'REGISTER',
    entity: 'User',
    entityId: user.id,
    newValues: { email: user.email, firstName: user.firstName, lastName: user.lastName },
    ipAddress,
    userAgent,
  });

  logger.info({ userId: user.id, email: user.email }, 'User registered successfully');

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const login = async (
  data: { email: string; password: string },
  ipAddress?: string,
  userAgent?: string
): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      avatar: true,
      lastLoginAt: true,
      loginAttempts: true,
      lockedUntil: true,
      emailVerified: true,
      deletedAt: true,
    },
  });

  if (!user || user.deletedAt) {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const lockMinutes = Math.ceil(
      (user.lockedUntil.getTime() - Date.now()) / 60000
    );
    throw new AppError(
      `Account is locked. Please try again in ${lockMinutes} minute${lockMinutes > 1 ? 's' : ''}`,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (user.status === 'SUSPENDED') {
    throw new AppError(
      'Your account has been suspended. Please contact support.',
      HTTP_STATUS.FORBIDDEN
    );
  }

  if (user.status === 'INACTIVE') {
    throw new AppError(
      'Your account is inactive. Please contact support.',
      HTTP_STATUS.FORBIDDEN
    );
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    const newAttempts = user.loginAttempts + 1;
    const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: newAttempts,
        ...(shouldLock && {
          lockedUntil: new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000),
        }),
      },
    });

    if (shouldLock) {
      logger.warn(
        { userId: user.id, attempts: newAttempts },
        'Account locked after too many failed login attempts'
      );
      throw new AppError(
        `Account locked after ${MAX_LOGIN_ATTEMPTS} failed attempts. Please try again in ${LOCK_DURATION_MINUTES} minutes.`,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;
    throw new AppError(
      `Invalid email or password. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (!user.emailVerified) {
    throw new AppError(
      'Please verify your email address before logging in',
      HTTP_STATUS.FORBIDDEN
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });

  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await storeSession(user.id, tokens.refreshToken, userAgent, ipAddress);

  await createAuditLog({
    userId: user.id,
    action: 'LOGIN',
    entity: 'User',
    entityId: user.id,
    ipAddress,
    userAgent,
  });

  logger.info({ userId: user.id, email: user.email }, 'User logged in successfully');

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      lastLoginAt: user.lastLoginAt,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const refreshToken = async (
  refreshTokenStr: string,
  ipAddress?: string,
  userAgent?: string
): Promise<TokenPair> => {
  let decoded: jwt.JwtPayload;

  try {
    decoded = jwt.verify(refreshTokenStr, config.jwt.refreshSecret) as jwt.JwtPayload;
  } catch {
    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  if (decoded.type !== 'refresh') {
    throw new AppError('Invalid token type', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      deletedAt: true,
    },
  });

  if (!user || user.deletedAt) {
    throw new AppError('User not found', HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.status === 'SUSPENDED' || user.status === 'INACTIVE') {
    await revokeSession(user.id);
    throw new AppError('Account is no longer active', HTTP_STATUS.FORBIDDEN);
  }

  const redis = getRedisConnection();
  const storedRefreshToken = await redis.get(REDIS_KEYS.REFRESH_TOKEN(user.id));

  if (!storedRefreshToken || storedRefreshToken !== refreshTokenStr) {
    await revokeSession(user.id);
    logger.warn(
      { userId: user.id },
      'Refresh token mismatch - possible token theft. Session revoked.'
    );
    throw new AppError(
      'Invalid refresh token. Please log in again.',
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  const oldSession = await prisma.session.findFirst({
    where: { refreshToken: refreshTokenStr, isActive: true },
  });

  const newTokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  await prisma.session.updateMany({
    where: { refreshToken: refreshTokenStr },
    data: { isActive: false },
  });

  await storeSession(user.id, newTokens.refreshToken, userAgent, ipAddress);

  await createAuditLog({
    userId: user.id,
    action: 'TOKEN_REFRESH',
    entity: 'User',
    entityId: user.id,
    oldValues: oldSession
      ? { sessionId: oldSession.id, ipAddress: oldSession.ipAddress }
      : undefined,
    newValues: { ipAddress, userAgent },
    ipAddress,
    userAgent,
  });

  logger.debug({ userId: user.id }, 'Tokens refreshed successfully');

  return newTokens;
};

export const logout = async (
  userId: string,
  refreshTokenStr?: string
): Promise<void> => {
  const redis = getRedisConnection();

  if (refreshTokenStr) {
    await prisma.session.updateMany({
      where: { refreshToken: refreshTokenStr },
      data: { isActive: false },
    });

    const activeSessions = await prisma.session.count({
      where: { userId, isActive: true },
    });

    if (activeSessions === 0) {
      await redis.del(REDIS_KEYS.REFRESH_TOKEN(userId));
      await redis.del(REDIS_KEYS.SESSION(userId));
    }
  } else {
    await revokeSession(userId);
  }

  await createAuditLog({
    userId,
    action: 'LOGOUT',
    entity: 'User',
    entityId: userId,
  });

  logger.info({ userId }, 'User logged out');
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      status: true,
      deletedAt: true,
    },
  });

  if (!user || user.deletedAt || user.status === 'INACTIVE') {
    return;
  }

  const resetToken = generateToken(32);
  const redis = getRedisConnection();

  await redis.setex(
    REDIS_KEYS.PASSWORD_RESET(user.email),
    PASSWORD_RESET_TTL_SECONDS,
    resetToken
  );

  await emailQueue.add('send-email', {
    to: user.email,
    subject: 'Reset your Assetrix password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Hi ${user.firstName},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${config.frontendUrl}/reset-password?token=${resetToken}">
        Reset Password
      </a>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
    `,
  });

  await createNotification({
    userId: user.id,
    type: NotificationType.PASSWORD_CHANGED,
    title: 'Password Reset Requested',
    message: 'A password reset was requested for your account.',
    channel: 'EMAIL',
  });

  await createAuditLog({
    userId: user.id,
    action: 'FORGOT_PASSWORD',
    entity: 'User',
    entityId: user.id,
  });

  logger.info({ userId: user.id, email: user.email }, 'Password reset email queued');
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const redis = getRedisConnection();

  const keys = await redis.keys('password-reset:*');
  let matchedEmail: string | null = null;

  for (const key of keys) {
    const storedToken = await redis.get(key);
    if (storedToken === token) {
      matchedEmail = key.replace('password-reset:', '');
      break;
    }
  }

  if (!matchedEmail) {
    throw new AppError('Invalid or expired reset token', HTTP_STATUS.BAD_REQUEST);
  }

  const user = await prisma.user.findUnique({
    where: { email: matchedEmail },
    select: {
      id: true,
      email: true,
      password: true,
      status: true,
      deletedAt: true,
    },
  });

  if (!user || user.deletedAt) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  const isSamePassword = await comparePassword(newPassword, user.password);
  if (isSamePassword) {
    throw new AppError(
      'New password must be different from your current password',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      loginAttempts: 0,
      lockedUntil: null,
    },
  });

  await redis.del(REDIS_KEYS.PASSWORD_RESET(matchedEmail));
  await revokeSession(user.id);

  await emailQueue.add('send-email', {
    to: user.email,
    subject: 'Your Assetrix password has been changed',
    html: `
      <h1>Password Changed</h1>
      <p>Your password has been successfully changed.</p>
      <p>If you did not make this change, please contact support immediately.</p>
    `,
  });

  await createNotification({
    userId: user.id,
    type: NotificationType.PASSWORD_CHANGED,
    title: 'Password Changed',
    message: 'Your password has been successfully changed.',
    channel: 'EMAIL',
  });

  await createAuditLog({
    userId: user.id,
    action: 'RESET_PASSWORD',
    entity: 'User',
    entityId: user.id,
  });

  logger.info({ userId: user.id }, 'Password reset successfully');
};

export const verifyEmail = async (token: string): Promise<void> => {
  const redis = getRedisConnection();

  const keys = await redis.keys('email-verify:*');
  let matchedEmail: string | null = null;

  for (const key of keys) {
    const storedToken = await redis.get(key);
    if (storedToken === token) {
      matchedEmail = key.replace('email-verify:', '');
      break;
    }
  }

  if (!matchedEmail) {
    throw new AppError('Invalid or expired verification token', HTTP_STATUS.BAD_REQUEST);
  }

  const user = await prisma.user.findUnique({
    where: { email: matchedEmail },
    select: {
      id: true,
      email: true,
      firstName: true,
      emailVerified: true,
      status: true,
      deletedAt: true,
    },
  });

  if (!user || user.deletedAt) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.emailVerified) {
    await redis.del(REDIS_KEYS.EMAIL_VERIFICATION(matchedEmail));
    throw new AppError('Email is already verified', HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      status: 'ACTIVE',
    },
  });

  await redis.del(REDIS_KEYS.EMAIL_VERIFICATION(matchedEmail));

  await createNotification({
    userId: user.id,
    type: NotificationType.USER_REGISTRATION,
    title: 'Email Verified',
    message: `Welcome aboard, ${user.firstName}! Your email has been verified.`,
    channel: 'IN_APP',
  });

  await createAuditLog({
    userId: user.id,
    action: 'VERIFY_EMAIL',
    entity: 'User',
    entityId: user.id,
  });

  logger.info({ userId: user.id, email: user.email }, 'Email verified successfully');
};

export const resendVerification = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      emailVerified: true,
      status: true,
      deletedAt: true,
    },
  });

  if (!user || user.deletedAt) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.emailVerified) {
    throw new AppError('Email is already verified', HTTP_STATUS.BAD_REQUEST);
  }

  const redis = getRedisConnection();
  await redis.del(REDIS_KEYS.EMAIL_VERIFICATION(email));

  const verificationToken = generateToken(32);
  const verificationTtl = parseExpiryToSeconds(EMAIL_VERIFICATION_TTL_SECONDS.toString());

  await redis.setex(
    REDIS_KEYS.EMAIL_VERIFICATION(email),
    verificationTtl,
    verificationToken
  );

  await emailQueue.add('send-email', {
    to: user.email,
    subject: 'Verify your Assetrix account',
    html: `
      <h1>Verify Your Email</h1>
      <p>Hi ${user.firstName},</p>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${config.frontendUrl}/verify-email?token=${verificationToken}">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
    `,
  });

  await createAuditLog({
    userId: user.id,
    action: 'RESEND_VERIFICATION',
    entity: 'User',
    entityId: user.id,
  });

  logger.info({ userId: user.id, email }, 'Verification email resent');
};
