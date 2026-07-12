import type { AssetUtilization, IdleAsset, MaintenanceTrend, RetirementForecast, DepartmentAllocation, BookingHeatmapSlot, MonthlyData } from "./types";

export const MOCK_UTILIZATION: AssetUtilization[] = [
  { assetTag: "AR-000001", assetName: 'MacBook Pro 16"', category: "IT Equipment", department: "Engineering", utilizationPercent: 94, totalAllocationDays: 342, usageFrequency: 287, averageDowntimeDays: 2, bookingHours: 2040 },
  { assetTag: "AR-000003", assetName: "CNC Machine Model X", category: "Manufacturing", department: "Operations", utilizationPercent: 88, totalAllocationDays: 321, usageFrequency: 156, averageDowntimeDays: 8, bookingHours: 5400 },
  { assetTag: "AR-000011", assetName: "Cisco Webex Board Pro 75", category: "AV Equipment", department: "Operations", utilizationPercent: 72, totalAllocationDays: 263, usageFrequency: 198, averageDowntimeDays: 5, bookingHours: 1200 },
  { assetTag: "AR-000012", assetName: "Server Dell PowerEdge R750", category: "Servers", department: "Engineering", utilizationPercent: 96, totalAllocationDays: 350, usageFrequency: 365, averageDowntimeDays: 1, bookingHours: 8640 },
  { assetTag: "AR-000008", assetName: "HP LaserJet Enterprise M611", category: "Printers", department: "Finance", utilizationPercent: 65, totalAllocationDays: 237, usageFrequency: 310, averageDowntimeDays: 3, bookingHours: 720 },
  { assetTag: "AR-000013", assetName: "Forklift Toyota 8FGU25", category: "Heavy Machinery", department: "Operations", utilizationPercent: 82, totalAllocationDays: 299, usageFrequency: 245, averageDowntimeDays: 6, bookingHours: 3600 },
  { assetTag: "AR-000018", assetName: "AC Unit Daikin 3HP", category: "Furniture", department: "Operations", utilizationPercent: 45, totalAllocationDays: 164, usageFrequency: 120, averageDowntimeDays: 15, bookingHours: 0 },
  { assetTag: "AR-000009", assetName: 'iPad Pro 12.9"', category: "IT Equipment", department: "Marketing", utilizationPercent: 78, totalAllocationDays: 285, usageFrequency: 210, averageDowntimeDays: 4, bookingHours: 1560 },
  { assetTag: "AR-000016", assetName: "3D Printer Ultimaker S7", category: "Manufacturing", department: "Engineering", utilizationPercent: 35, totalAllocationDays: 128, usageFrequency: 45, averageDowntimeDays: 20, bookingHours: 480 },
  { assetTag: "AR-000010", assetName: "Standing Desk Ergo Pro", category: "Furniture", department: "Engineering", utilizationPercent: 55, totalAllocationDays: 201, usageFrequency: 180, averageDowntimeDays: 1, bookingHours: 0 },
  { assetTag: "AR-000014", assetName: "Logitech Rally 4K Camera", category: "AV Equipment", department: "Marketing", utilizationPercent: 42, totalAllocationDays: 153, usageFrequency: 88, averageDowntimeDays: 8, bookingHours: 352 },
  { assetTag: "AR-000002", assetName: 'Dell UltraSharp 27" Monitor', category: "IT Equipment", department: "Finance", utilizationPercent: 88, totalAllocationDays: 321, usageFrequency: 300, averageDowntimeDays: 1, bookingHours: 0 },
  { assetTag: "AR-000019", assetName: "Retired Dell OptiPlex 7080", category: "IT Equipment", department: "IT", utilizationPercent: 8, totalAllocationDays: 29, usageFrequency: 12, averageDowntimeDays: 45, bookingHours: 48 },
  { assetTag: "AR-000020", assetName: "Disposal Batch Q1-2026", category: "IT Equipment", department: "IT", utilizationPercent: 0, totalAllocationDays: 0, usageFrequency: 0, averageDowntimeDays: 0, bookingHours: 0 },
];

