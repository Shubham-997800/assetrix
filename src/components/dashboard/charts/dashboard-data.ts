import type { DashboardStats } from "@/lib/types";

export const defaultStats: DashboardStats = {
  totalAssets: 0, availableAssets: 0, allocatedAssets: 0,
  maintenanceAssets: 0, activeBookings: 0, pendingTransfers: 0,
  overdueReturns: 0, activeAllocations: 0,
  recentActivity: [],
  assetsByDepartment: [],
  upcomingBookings: [],
  overdueItems: [],
};

export function buildKpis(s: DashboardStats) {
  return [
    { label: "Assets Available", value: s.availableAssets, change: `${s.totalAssets} total`, up: true, icon: "Package" as const, href: "/dashboard/assets" },
    { label: "Assets Allocated", value: s.allocatedAssets, change: `${s.activeAllocations} active`, up: true, icon: "ArrowLeftRight" as const, href: "/dashboard/allocations" },
    { label: "Maintenance Today", value: s.maintenanceAssets, change: "ongoing", up: false, icon: "Wrench" as const, href: "/dashboard/maintenance" },
    { label: "Active Bookings", value: s.activeBookings, change: "reservations", up: true, icon: "CalendarClock" as const, href: "/dashboard/bookings" },
    { label: "Pending Transfers", value: s.pendingTransfers, change: "awaiting action", up: false, icon: "ArrowRightLeft" as const, href: "/dashboard/allocations" },
    { label: "Overdue Returns", value: s.overdueReturns, change: `${s.overdueReturns} overdue`, up: false, icon: "RotateCcw" as const, href: "/dashboard/allocations" },
  ];
}
