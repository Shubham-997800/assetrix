import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import logger from "../../config/logger";
import { config } from "../../config/env";
import { AUTH_CONSTANTS, HTTP_STATUS, NOTIFICATION_TYPE, NOTIFICATION_CHANNEL } from "../../constants";
import { AppError } from "../../utils/response";
import { hashPassword, comparePassword } from "../shared/password";
import { generateTokenPair, generateToken } from "../shared/jwt";
import { getDeviceInfo } from "../shared/device";
import { createNotification } from "../shared/notifications";
import { createAuditLog } from "../shared/audit";
import { sendEmail, emailTemplate } from "../shared/email";
import type { TokenPair, RegisterResult, LoginResult, DeviceInfo } from "../../types";

const {
  MAX_LOGIN_ATTEMPTS,
  LOCK_DURATION_MINUTES,
  REFRESH_TTL_SECONDS,
  REFRESH_REMEMBER_ME_TTL_SECONDS,
  PASSWORD_RESET_TTL_SECONDS,
  EMAIL_VERIFICATION_TTL_SECONDS,
  MAX_CONCURRENT_SESSIONS,
  SUSPICIOUS_LOGIN_THRESHOLD,
  SUSPICIOUS_LOGIN_WINDOW_HOURS,
} = AUTH_CONSTANTS;

interface SessionData {
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

async function createSession(
  userId: string,
  refreshToken: string,
  deviceInfo: DeviceInfo,
  rememberMe: boolean
): Promise<{ sessionId: string; ttl: number }> {
  const ttl = rememberMe ? REFRESH_REMEMBER_ME_TTL_SECONDS : REFRESH_TTL_SECONDS;

  const session = await prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent: deviceInfo.userAgent || null,
      ipAddress: deviceInfo.ipAddress || null,
      browserName: deviceInfo.browserName || null,
      browserVersion: deviceInfo.browserVersion || null,
      os: deviceInfo.os || null,
      deviceType: deviceInfo.deviceType || null,
      deviceInfo: JSON.stringify(deviceInfo),
      isActive: true,
      lastActiveAt: new Date(),
      expiresAt: new Date(Date.now() + ttl * 1000),
    },
  });

  await prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true },
  });

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      sessionId: session.id,
      isRevoked: false,
      expiresAt: new Date(Date.now() + ttl * 1000),
    },
  });

  return { sessionId: session.id, ttl };
}

async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.session.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });
  await prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true },
  });
}

async function enforceConcurrentSessionLimit(userId: string): Promise<void> {
  const activeSessions = await prisma.session.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (activeSessions.length >= MAX_CONCURRENT_SESSIONS) {
    const sessionsToRevoke = activeSessions.slice(0, activeSessions.length - MAX_CONCURRENT_SESSIONS + 1);
    const sessionIds = sessionsToRevoke.map((s) => s.id);

    await prisma.session.updateMany({
      where: { id: { in: sessionIds } },
      data: { isActive: false },
    });
    await prisma.refreshToken.updateMany({
      where: { sessionId: { in: sessionIds }, isRevoked: false },
      data: { isRevoked: true },
    });

    logger.info({ userId, revokedCount: sessionIds.length }, "Enforced concurrent session limit");
  }
}

