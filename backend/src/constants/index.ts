export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  DEPARTMENT_MANAGER: 'DEPARTMENT_MANAGER',
  TECHNICIAN: 'TECHNICIAN',
  EMPLOYEE: 'EMPLOYEE',
} as const;

export const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  DEPARTMENT_MANAGER: 3,
  TECHNICIAN: 2,
  EMPLOYEE: 1,
};

export const ASSET_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ALLOCATED: 'ALLOCATED',
  MAINTENANCE: 'MAINTENANCE',
  RETIRED: 'RETIRED',
  LOST: 'LOST',
  STOLEN: 'STOLEN',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export const MAINTENANCE_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  OVERDUE: 'OVERDUE',
} as const;

export const MAINTENANCE_TYPE = {
  PREVENTIVE: 'PREVENTIVE',
  CORRECTIVE: 'CORRECTIVE',
  PREDICTIVE: 'PREDICTIVE',
  EMERGENCY: 'EMERGENCY',
} as const;

export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  FULFILLED: 'FULFILLED',
} as const;

export const NOTIFICATION_TYPE = {
  USER_REGISTRATION: 'USER_REGISTRATION',
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  ASSET_ASSIGNED: 'ASSET_ASSIGNED',
  ASSET_RETURNED: 'ASSET_RETURNED',
  BOOKING_APPROVED: 'BOOKING_APPROVED',
  BOOKING_REJECTED: 'BOOKING_REJECTED',
  REQUEST_APPROVED: 'REQUEST_APPROVED',
  REQUEST_REJECTED: 'REQUEST_REJECTED',
  MAINTENANCE_ASSIGNED: 'MAINTENANCE_ASSIGNED',
  MAINTENANCE_COMPLETED: 'MAINTENANCE_COMPLETED',
  WARRANTY_EXPIRY: 'WARRANTY_EXPIRY',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
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

export const ALLOWED_FILE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
} as const;

export const ALLOWED_MIME_TYPES = Object.keys(ALLOWED_FILE_TYPES) as readonly string[];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const AUTH_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_DURATION_MINUTES: 30,
  SESSION_TTL_SECONDS: 7 * 24 * 60 * 60,
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

export const REDIS_KEYS = {
  SESSION: (userId: string) => `auth:session:${userId}`,
  SESSIONS: (userId: string) => `auth:sessions:${userId}`,
  REFRESH_TOKEN: (userId: string) => `auth:refresh:${userId}`,
  OTP: (email: string) => `otp:${email}`,
  PASSWORD_RESET: (email: string) => `password-reset:${email}`,
  EMAIL_VERIFICATION: (email: string) => `email-verify:${email}`,
  RATE_LIMIT: (ip: string) => `rate:${ip}`,
  FAILED_LOGINS: (ip: string) => `auth:failed:${ip}`,
  ACTIVE_SESSION_COUNT: (userId: string) => `auth:session-count:${userId}`,
  ASSET_CACHE: (assetId: string) => `asset:${assetId}`,
  DASHBOARD_CACHE: 'analytics:dashboard',
  AI_CACHE: (key: string) => `ai:${key}`,
  ANALYTICS_CACHE: (key: string) => `analytics:${key}`,
} as const;

export const CACHE_TTL = {
  SHORT: 300,
  MEDIUM: 900,
  LONG: 3600,
  DAY: 86400,
} as const;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
export const PASSWORD_MIN_MSG = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  SORT_ORDER: 'desc' as const,
} as const;

export const AUDIT_CYCLE_STATUS = {
  DRAFT: 'DRAFT',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const ALLOCATION_STATUS = {
  ACTIVE: 'ACTIVE',
  RETURNED: 'RETURNED',
  OVERDUE: 'OVERDUE',
  TRANSFERRED: 'TRANSFERRED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
} as const;
