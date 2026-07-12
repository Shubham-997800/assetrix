export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  role: UserRole;
  status: UserStatus;
  employeeId?: string | null;
  designation?: string | null;
  departmentId?: string | null;
  department?: { id: string; name: string; code: string } | null;
  manager?: { id: string; firstName: string; lastName: string; email: string } | null;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'DEPARTMENT_MANAGER' | 'TECHNICIAN' | 'EMPLOYEE';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type AssetStatus = 'AVAILABLE' | 'ALLOCATED' | 'MAINTENANCE' | 'RETIRED' | 'LOST' | 'STOLEN';
export type AssetCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE' | 'EMERGENCY';
export type AuditCycleStatus = 'DRAFT' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';
export type AuditResult = 'VERIFIED' | 'MISSING' | 'DAMAGED' | 'DISCREPANCY' | 'PENDING';
export type AllocationStatus = 'ACTIVE' | 'RETURNED' | 'TRANSFERRED' | 'OVERDUE';

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  description?: string | null;
  serialNumber?: string | null;
  model?: string | null;
  manufacturer?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  currentValue?: number | null;
  status: AssetStatus;
  condition: AssetCondition;
  location?: string | null;
  departmentId?: string | null;
  department?: { id: string; name: string } | null;
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
  allocatedToId?: string | null;
  allocatedTo?: { id: string; firstName: string; lastName: string } | null;
  allocatedAt?: string | null;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  headId?: string | null;
  head?: { id: string; firstName: string; lastName: string } | null;
  parentId?: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { users: number; assets: number; allocations: number };
}

export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { assets: number };
}

export interface Allocation {
  id: string;
  assetId: string;
  asset?: Asset;
  userId: string;
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  departmentId?: string | null;
  allocatedAt: string;
  expectedReturn?: string | null;
  returnedAt?: string | null;
  status: AllocationStatus;
  notes?: string | null;
  createdAt: string;
}

export interface Booking {
  id: string;
  assetId: string;
  asset?: Asset;
  userId: string;
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  purpose: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  approvedById?: string | null;
  approvedBy?: Pick<User, 'id' | 'firstName' | 'lastName'> | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  description?: string | null;
  assetId: string;
  asset?: Asset;
  type: MaintenanceType;
  status: MaintenanceStatus;
  priority: number;
  assignedToId?: string | null;
  assignedTo?: Pick<User, 'id' | 'firstName' | 'lastName'> | null;
  requestedById?: string | null;
  requestedBy?: Pick<User, 'id' | 'firstName' | 'lastName'> | null;
  scheduledDate: string;
  startedAt?: string | null;
  completedAt?: string | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  notes?: string | null;
  findings?: string | null;
  createdAt: string;
}

export interface AuditCycle {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  status: AuditCycleStatus;
  verifiedCount: number;
  totalAssets: number;
  discrepanciesCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  channel: string;
  isRead: boolean;
  readAt?: string | null;
  link?: string | null;
  createdAt: string;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  format: string;
  status: string;
  fileUrl?: string | null;
  fileSize?: number | null;
  createdAt: string;
  completedAt?: string | null;
}

export interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  allocatedAssets: number;
  maintenanceAssets: number;
  activeBookings: number;
  pendingTransfers: number;
  overdueReturns: number;
  activeAllocations: number;
}

export interface Session {
  id: string;
  browserName?: string | null;
  browserVersion?: string | null;
  os?: string | null;
  deviceType?: string | null;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  isActive: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface LoginHistory {
  id: string;
  email: string;
  ipAddress?: string | null;
  browserName?: string | null;
  os?: string | null;
  deviceType?: string | null;
  status: string;
  createdAt: string;
}