async function detectSuspiciousLogin(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ isSuspicious: boolean; reason?: string }> {
  const recentLogins = await prisma.loginHistory.findMany({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - SUSPICIOUS_LOGIN_WINDOW_HOURS * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const currentDevice = getDeviceInfo(userAgent, ipAddress);

  const previousDistinctIps = new Set(
    recentLogins.filter((l) => l.ipAddress && l.ipAddress !== ipAddress).map((l) => l.ipAddress)
  );

  if (previousDistinctIps.size >= SUSPICIOUS_LOGIN_THRESHOLD && ipAddress) {
    const isNewIp = !recentLogins.some((l) => l.ipAddress === ipAddress);
    if (isNewIp) {
      return {
        isSuspicious: true,
        reason: `Login from new IP address (${ipAddress}) after ${previousDistinctIps.size} different IPs in ${SUSPICIOUS_LOGIN_WINDOW_HOURS}h`,
      };
    }
  }

  const previousDevices = new Set(
    recentLogins
      .filter((l) => l.browserName !== currentDevice.browserName || l.os !== currentDevice.os)
      .map((l) => `${l.browserName} ${l.os}`)
  );

  if (previousDevices.size >= SUSPICIOUS_LOGIN_THRESHOLD) {
    const isNewDevice = !recentLogins.some(
      (l) => l.browserName === currentDevice.browserName && l.os === currentDevice.os
    );
    if (isNewDevice) {
      return {
        isSuspicious: true,
        reason: `Login from new device (${currentDevice.browserName} on ${currentDevice.os})`,
      };
    }
  }

  return { isSuspicious: false };
}

// ─── REGISTER ─────────────────────────────────────────────

export const register = async (
  data: {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    employeeId?: string;
    designation?: string;
    departmentId?: string;
    role?: string;
    termsAccepted: boolean;
  },
  ipAddress?: string,
  userAgent?: string
): Promise<RegisterResult> => {
  if (!data.termsAccepted) {
    throw new AppError("You must accept the terms and conditions", HTTP_STATUS.BAD_REQUEST);
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true, deletedAt: true },
  });
  if (existingEmail && !existingEmail.deletedAt) {
    throw new AppError("An account with this email already exists", HTTP_STATUS.CONFLICT);
  }

  if (data.employeeId) {
    const existingEmp = await prisma.user.findUnique({
      where: { employeeId: data.employeeId },
      select: { id: true, deletedAt: true },
    });
    if (existingEmp && !existingEmp.deletedAt) {
      throw new AppError("An account with this employee ID already exists", HTTP_STATUS.CONFLICT);
    }
  }

  if (data.departmentId) {
    const dept = await prisma.department.findUnique({ where: { id: data.departmentId }, select: { id: true } });
    if (!dept) {
      throw new AppError("Department not found", HTTP_STATUS.BAD_REQUEST);
    }
  }

  const hashedPassword = await hashPassword(data.password);

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
      role: "EMPLOYEE",
      status: "ACTIVE",
      emailVerified: true,
      termsAccepted: true,
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, status: true },
  });

  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role });
  const deviceInfo = getDeviceInfo(userAgent, ipAddress);
  await createSession(user.id, tokens.refreshToken, deviceInfo, false);

  await createAuditLog({
    userId: user.id,
    action: "REGISTER",
    entity: "User",
    entityId: user.id,
    newValues: { email: user.email, firstName: user.firstName, lastName: user.lastName },
    ipAddress,
    userAgent,
  });

  logger.info({ userId: user.id, email: user.email }, "User registered successfully");

  return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
};

// ─── LOGIN ────────────────────────────────────────────────

