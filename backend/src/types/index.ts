export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  statusCode: number;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Express.Request {
  user?: JwtPayload;
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
}

export interface AuditLogData {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'DEPARTMENT_MANAGER' | 'TECHNICIAN' | 'EMPLOYEE';

export type AssetStatus = 'AVAILABLE' | 'ALLOCATED' | 'MAINTENANCE' | 'RETIRED' | 'LOST' | 'STOLEN';

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';

export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE' | 'EMERGENCY';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'PUSH';

export type NotificationType =
  | 'USER_REGISTRATION'
  | 'EMAIL_VERIFICATION'
  | 'ASSET_ASSIGNED'
  | 'ASSET_RETURNED'
  | 'BOOKING_APPROVED'
  | 'BOOKING_REJECTED'
  | 'REQUEST_APPROVED'
  | 'REQUEST_REJECTED'
  | 'MAINTENANCE_ASSIGNED'
  | 'MAINTENANCE_COMPLETED'
  | 'WARRANTY_EXPIRY'
  | 'PASSWORD_CHANGED'
  | 'SYSTEM_ALERT';
