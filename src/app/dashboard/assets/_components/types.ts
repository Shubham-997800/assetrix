export type AssetStatus =
  | "Available"
  | "Allocated"
  | "Reserved"
  | "Under Maintenance"
  | "Lost"
  | "Retired"
  | "Disposed";

export type AssetCondition =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor"
  | "Damaged";

export interface Asset {
  id: string;
  tag: string;
  name: string;
  description: string;
  category: string;
  condition: AssetCondition;
  status: AssetStatus;
  department: string;
  location: string;
  currentHolder: string | null;
  serialNumber: string;
  manufacturer: string;
  modelNumber: string;
  barcode: string;
  qrCode: string;
  acquisitionDate: string;
  acquisitionCost: number;
  vendor: string;
  warrantyExpiry: string;
  purchaseRef: string;
  sharedResource: boolean;
  bookableResource: boolean;
  documents: AssetDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface AssetDocument {
  id: string;
  name: string;
  type: "image" | "warranty" | "invoice" | "manual" | "certificate";
  size: string;
  uploadedAt: string;
}

export interface AllocationRecord {
  id: string;
  employee: string;
  department: string;
  allocatedDate: string;
  returnDate: string | null;
  expectedReturn: string | null;
  status: "Active" | "Returned" | "Overdue";
}

export interface MaintenanceRecord {
  id: string;
  issue: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  technician: string;
  reportedDate: string;
  completedDate: string | null;
  resolution: string | null;
  cost: number;
  status: "Open" | "In Progress" | "Completed";
}

export interface TimelineEvent {
  id: string;
  type:
    | "registered"
    | "allocated"
    | "transferred"
    | "maintenance"
    | "maintenance_completed"
    | "audit_verified"
    | "returned"
    | "available"
    | "retired"
    | "lost";
  title: string;
  description: string;
  date: string;
  user: string;
}

export type SortField =
  | "tag"
  | "name"
  | "category"
  | "department"
  | "currentHolder"
  | "location"
  | "status"
  | "condition"
  | "acquisitionDate"
  | "updatedAt";

export type SortDirection = "asc" | "desc";

export interface ColumnVisibility {
  tag: boolean;
  name: boolean;
  category: boolean;
  department: boolean;
  currentHolder: boolean;
  location: boolean;
  status: boolean;
  condition: boolean;
  acquisitionDate: boolean;
  updatedAt: boolean;
}

export const DEFAULT_COLUMNS: ColumnVisibility = {
  tag: true,
  name: true,
  category: true,
  department: true,
  currentHolder: true,
  location: true,
  status: true,
  condition: true,
  acquisitionDate: true,
  updatedAt: true,
};

export const STATUS_COLORS: Record<AssetStatus, string> = {
  Available: "#10B981",
  Allocated: "#0891B2",
  Reserved: "#2563EB",
  "Under Maintenance": "#F59E0B",
  Lost: "#EF4444",
  Retired: "#64748B",
  Disposed: "#475569",
};

export const STATUS_BADGE_CLASSES: Record<AssetStatus, string> = {
  Available:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Allocated:
    "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  Reserved:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "Under Maintenance":
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Lost: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  Retired:
    "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  Disposed:
    "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
};

export const CONDITION_BADGE_CLASSES: Record<AssetCondition, string> = {
  Excellent:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Good: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  Fair: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Poor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  Damaged: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};