export const login = async (
  data: { email: string; password: string; rememberMe?: boolean },
  ipAddress?: string,
  userAgent?: string
): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true, email: true, password: true, firstName: true, lastName: true,
      role: true, status: true, avatar: true, lastLoginAt: true, loginAttempts: true,
      lockedUntil: true, emailVerified: true, deletedAt: true,
    },
  });

  if (!user || user.deletedAt) {
    throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const lockMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new AppError(
      `Account is locked. Please try again in ${lockMinutes} minute${lockMinutes > 1 ? "s" : ""}`,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (user.status === "SUSPENDED") {
    throw new AppError("Your account has been suspended. Please contact support.", HTTP_STATUS.FORBIDDEN);
  }

  if (user.status === "INACTIVE") {
    throw new AppError("Your account is inactive. Please contact support.", HTTP_STATUS.FORBIDDEN);
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    const newAttempts = user.loginAttempts + 1;
    const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: newAttempts,
        ...(shouldLock && { lockedUntil: new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000) }),
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "FAILED_LOGIN",
      entity: "User",
      entityId: user.id,
      newValues: { attempts: newAttempts, locked: shouldLock },
      ipAddress,
      userAgent,
    });

    if (shouldLock) {
      throw new AppError(
        `Account locked after ${MAX_LOGIN_ATTEMPTS} failed attempts. Please try again in ${LOCK_DURATION_MINUTES} minutes.`,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;
    throw new AppError(
      `Invalid email or password. ${remainingAttempts} attempt${remainingAttempts > 1 ? "s" : ""} remaining.`,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (!user.emailVerified) {
    if (config.nodeEnv === "production") {
      throw new AppError("Please verify your email address before logging in", HTTP_STATUS.FORBIDDEN);
    }
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
  }

  await enforceConcurrentSessionLimit(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  });

  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role });
  const deviceInfo = getDeviceInfo(userAgent, ipAddress);
  await createSession(user.id, tokens.refreshToken, deviceInfo, data.rememberMe || false);

  const suspiciousResult = await detectSuspiciousLogin(user.id, ipAddress, userAgent);

  await prisma.loginHistory.create({
    data: {
      userId: user.id,
      email: user.email,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      browserName: deviceInfo.browserName || null,
      browserVersion: deviceInfo.browserVersion || null,
      os: deviceInfo.os || null,
      deviceType: deviceInfo.deviceType || null,
      status: "SUCCESS",
    },
  });

  await createAuditLog({
    userId: user.id,
    action: "LOGIN",
    entity: "User",
    entityId: user.id,
    newValues: { ipAddress, browser: deviceInfo.browserName, os: deviceInfo.os, suspicious: suspiciousResult.isSuspicious },
    ipAddress,
    userAgent,
  });

  if (suspiciousResult.isSuspicious) {
    await createNotification({
      userId: user.id,
      type: NOTIFICATION_TYPE.SYSTEM_ALERT,
      title: "Suspicious login detected",
      message: `A login was detected with unusual characteristics: ${suspiciousResult.reason}. If this was not you, please change your password immediately.`,
      channel: NOTIFICATION_CHANNEL.EMAIL,
    });
    await sendEmail({
      to: user.email,
      subject: "Suspicious login detected on your account",
      html: emailTemplate(
        "Suspicious Login Detected",
        `<p>We detected a login with unusual characteristics:</p><p><strong>${suspiciousResult.reason}</strong></p><p>If this was not you, please change your password immediately and contact support.</p>`
      ),
    });
    logger.warn({ userId: user.id, reason: suspiciousResult.reason, ipAddress }, "Suspicious login detected");
  }

  logger.info({ userId: user.id, email: user.email }, "User logged in successfully");

  return {
    user: {
      id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
      role: user.role, status: user.status, avatar: user.avatar, lastLoginAt: user.lastLoginAt,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

// ─── REFRESH TOKEN ────────────────────────────────────────

export const refreshToken = async (
  refreshTokenStr: string,
  ipAddress?: string,
  userAgent?: string
): Promise<TokenPair> => {
  let decoded: jwt.JwtPayload;
  try {
    decoded = jwt.verify(refreshTokenStr, config.jwt.refreshSecret) as jwt.JwtPayload;
  } catch {
    throw new AppError("Invalid or expired refresh token", HTTP_STATUS.UNAUTHORIZED);
  }

  if (decoded.type !== "refresh") {
    throw new AppError("Invalid token type", HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true, status: true, deletedAt: true },
  });

  if (!user || user.deletedAt) {
    throw new AppError("User not found", HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.status === "SUSPENDED" || user.status === "INACTIVE") {
    await revokeAllSessions(user.id);
    throw new AppError("Account is no longer active", HTTP_STATUS.FORBIDDEN);
  }

  const activeSession = await prisma.session.findFirst({
    where: { refreshToken: refreshTokenStr, isActive: true },
  });

  const storedToken = await prisma.refreshToken.findFirst({
    where: { token: refreshTokenStr, isRevoked: false },
  });

  if (!activeSession || !storedToken || storedToken.expiresAt < new Date()) {
    await revokeAllSessions(user.id);
    logger.warn({ userId: user.id }, "Refresh token mismatch - possible token theft. Session revoked.");
    throw new AppError("Invalid refresh token. Please log in again.", HTTP_STATUS.UNAUTHORIZED);
  }

  const newTokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role });

  await prisma.session.updateMany({
    where: { refreshToken: refreshTokenStr },
    data: { isActive: false },
  });
  await prisma.refreshToken.updateMany({
    where: { token: refreshTokenStr, isRevoked: false },
    data: { isRevoked: true },
  });

  const deviceInfo = getDeviceInfo(userAgent, ipAddress);
  await createSession(user.id, newTokens.refreshToken, deviceInfo, false);

  await createAuditLog({
    userId: user.id,
    action: "TOKEN_REFRESH",
    entity: "User",
    entityId: user.id,
    oldValues: { sessionId: activeSession.id, ipAddress: activeSession.ipAddress || undefined },
    newValues: { ipAddress, userAgent },
    ipAddress,
    userAgent,
  });

  logger.debug({ userId: user.id }, "Tokens refreshed successfully");

  return newTokens;
};