export const MOCK_IDLE: IdleAsset[] = [
  { assetTag: "AR-000020", assetName: "Disposal Batch Q1-2026", category: "IT Equipment", lastUsageDate: "2026-01-15", idleDays: 178, department: "IT", estimatedValue: 2400, severity: "severe" },
  { assetTag: "AR-000016", assetName: "3D Printer Ultimaker S7", category: "Manufacturing", lastUsageDate: "2026-05-10", idleDays: 63, department: "Engineering", estimatedValue: 18500, severity: "critical" },
  { assetTag: "AR-000019", assetName: "Retired Dell OptiPlex 7080", category: "IT Equipment", lastUsageDate: "2026-05-28", idleDays: 45, department: "IT", estimatedValue: 800, severity: "critical" },
  { assetTag: "AR-000014", assetName: "Logitech Rally 4K Camera", category: "AV Equipment", lastUsageDate: "2026-06-05", idleDays: 37, department: "Marketing", estimatedValue: 4200, severity: "warning" },
  { assetTag: "AR-000018", assetName: "AC Unit Daikin 3HP", category: "Furniture", lastUsageDate: "2026-06-15", idleDays: 27, department: "Operations", estimatedValue: 12000, severity: "warning" },
  { assetTag: "AR-000010", assetName: "Standing Desk Ergo Pro", category: "Furniture", lastUsageDate: "2026-06-22", idleDays: 20, department: "Engineering", estimatedValue: 1800, severity: "normal" },
  { assetTag: "AR-000006", assetName: "HP ZBook Studio G8", category: "IT Equipment", lastUsageDate: "2026-06-25", idleDays: 17, department: "Finance", estimatedValue: 3200, severity: "normal" },
];

export const MOCK_MAINTENANCE_TRENDS: MaintenanceTrend[] = [
  { assetTag: "AR-000003", assetName: "CNC Machine Model X", category: "Manufacturing", department: "Operations", totalRequests: 14, averageRepairDays: 3.2, totalCost: 28500, lastRepairDate: "2026-07-05", failureRate: 12 },
  { assetTag: "AR-000013", assetName: "Forklift Toyota 8FGU25", category: "Heavy Machinery", department: "Operations", totalRequests: 9, averageRepairDays: 4.1, totalCost: 15200, lastRepairDate: "2026-07-01", failureRate: 8 },
  { assetTag: "AR-000001", assetName: 'MacBook Pro 16"', category: "IT Equipment", department: "Engineering", totalRequests: 5, averageRepairDays: 2.5, totalCost: 4800, lastRepairDate: "2026-07-03", failureRate: 4 },
  { assetTag: "AR-000018", assetName: "AC Unit Daikin 3HP", category: "Furniture", department: "Operations", totalRequests: 7, averageRepairDays: 2.8, totalCost: 9600, lastRepairDate: "2026-07-08", failureRate: 6 },
  { assetTag: "AR-000008", assetName: "HP LaserJet Enterprise M611", category: "Printers", department: "Finance", totalRequests: 8, averageRepairDays: 1.8, totalCost: 3400, lastRepairDate: "2026-06-28", failureRate: 7 },
  { assetTag: "AR-000012", assetName: "Server Dell PowerEdge R750", category: "Servers", department: "Engineering", totalRequests: 3, averageRepairDays: 1.5, totalCost: 6200, lastRepairDate: "2026-07-09", failureRate: 2 },
  { assetTag: "AR-000011", assetName: "Cisco Webex Board Pro 75", category: "AV Equipment", department: "Operations", totalRequests: 2, averageRepairDays: 5.0, totalCost: 8000, lastRepairDate: "2026-06-10", failureRate: 2 },
  { assetTag: "AR-000009", assetName: 'iPad Pro 12.9"', category: "IT Equipment", department: "Marketing", totalRequests: 4, averageRepairDays: 2.0, totalCost: 2100, lastRepairDate: "2026-07-07", failureRate: 3 },
];

