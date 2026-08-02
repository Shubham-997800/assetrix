import type { Role } from "../constants";

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  sessionId?: string;
  type?: string;
}

export interface AuthRequestUser {
  userId: string;
  email: string;
  role: Role;
  sessionId?: string;
}

export interface DeviceInfo {
  userAgent?: string;
  ipAddress?: string;
  browserName?: string;
  browserVersion?: string;
  os?: string;
  deviceType?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: string;
}

export interface LoginUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  role: Role;
  status: string;
  employeeId: string | null;
  designation: string | null;
  departmentId: string | null;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface RegisterResult {
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

export interface LoginResult {
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