// ─── LOGOUT ───────────────────────────────────────────────

export const logout = async (userId: string, refreshTokenStr?: string): Promise<void> => {
  if (refreshTokenStr) {
    const session = await prisma.session.findFirst({ where: { refreshToken: refreshTokenStr } });
    await prisma.session.updateMany({
      where: { refreshToken: refreshTokenStr },
      data: { isActive: false },
    });
    if (session) {
      await prisma.refreshToken.updateMany({
        where: { sessionId: session.id, isRevoked: false },
        data: { isRevoked: true },
      });
    }
  } else {
    await revokeAllSessions(userId);
  }

  await createAuditLog({ userId, action: "LOGOUT", entity: "User", entityId: userId });
  logger.info({ userId }, "User logged out");
};

// ─── LOGOUT ALL ───────────────────────────────────────────

export const logoutAll = async (userId: string): Promise<void> => {
  await revokeAllSessions(userId);
  await createAuditLog({ userId, action: "LOGOUT_ALL", entity: "User", entityId: userId });
  logger.info({ userId }, "User logged out from all devices");
};

// ─── FORGOT PASSWORD ─────────────────────────────────────

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, firstName: true, status: true, deletedAt: true },
  });

  if (!user || user.deletedAt || user.status === "INACTIVE") {
    return;
  }

  const resetToken = generateToken(32);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: resetToken,
      isUsed: false,
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_SECONDS * 1000),
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Reset your Assetrix password",
    html: emailTemplate(
      "Password Reset Request",
      `<p>Hi ${user.firstName},</p><p>You requested a password reset. Click the button below to set a new password.</p><p>This link expires in 1 hour.</p>`,
      "Reset Password",
      `${config.frontendUrl}/reset-password?token=${resetToken}`
    ),
  });

  await createNotification({
    userId: user.id,
    type: NOTIFICATION_TYPE.PASSWORD_CHANGED,
    title: "Password Reset Requested",
    message: "A password reset was requested for your account.",
    channel: NOTIFICATION_CHANNEL.EMAIL,
  });

  await createAuditLog({ userId: user.id, action: "FORGOT_PASSWORD", entity: "User", entityId: user.id });
  logger.info({ userId: user.id, email: user.email }, "Password reset email queued");
};

// ─── RESET PASSWORD ───────────────────────────────────────

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const dbToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    select: { userId: true, expiresAt: true, isUsed: true },
  });

  if (!dbToken || dbToken.isUsed || dbToken.expiresAt < new Date()) {
    throw new AppError("Invalid or expired reset token", HTTP_STATUS.BAD_REQUEST);
  }

  const user = await prisma.user.findUnique({
    where: { id: dbToken.userId },
    select: { id: true, email: true, password: true, status: true, deletedAt: true },
  });

  if (!user || user.deletedAt) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  const isSamePassword = await comparePassword(newPassword, user.password);
  if (isSamePassword) {
    throw new AppError("New password must be different from your current password", HTTP_STATUS.BAD_REQUEST);
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, loginAttempts: 0, lockedUntil: null },
  });

  await revokeAllSessions(user.id);

  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, isUsed: false },
    data: { isUsed: true },
  });

  await sendEmail({
    to: user.email,
    subject: "Your Assetrix password has been changed",
    html: emailTemplate(
      "Password Changed",
      `<p>Your password has been successfully changed.</p><p>If you did not make this change, please contact support immediately.</p>`
    ),
  });

  await createNotification({
    userId: user.id,
    type: NOTIFICATION_TYPE.PASSWORD_CHANGED,
    title: "Password Changed",
    message: "Your password has been successfully changed.",
    channel: NOTIFICATION_CHANNEL.EMAIL,
  });

  await createAuditLog({ userId: user.id, action: "RESET_PASSWORD", entity: "User", entityId: user.id });
  logger.info({ userId: user.id }, "Password reset successfully");
};

// ─── VERIFY EMAIL ─────────────────────────────────────────

