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
  'application/pdf': '.pdf',
  'application/msword': '.docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/csv': '.csv',
} as const;

export const REDIS_KEYS = {
  SESSION: (userId: string) => `auth:session:${userId}`,
  REFRESH_TOKEN: (userId: string) => `auth:refresh:${userId}`,
  OTP: (email: string) => `otp:${email}`,
  PASSWORD_RESET: (email: string) => `password-reset:${email}`,
  EMAIL_VERIFICATION: (email: string) => `email-verify:${email}`,
  RATE_LIMIT: (ip: string) => `rate:${ip}`,
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

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  SORT_ORDER: 'desc' as const,
} as const;