export const MOCK_RETIREMENT: RetirementForecast[] = [
  { assetTag: "AR-000020", assetName: "Disposal Batch Q1-2026", category: "IT Equipment", department: "IT", assetAge: 60, maintenanceFrequency: 0, conditionScore: 10, warrantyExpiry: "2024-12-31", remainingUsefulLifeMonths: 0, recommendedAction: "Dispose immediately", status: "Critical" },
  { assetTag: "AR-000019", assetName: "Retired Dell OptiPlex 7080", category: "IT Equipment", department: "IT", assetAge: 48, maintenanceFrequency: 3, conditionScore: 25, warrantyExpiry: "2025-06-30", remainingUsefulLifeMonths: 2, recommendedAction: "Retire and replace", status: "Critical" },
  { assetTag: "AR-000016", assetName: "3D Printer Ultimaker S7", category: "Manufacturing", department: "Engineering", assetAge: 30, maintenanceFrequency: 6, conditionScore: 35, warrantyExpiry: "2027-01-15", remainingUsefulLifeMonths: 6, recommendedAction: "Schedule major repair", status: "Replace Soon" },
  { assetTag: "AR-000003", assetName: "CNC Machine Model X", category: "Manufacturing", department: "Operations", assetAge: 72, maintenanceFrequency: 14, conditionScore: 40, warrantyExpiry: "2023-03-01", remainingUsefulLifeMonths: 8, recommendedAction: "Plan replacement this quarter", status: "Replace Soon" },
  { assetTag: "AR-000018", assetName: "AC Unit Daikin 3HP", category: "Furniture", department: "Operations", assetAge: 36, maintenanceFrequency: 7, conditionScore: 50, warrantyExpiry: "2026-12-31", remainingUsefulLifeMonths: 18, recommendedAction: "Monitor closely", status: "Monitor" },
  { assetTag: "AR-000013", assetName: "Forklift Toyota 8FGU25", category: "Heavy Machinery", department: "Operations", assetAge: 42, maintenanceFrequency: 9, conditionScore: 55, warrantyExpiry: "2025-09-30", remainingUsefulLifeMonths: 14, recommendedAction: "Schedule preventive overhaul", status: "Monitor" },
  { assetTag: "AR-000008", assetName: "HP LaserJet Enterprise M611", category: "Printers", department: "Finance", assetAge: 24, maintenanceFrequency: 8, conditionScore: 60, warrantyExpiry: "2027-06-30", remainingUsefulLifeMonths: 24, recommendedAction: "Continue monitoring", status: "Healthy" },
  { assetTag: "AR-000001", assetName: 'MacBook Pro 16"', category: "IT Equipment", department: "Engineering", assetAge: 18, maintenanceFrequency: 5, conditionScore: 72, warrantyExpiry: "2028-01-15", remainingUsefulLifeMonths: 36, recommendedAction: "No action needed", status: "Healthy" },
  { assetTag: "AR-000012", assetName: "Server Dell PowerEdge R750", category: "Servers", department: "Engineering", assetAge: 12, maintenanceFrequency: 3, conditionScore: 85, warrantyExpiry: "2029-03-01", remainingUsefulLifeMonths: 48, recommendedAction: "No action needed", status: "Healthy" },
  { assetTag: "AR-000011", assetName: "Cisco Webex Board Pro 75", category: "AV Equipment", department: "Operations", assetAge: 20, maintenanceFrequency: 2, conditionScore: 78, warrantyExpiry: "2028-06-30", remainingUsefulLifeMonths: 42, recommendedAction: "No action needed", status: "Healthy" },
];