export const verifyEmail = async (token: string): Promise<void> => {
  const dbToken = await prisma.verificationToken.findUnique({
    where: { token },
    select: { userId: true, expiresAt: true },
  });

  if (!dbToken || dbToken.expiresAt < new Date()) {
    throw new AppError("Invalid or expired verification token", HTTP_STATUS.BAD_REQUEST);
  }

  const user = await prisma.user.findUnique({
    where: { id: dbToken.userId },
    select: { id: true, email: true, firstName: true, emailVerified: true, status: true, deletedAt: true },
  });

  if (!user || user.deletedAt) {
    throw new AppError("Invalid or expired verification token", HTTP_STATUS.BAD_REQUEST);
  }

  if (user.emailVerified) {
    await prisma.verificationToken.deleteMany({ where: { userId: user.id } });
    throw new AppError("Email is already verified", HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, status: "ACTIVE" },
  });

  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

  await createNotification({
    userId: user.id,
    type: NOTIFICATION_TYPE.USER_REGISTRATION,
    title: "Email Verified",
    message: `Welcome aboard, ${user.firstName}! Your email has been verified.`,
    channel: NOTIFICATION_CHANNEL.IN_APP,
  });

  await createAuditLog({ userId: user.id, action: "VERIFY_EMAIL", entity: "User", entityId: user.id });
  logger.info({ userId: user.id, email: user.email }, "Email verified successfully");
};

// ─── RESEND VERIFICATION ─────────────────────────────────

export const resendVerification = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, firstName: true, emailVerified: true, status: true, deletedAt: true },
  });

  if (!user || user.deletedAt) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  if (user.emailVerified) {
    throw new AppError("Email is already verified", HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

  const verificationToken = generateToken(32);

  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token: verificationToken,
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_SECONDS * 1000),
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Verify your Assetrix account",
    html: emailTemplate(
      "Verify Your Email",
      `<p>Hi ${user.firstName},</p><p>Please verify your email address by clicking the button below.</p><p>This link expires in 24 hours.</p>`,
      "Verify Email",
      `${config.frontendUrl}/verify-email?token=${verificationToken}`
    ),
  });

  await createAuditLog({ userId: user.id, action: "RESEND_VERIFICATION", entity: "User", entityId: user.id });
  logger.info({ userId: user.id, email }, "Verification email resent");
};

// ─── GET SESSIONS ─────────────────────────────────────────

export const getSessions = async (userId: string) => {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, userAgent: true, ipAddress: true, browserName: true, browserVersion: true,
      os: true, deviceType: true, isActive: true, lastActiveAt: true, expiresAt: true, createdAt: true,
    },
  });

  return sessions.map((session) => ({
    ...session,
    isCurrent: false,
    isExpired: session.expiresAt < new Date(),
  }));
};

// ─── DELETE SESSION ───────────────────────────────────────

export const deleteSession = async (userId: string, sessionId: string): Promise<void> => {
  const session = await prisma.session.findFirst({ where: { id: sessionId, userId } });

  if (!session) {
    throw new AppError("Session not found", HTTP_STATUS.NOT_FOUND);
  }

  await prisma.session.update({ where: { id: sessionId }, data: { isActive: false } });
  await prisma.refreshToken.updateMany({
    where: { sessionId, isRevoked: false },
    data: { isRevoked: true },
  });

  await createAuditLog({
    userId,
    action: "SESSION_REVOKED",
    entity: "User",
    entityId: userId,
    newValues: { sessionId },
  });

  logger.info({ userId, sessionId }, "Session revoked");
};

// ─── GET LOGIN HISTORY ────────────────────────────────────

export const getLoginHistory = async (userId: string, page = 1, limit = 20) => {
  const safeLimit = Math.min(limit, 100);
  const skip = (page - 1) * safeLimit;

  const [items, totalItems] = await Promise.all([
    prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
      select: {
        id: true, ipAddress: true, browserName: true, browserVersion: true, os: true,
        deviceType: true, location: true, status: true, failureReason: true, createdAt: true,
      },
    }),
    prisma.loginHistory.count({ where: { userId } }),
  ]);

  return {
    items,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
      currentPage: page,
      hasNextPage: page * safeLimit < totalItems,
      hasPreviousPage: page > 1,
    },
  };
};

export type { SessionData };
