import jwt from "jsonwebtoken";
import { config } from "../../config/env";
import type { JwtPayload, TokenPair } from "../../types";

export function generateTokenPair(payload: JwtPayload): TokenPair {
  const accessToken = jwt.sign({ ...payload, type: "access" }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiry as unknown as number,
  });
  const refreshToken = jwt.sign({ ...payload, type: "refresh" }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry as unknown as number,
  });
  return { accessToken, refreshToken };
}

export function parseExpiryToSeconds(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 900;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s": return value;
    case "m": return value * 60;
    case "h": return value * 3600;
    case "d": return value * 86400;
    default: return 900;
  }
}

export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const bytes = require("crypto").randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}
