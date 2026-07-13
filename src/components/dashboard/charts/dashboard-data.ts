import type { DashboardStats } from "@/lib/types";

export const defaultStats: DashboardStats = {
  totalAssets: 0, availableAssets: 0, allocatedAssets: 0,
  maintenanceAssets: 0, activeBookings: 0, pendingTransfers: 0,
  overdueReturns: 0, activeAllocations: 0,
};

export const overdueItems = [
  { tag: "AF-0114", name: "MacBook Pro 16\"", holder: "Marcus Webb", dept: "Engineering", returnDate: "Jul 8, 2026", days: 4, priority: "high" as const },
  { tag: "AF-0087", name: "Projector Epson EB-X51", holder: "Alex Rivera", dept: "Marketing", returnDate: "Jul 9, 2026", days: 3, priority: "warning" as const },
  { tag: "AF-0203", name: "Laptop Dell XPS 15", holder: "Priya Sharma", dept: "Operations", returnDate: "Jul 10, 2026", days: 2, priority: "warning" as const },
  { tag: "AF-0156", name: "Conference Speaker Set", holder: "Jordan Lee", dept: "HR", returnDate: "Jul 5, 2026", days: 7, priority: "critical" as const },
  { tag: "AF-0042", name: "Standing Desk Ergo", holder: "Kim Tanaka", dept: "Finance", returnDate: "Jun 30, 2026", days: 12, priority: "critical" as const },
];

export const activities = [
  { user: "SC", name: "Sarah Chen", action: "allocated Laptop Dell XPS to", entity: "Engineering dept", time: "2 min ago", color: "bg-emerald-500", type: "allocation" },
  { user: "MW", name: "Marcus Webb", action: "registered", entity: "5 new monitors", time: "18 min ago", color: "bg-primary", type: "registration" },
  { user: "PS", name: "Priya Sharma", action: "completed maintenance on", entity: "CNC Machine AF-0031", time: "45 min ago", color: "bg-amber-500", type: "maintenance" },
  { user: "AR", name: "Alex Rivera", action: "transferred projector to", entity: "Board Room", time: "1 hr ago", color: "bg-violet-500", type: "transfer" },
  { user: "JL", name: "Jordan Lee", action: "raised maintenance request for", entity: "AC Unit AF-0098", time: "2 hr ago", color: "bg-rose-500", type: "maintenance" },
  { user: "KT", name: "Kim Tanaka", action: "booked Conference Room B2 for", entity: "Jul 15, 10:00\u201311:00", time: "3 hr ago", color: "bg-blue-500", type: "booking" },
  { user: "RD", name: "Raj Deshmukh", action: "verified 12 assets in", entity: "Audit Cycle AC-004", time: "4 hr ago", color: "bg-emerald-500", type: "audit" },
  { user: "NP", name: "Nina Petrov", action: "approved transfer of", entity: "AF-0178 to Finance", time: "5 hr ago", color: "bg-primary", type: "transfer" },
];

export const notifications = [
  { id: 1, title: "Overdue Return Alert", desc: "MacBook Pro AF-0114 is 4 days overdue", type: "alert", time: "10 min ago", read: false },
  { id: 2, title: "Maintenance Approved", desc: "Request MR-0089 approved for CNC Machine", type: "success", time: "25 min ago", read: false },
  { id: 3, title: "Booking Confirmed", desc: "Room B2 reserved for Jul 15, 10\u201311 AM", type: "info", time: "1 hr ago", read: false },
  { id: 4, title: "Transfer Request", desc: "AF-0178 transfer to Finance pending approval", type: "warning", time: "2 hr ago", read: true },
  { id: 5, title: "Audit Discrepancy", desc: "AF-0201 marked missing in Cycle AC-003", type: "alert", time: "3 hr ago", read: true },
  { id: 6, title: "Asset Returned", desc: "AF-0155 returned by S. Chen in good condition", type: "success", time: "4 hr ago", read: true },
];

export const assetStatuses = [
  { label: "Available", value: 45, color: "#10B981" },
  { label: "Allocated", value: 32, color: "#0891B2" },
  { label: "Reserved", value: 8, color: "#2563EB" },
  { label: "Under Maintenance", value: 10, color: "#F59E0B" },
  { label: "Lost", value: 2, color: "#EF4444" },
  { label: "Retired", value: 2, color: "#64748B" },
  { label: "Disposed", value: 1, color: "#475569" },
];

export const bookings = [
  { room: "Conference Room A", owner: "Sarah Chen", start: "09:00", end: "10:00", status: "ongoing" },
  { room: "Meeting Room B2", owner: "Marcus Webb", start: "10:00", end: "11:00", status: "upcoming" },
  { room: "Board Room", owner: "Priya Sharma", start: "11:00", end: "12:30", status: "upcoming" },
  { room: "Huddle Room 1", owner: "Alex Rivera", start: "14:00", end: "15:00", status: "upcoming" },
  { room: "Training Lab", owner: "Jordan Lee", start: "15:30", end: "17:00", status: "upcoming" },
];

export const departments = [
  { name: "Engineering", assets: 156, employees: 42, maintenance: 8, overdue: 2 },
  { name: "Operations", assets: 134, employees: 38, maintenance: 5, overdue: 1 },
  { name: "Procurement", assets: 112, employees: 24, maintenance: 3, overdue: 0 },
  { name: "Finance", assets: 89, employees: 18, maintenance: 2, overdue: 1 },
  { name: "HR", assets: 67, employees: 15, maintenance: 1, overdue: 0 },
  { name: "Marketing", assets: 54, employees: 22, maintenance: 4, overdue: 1 },
];

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
