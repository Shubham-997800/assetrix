export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  DEPARTMENT_MANAGER: "DEPARTMENT_MANAGER",
  TECHNICIAN: "TECHNICIAN",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  DEPARTMENT_MANAGER: 3,
  TECHNICIAN: 2,
  EMPLOYEE: 1,
};

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
} as const;

export const ASSET_STATUS = {
  AVAILABLE: "AVAILABLE",
  ALLOCATED: "ALLOCATED",
  MAINTENANCE: "MAINTENANCE",
  RETIRED: "RETIRED",
  LOST: "LOST",
  STOLEN: "STOLEN",
} as const;

export const ASSET_CONDITION = {
  EXCELLENT: "EXCELLENT",
  GOOD: "GOOD",
  FAIR: "FAIR",
  POOR: "POOR",
  DAMAGED: "DAMAGED",
} as const;

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const MAINTENANCE_STATUS = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  OVERDUE: "OVERDUE",
} as const;

export const MAINTENANCE_TYPE = {
  PREVENTIVE: "PREVENTIVE",
  CORRECTIVE: "CORRECTIVE",
  PREDICTIVE: "PREDICTIVE",
  EMERGENCY: "EMERGENCY",
} as const;

export const NOTIFICATION_TYPE = {
  USER_REGISTRATION: "USER_REGISTRATION",
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  ASSET_ASSIGNED: "ASSET_ASSIGNED",
  ASSET_RETURNED: "ASSET_RETURNED",
  BOOKING_APPROVED: "BOOKING_APPROVED",
  BOOKING_REJECTED: "BOOKING_REJECTED",
  REQUEST_APPROVED: "REQUEST_APPROVED",
  REQUEST_REJECTED: "REQUEST_REJECTED",
  MAINTENANCE_ASSIGNED: "MAINTENANCE_ASSIGNED",
  MAINTENANCE_COMPLETED: "MAINTENANCE_COMPLETED",
  WARRANTY_EXPIRY: "WARRANTY_EXPIRY",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  SYSTEM_ALERT: "SYSTEM_ALERT",
} as const;

export const NOTIFICATION_CHANNEL = {
  IN_APP: "IN_APP",
  EMAIL: "EMAIL",
  PUSH: "PUSH",
} as const;

export const AUDIT_CYCLE_STATUS = {
  DRAFT: "DRAFT",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const AUDIT_RESULT = {
  VERIFIED: "VERIFIED",
  MISSING: "MISSING",
  DAMAGED: "DAMAGED",
  DISCREPANCY: "DISCREPANCY",
  PENDING: "PENDING",
} as const;

export const DISCREPANCY_STATUS = {
  OPEN: "OPEN",
  INVESTIGATING: "INVESTIGATING",
  RESOLVED: "RESOLVED",
  DISMISSED: "DISMISSED",
} as const;

export const DISCREPANCY_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export const ALLOCATION_STATUS = {
  ACTIVE: "ACTIVE",
  RETURNED: "RETURNED",
  OVERDUE: "OVERDUE",
  TRANSFERRED: "TRANSFERRED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const AUTH_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_DURATION_MINUTES: 30,
  REFRESH_TTL_SECONDS: 7 * 24 * 60 * 60,
  REFRESH_REMEMBER_ME_TTL_SECONDS: 30 * 24 * 60 * 60,
  PASSWORD_RESET_TTL_SECONDS: 60 * 60,
  EMAIL_VERIFICATION_TTL_SECONDS: 24 * 60 * 60,
  MAX_CONCURRENT_SESSIONS: 5,
  SUSPICIOUS_LOGIN_THRESHOLD: 3,
  SUSPICIOUS_LOGIN_WINDOW_HOURS: 24,
  PASSWORD_SALT_ROUNDS: 12,
  MAX_FAILED_LOGINS_PER_IP: 20,
  IP_LOCKOUT_WINDOW_MINUTES: 60,
} as const;

export const REFRESH_TOKEN_COOKIE = "refreshToken";

const PASSWORD_CLASSES: Array<[RegExp, string]> = [
  [/[a-z]/, "one lowercase letter"],
  [/[A-Z]/, "one uppercase letter"],
  [/\d/, "one number"],
  [/[^A-Za-z0-9]/, "one special character"],
];

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export function validatePasswordPolicy(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`;
  }
  const passed = PASSWORD_CLASSES.filter(([pattern]) => pattern.test(password));
  if (passed.length < 3) {
    return `Password must contain at least three of: ${PASSWORD_CLASSES.map(([, label]) => label).join(", ")}`;
  }
  return null;
}

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  SORT_ORDER: "desc",
} as const;
