import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const generateId = (): string => uuidv4();

export const hashPassword = async (password: string): Promise<string> => bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = async (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash);

export const generateOtp = (length = 6): string => {
  const digits = '0123456789';
  let otp = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % 10];
  }
  return otp;
};

export const generateToken = (length = 40): string => crypto.randomBytes(length).toString('hex');

export const generateQrCode = (assetId: string): string => `AST-${assetId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

export const sanitizeString = (str: string): string => str.trim().toLowerCase();

export const capitalizeFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const calculateAge = (date: Date): number => {
  const now = new Date();
  const birth = new Date(date);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const isExpired = (date: Date): boolean => new Date(date) < new Date();

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date: Date): string => date.toISOString();

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
