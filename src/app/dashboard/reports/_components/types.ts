export type ReportTab = "overview" | "utilization" | "idle" | "maintenance" | "retirement" | "department" | "heatmap" | "export";

export type ExportFormat = "CSV" | "PDF" | "Excel";

export type RetirementStatus = "Healthy" | "Monitor" | "Replace Soon" | "Critical";

export type IdleSeverity = "normal" | "warning" | "critical" | "severe";

export interface AssetUtilization {
  assetTag: string;
  assetName: string;
  category: string;
  department: string;
  utilizationPercent: number;
  totalAllocationDays: number;
  usageFrequency: number;
  averageDowntimeDays: number;
  bookingHours: number;
}

export interface IdleAsset {
  assetTag: string;
  assetName: string;
  category: string;
  lastUsageDate: string;
  idleDays: number;
  department: string;
  estimatedValue: number;
  severity: IdleSeverity;
}

export interface MaintenanceTrend {
  assetTag: string;
  assetName: string;
  category: string;
  department: string;
  totalRequests: number;
  averageRepairDays: number;
  totalCost: number;
  lastRepairDate: string;
  failureRate: number;
}

export interface RetirementForecast {
  assetTag: string;
  assetName: string;
  category: string;
  department: string;
  assetAge: number;
  maintenanceFrequency: number;
  conditionScore: number;
  warrantyExpiry: string;
  remainingUsefulLifeMonths: number;
  recommendedAction: string;
  status: RetirementStatus;
}

export interface DepartmentAllocation {
  department: string;
  assetsAllocated: number;
  totalAssetValue: number;
  sharedResourceUsage: number;
  overdueReturns: number;
  utilizationRate: number;
}

export interface BookingHeatmapSlot {
  day: string;
  hour: string;
  utilization: number;
}

export interface MonthlyData {
  month: string;
  value: number;
}

export const DEPARTMENTS = ["Engineering", "Finance", "HR", "Marketing", "Operations", "Procurement", "Sales", "IT"];

export const CATEGORIES = ["IT Equipment", "Heavy Machinery", "Vehicles", "Printers", "Manufacturing", "Servers", "Furniture", "AV Equipment"];

export const STATUSES = ["Active", "Idle", "Under Maintenance", "Retired"];

export const LOCATIONS = ["Floor 1", "Floor 2", "Floor 3", "Warehouse A", "Production Floor", "Server Room", "Parking"];

export const STATUS_COLORS: Record<RetirementStatus, string> = {
  Healthy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Monitor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "Replace Soon": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export const SEVERITY_COLORS: Record<IdleSeverity, string> = {
  normal: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  critical: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  severe: "bg-red-500/10 text-red-600 dark:text-red-400",
};