export const MOCK_DEPARTMENT: DepartmentAllocation[] = [
  { department: "Engineering", assetsAllocated: 342, totalAssetValue: 2850000, sharedResourceUsage: 89, overdueReturns: 3, utilizationRate: 92 },
  { department: "Operations", assetsAllocated: 287, totalAssetValue: 4200000, sharedResourceUsage: 124, overdueReturns: 7, utilizationRate: 85 },
  { department: "Finance", assetsAllocated: 156, totalAssetValue: 980000, sharedResourceUsage: 32, overdueReturns: 1, utilizationRate: 78 },
  { department: "Marketing", assetsAllocated: 134, totalAssetValue: 750000, sharedResourceUsage: 67, overdueReturns: 2, utilizationRate: 80 },
  { department: "IT", assetsAllocated: 198, totalAssetValue: 1650000, sharedResourceUsage: 45, overdueReturns: 0, utilizationRate: 88 },
  { department: "HR", assetsAllocated: 67, totalAssetValue: 320000, sharedResourceUsage: 12, overdueReturns: 0, utilizationRate: 72 },
  { department: "Procurement", assetsAllocated: 45, totalAssetValue: 280000, sharedResourceUsage: 8, overdueReturns: 1, utilizationRate: 88 },
  { department: "Sales", assetsAllocated: 18, totalAssetValue: 150000, sharedResourceUsage: 5, overdueReturns: 0, utilizationRate: 75 },
];

export const MOCK_HEATMAP: BookingHeatmapSlot[] = (() => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const peakPattern: Record<string, number[]> = {
    Monday: [20, 85, 92, 88, 45, 70, 82, 75, 60, 25],
    Tuesday: [15, 80, 90, 95, 40, 75, 88, 80, 55, 20],
    Wednesday: [25, 88, 95, 90, 50, 72, 85, 78, 62, 30],
    Thursday: [18, 82, 88, 85, 42, 68, 80, 72, 58, 22],
    Friday: [12, 75, 82, 78, 38, 60, 70, 65, 45, 15],
  };
  const slots: BookingHeatmapSlot[] = [];
  days.forEach((day) => {
    hours.forEach((hour, hi) => {
      slots.push({ day, hour, utilization: peakPattern[day][hi] });
    });
  });
  return slots;
})();

export const MONTHLY_UTILIZATION: MonthlyData[] = [
  { month: "Jan", value: 78 }, { month: "Feb", value: 80 }, { month: "Mar", value: 82 },
  { month: "Apr", value: 85 }, { month: "May", value: 83 }, { month: "Jun", value: 87 },
  { month: "Jul", value: 86 }, { month: "Aug", value: 89 }, { month: "Sep", value: 88 },
  { month: "Oct", value: 90 }, { month: "Nov", value: 87 }, { month: "Dec", value: 87 },
];

export const MONTHLY_MAINTENANCE: MonthlyData[] = [
  { month: "Jan", value: 18 }, { month: "Feb", value: 22 }, { month: "Mar", value: 15 },
  { month: "Apr", value: 28 }, { month: "May", value: 20 }, { month: "Jun", value: 32 },
  { month: "Jul", value: 25 }, { month: "Aug", value: 30 }, { month: "Sep", value: 27 },
  { month: "Oct", value: 35 }, { month: "Nov", value: 22 }, { month: "Dec", value: 28 },
];

export const MAINTENANCE_TYPES = [
  { label: "Preventive", value: 45, color: "bg-emerald-500" },
  { label: "Corrective", value: 35, color: "bg-amber-500" },
  { label: "Emergency", value: 20, color: "bg-red-500" },
];

export const CATEGORY_FAILURE_RATES = [
  { category: "Manufacturing", rate: 12 },
  { category: "Heavy Machinery", rate: 8 },
  { category: "Printers", rate: 7 },
  { category: "IT Equipment", rate: 4 },
  { category: "Furniture", rate: 6 },
  { category: "AV Equipment", rate: 2 },
  { category: "Servers", rate: 2 },
  { category: "Vehicles", rate: 5 },
];
