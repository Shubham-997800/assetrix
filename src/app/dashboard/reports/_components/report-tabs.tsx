"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Package,
  CalendarCheck,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  File,
  Filter,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { TableDropdown } from "@/app/dashboard/assets/_components/table-dropdown";
import {
  STATUS_COLORS,
  SEVERITY_COLORS,
  type ReportTab,
  type RetirementStatus,
  type IdleSeverity,
  type AssetUtilization,
  type IdleAsset,
  type MaintenanceTrend,
  type RetirementForecast,
  type DepartmentAllocation,
  type BookingHeatmapSlot,
  type MonthlyData,
} from "./types";
import { assetApi, allocationApi, maintenanceApi, bookingApi, departmentApi, categoryApi, reportApi } from "@/lib/api";
import type { ApiError } from "@/lib/api";

const ITEMS_PER_PAGE = 10;
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MONTH_MS = 30 * DAY_MS;
const inputCls = "h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

interface ApiAsset {
  id: string;
  assetTag: string;
  name: string;
  category: { id: string; name: string } | null;
  department: { id: string; name: string } | null;
  status: "AVAILABLE" | "ALLOCATED" | "MAINTENANCE" | "RESERVED" | "RETIRED" | "LOST" | "DISPOSED";
  condition: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "DAMAGED";
  purchaseDate: string | null;
  purchasePrice: number | null;
  warrantyExpiry: string | null;
  sharedResource: boolean | null;
  bookableResource: boolean | null;
  updatedAt: string;
}

interface ApiAllocation {
  id: string;
  assetId: string;
  status: "ACTIVE" | "RETURNED" | "TRANSFERRED" | "OVERDUE";
  allocatedAt: string;
  returnedAt: string | null;
}

interface ApiMaintenanceTask {
  id: string;
  assetId: string;
  type: "PREVENTIVE" | "CORRECTIVE" | "PREDICTIVE" | "EMERGENCY";
  scheduledDate: string;
  completedAt: string | null;
  estimatedCost: number | null;
  actualCost: number | null;
  createdAt: string;
}

interface ApiBooking {
  id: string;
  assetId: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
}

interface ApiDepartment {
  id: string;
  name: string;
  code: string;
}

interface ApiCategory {
  id: string;
  name: string;
}

interface MaintenanceSlice {
  label: string;
  value: number;
  color: string;
}

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: T[] }).data;
  }
  return [];
}

function parseDate(value: string | null | undefined): number | null {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : t;
}

function diffDays(start: string, end: string): number {
  const s = parseDate(start);
  const e = parseDate(end);
  if (s === null || e === null) return 0;
  return Math.max(0, (e - s) / DAY_MS);
}

function last12Months(): { label: string; year: number; monthIndex: number }[] {
  const now = new Date();
  const result: { label: string; year: number; monthIndex: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ label: d.toLocaleString("en-US", { month: "short" }), year: d.getFullYear(), monthIndex: d.getMonth() });
  }
  return result;
}

function bookingHoursFor(assetId: string, bookings: ApiBooking[]): number {
  let hours = 0;
  for (const b of bookings) {
    if (b.assetId !== assetId || (b.status !== "APPROVED" && b.status !== "COMPLETED")) continue;
    const s = parseDate(b.startDate);
    const e = parseDate(b.endDate);
    if (s !== null && e !== null) hours += Math.max(0, (e - s) / HOUR_MS);
  }
  return Math.round(hours);
}

function computeUtilizationRows(assets: ApiAsset[], allocations: ApiAllocation[], tasks: ApiMaintenanceTask[], bookings: ApiBooking[]): AssetUtilization[] {
  const nowMs = Date.now();
  const windowStart = nowMs - 90 * DAY_MS;
  return assets.map((asset) => {
    const assetAllocs = allocations.filter((al) => al.assetId === asset.id);
    let daysAllocated = 0;
    for (const al of assetAllocs) {
      const start = parseDate(al.allocatedAt);
      if (start === null) continue;
      const end = parseDate(al.returnedAt) ?? nowMs;
      const overlapStart = Math.max(start, windowStart);
      const overlapEnd = Math.min(end, nowMs);
      if (overlapEnd > overlapStart) daysAllocated += (overlapEnd - overlapStart) / DAY_MS;
    }
    let utilizationPercent = Math.min(100, Math.round((daysAllocated / 90) * 100));
    const bookingHours = bookingHoursFor(asset.id, bookings);
    if (utilizationPercent === 0 && asset.bookableResource && bookingHours > 0) {
      utilizationPercent = Math.min(100, Math.round((bookingHours / 720) * 100));
    }
    let totalAllocationDays = 0;
    for (const al of assetAllocs) {
      const start = parseDate(al.allocatedAt);
      if (start === null) continue;
      const end = parseDate(al.returnedAt) ?? nowMs;
      totalAllocationDays += Math.max(0, (end - start) / DAY_MS);
    }
    const completed = tasks.filter((t) => t.assetId === asset.id && t.completedAt && t.scheduledDate);
    const averageDowntimeDays = completed.length
      ? Math.round((completed.reduce((sum, t) => sum + diffDays(t.scheduledDate, t.completedAt ?? ""), 0) / completed.length) * 10) / 10
      : 0;
    return {
      assetTag: asset.assetTag,
      assetName: asset.name,
      category: asset.category?.name ?? "—",
      department: asset.department?.name ?? "—",
      utilizationPercent,
      totalAllocationDays: Math.round(totalAllocationDays),
      averageDowntimeDays,
      bookingHours,
    };
  });
}

function computeIdleRows(assets: ApiAsset[], allocations: ApiAllocation[]): IdleAsset[] {
  const nowMs = Date.now();
  const rows: IdleAsset[] = [];
  for (const asset of assets) {
    if (asset.status !== "AVAILABLE") continue;
    const assetAllocs = allocations.filter((al) => al.assetId === asset.id);
    const usageDates: number[] = [];
    for (const al of assetAllocs) {
      const a = parseDate(al.allocatedAt);
      const r = parseDate(al.returnedAt);
      if (a !== null) usageDates.push(a);
      if (r !== null) usageDates.push(r);
    }
    const updated = parseDate(asset.updatedAt);
    if (updated !== null) usageDates.push(updated);
    const lastUsage = usageDates.length > 0 ? Math.max(...usageDates) : nowMs;
    const idleDays = Math.max(0, Math.floor((nowMs - lastUsage) / DAY_MS));
    const isIdle = assetAllocs.length === 0 || idleDays > 20;
    if (!isIdle) continue;
    const severity: IdleSeverity = idleDays >= 120 ? "critical" : idleDays >= 60 ? "severe" : idleDays >= 30 ? "warning" : "normal";
    rows.push({
      assetTag: asset.assetTag,
      assetName: asset.name,
      category: asset.category?.name ?? "—",
      department: asset.department?.name ?? "—",
      lastUsageDate: new Date(lastUsage).toISOString().slice(0, 10),
      idleDays,
      estimatedValue: asset.purchasePrice ?? 0,
      severity,
    });
  }
  return rows.sort((a, b) => b.idleDays - a.idleDays);
}

function computeMaintenanceTrends(assets: ApiAsset[], tasks: ApiMaintenanceTask[]): MaintenanceTrend[] {
  const assetById = new Map(assets.map((a) => [a.id, a]));
  const byAsset = new Map<string, ApiMaintenanceTask[]>();
  for (const t of tasks) {
    const list = byAsset.get(t.assetId) ?? [];
    list.push(t);
    byAsset.set(t.assetId, list);
  }
  const rows: MaintenanceTrend[] = [];
  for (const [assetId, list] of byAsset) {
    const asset = assetById.get(assetId);
    if (!asset) continue;
    const completed = list.filter((t) => t.completedAt && t.scheduledDate);
    const averageRepairDays = completed.length
      ? Math.round((completed.reduce((sum, t) => sum + diffDays(t.scheduledDate, t.completedAt ?? ""), 0) / completed.length) * 10) / 10
      : 0;
    const totalCost = list.reduce((sum, t) => sum + Number(t.actualCost ?? t.estimatedCost ?? 0), 0);
    rows.push({
      assetTag: asset.assetTag,
      assetName: asset.name,
      category: asset.category?.name ?? "—",
      department: asset.department?.name ?? "—",
      totalRequests: list.length,
      averageRepairDays,
      totalCost,
    });
  }
  return rows.sort((a, b) => b.totalRequests - a.totalRequests);
}

function computeMonthlyMaintenance(tasks: ApiMaintenanceTask[]): MonthlyData[] {
  return last12Months().map((m) => ({
    month: m.label,
    value: tasks.filter((t) => {
      const created = parseDate(t.createdAt);
      if (created === null) return false;
      const d = new Date(created);
      return d.getFullYear() === m.year && d.getMonth() === m.monthIndex;
    }).length,
  }));
}

function computeMonthlyUtilization(assets: ApiAsset[], allocations: ApiAllocation[]): MonthlyData[] {
  const months = last12Months();
  if (assets.length === 0) return months.map((m) => ({ month: m.label, value: 0 }));
  return months.map((m) => {
    const monthStart = new Date(m.year, m.monthIndex, 1).getTime();
    const monthEnd = new Date(m.year, m.monthIndex + 1, 1).getTime();
    const daysInMonth = (monthEnd - monthStart) / DAY_MS;
    let allocDays = 0;
    for (const al of allocations) {
      const start = parseDate(al.allocatedAt);
      if (start === null) continue;
      const end = parseDate(al.returnedAt) ?? Date.now();
      const overlapStart = Math.max(start, monthStart);
      const overlapEnd = Math.min(end, monthEnd);
      if (overlapEnd > overlapStart) allocDays += (overlapEnd - overlapStart) / DAY_MS;
    }
    return {
      month: m.label,
      value: Math.round(Math.min(100, (allocDays / (assets.length * daysInMonth)) * 100)),
    };
  });
}

function computeMaintenanceTypes(tasks: ApiMaintenanceTask[]): MaintenanceSlice[] {
  const definitions: { type: ApiMaintenanceTask["type"]; label: string; color: string }[] = [
    { type: "PREVENTIVE", label: "Preventive", color: "bg-emerald-500 stroke-emerald-500" },
    { type: "CORRECTIVE", label: "Corrective", color: "bg-amber-500 stroke-amber-500" },
    { type: "PREDICTIVE", label: "Predictive", color: "bg-blue-500 stroke-blue-500" },
    { type: "EMERGENCY", label: "Emergency", color: "bg-red-500 stroke-red-500" },
  ];
  const counts = new Map<string, number>();
  for (const t of tasks) counts.set(t.type, (counts.get(t.type) ?? 0) + 1);
  const total = tasks.length;
  return definitions.map((d) => ({
    label: d.label,
    value: total > 0 ? Math.round(((counts.get(d.type) ?? 0) / total) * 100) : 0,
    color: d.color,
  }));
}

function computeCategoryFailureRates(assets: ApiAsset[], tasks: ApiMaintenanceTask[], categories: ApiCategory[]): { category: string; rate: number }[] {
  const assetById = new Map(assets.map((a) => [a.id, a]));
  const counts = new Map<string, number>();
  for (const t of tasks) {
    const cat = assetById.get(t.assetId)?.category?.name;
    if (!cat) continue;
    counts.set(cat, (counts.get(cat) ?? 0) + 1);
  }
  const total = tasks.length;
  return categories.map((c) => ({
    category: c.name,
    rate: total > 0 ? Math.round(((counts.get(c.name) ?? 0) / total) * 100) : 0,
  }));
}

function computeRetirementRows(assets: ApiAsset[], tasks: ApiMaintenanceTask[]): RetirementForecast[] {
  const nowMs = Date.now();
  const taskCountByAsset = new Map<string, number>();
  for (const t of tasks) taskCountByAsset.set(t.assetId, (taskCountByAsset.get(t.assetId) ?? 0) + 1);
  const scores: Record<string, number> = { EXCELLENT: 90, GOOD: 75, FAIR: 55, POOR: 35, DAMAGED: 15 };
  const rows: RetirementForecast[] = [];
  for (const asset of assets) {
    if (!asset.purchaseDate) continue;
    const purchased = parseDate(asset.purchaseDate);
    if (purchased === null) continue;
    const assetAge = Math.max(0, Math.floor((nowMs - purchased) / MONTH_MS));
    const conditionScore = scores[asset.condition] ?? 50;
    const warrantyMs = parseDate(asset.warrantyExpiry);
    const warrantyExpiry = warrantyMs !== null ? new Date(warrantyMs).toISOString().slice(0, 10) : "—";
    const remaining = warrantyMs !== null ? Math.max(0, Math.floor((warrantyMs - nowMs) / MONTH_MS)) : null;
    let status: RetirementStatus;
    let recommendedAction: string;
    if ((remaining !== null && remaining <= 0) || conditionScore < 40) {
      status = "Critical";
      recommendedAction = "Replace";
    } else if ((remaining !== null && remaining <= 6) || conditionScore < 60) {
      status = "Replace Soon";
      recommendedAction = "Schedule replacement";
    } else if (remaining !== null && remaining <= 12) {
      status = "Monitor";
      recommendedAction = "Monitor";
    } else {
      status = "Healthy";
      recommendedAction = "No action";
    }
    rows.push({
      assetTag: asset.assetTag,
      assetName: asset.name,
      assetAge,
      maintenanceFrequency: taskCountByAsset.get(asset.id) ?? 0,
      conditionScore,
      warrantyExpiry,
      remainingUsefulLifeMonths: remaining ?? "—",
      status,
      recommendedAction,
    });
  }
  return rows.sort((a, b) => a.conditionScore - b.conditionScore);
}

function computeDepartmentRows(departments: ApiDepartment[], assets: ApiAsset[], allocations: ApiAllocation[]): DepartmentAllocation[] {
  const assetById = new Map(assets.map((a) => [a.id, a]));
  return departments.map((dept) => {
    const deptAssets = assets.filter((a) => a.department?.id === dept.id);
    const allocatedCount = deptAssets.filter((a) => a.status === "ALLOCATED").length;
    const totalAssetValue = deptAssets.reduce((sum, a) => sum + Number(a.purchasePrice ?? 0), 0);
    const sharedResourceUsage = deptAssets.filter((a) => a.sharedResource).length;
    const overdueReturns = allocations.filter((al) => al.status === "OVERDUE" && assetById.get(al.assetId)?.department?.id === dept.id).length;
    const utilizationRate = deptAssets.length ? Math.round((allocatedCount / deptAssets.length) * 100) : 0;
    return {
      department: dept.name,
      assetsAllocated: allocatedCount,
      totalAssetValue,
      sharedResourceUsage,
      overdueReturns,
      utilizationRate,
    };
  });
}

function computeKpis(assets: ApiAsset[], allocations: ApiAllocation[], tasks: ApiMaintenanceTask[], bookings: ApiBooking[]): { label: string; value: string; change: string; up: boolean; icon: React.ElementType }[] {
  const nowMs = Date.now();
  const totalAssets = assets.length;
  const allocatedCount = assets.filter((a) => a.status === "ALLOCATED").length;
  const utilizationRate = totalAssets > 0 ? Math.round((allocatedCount / totalAssets) * 100) : 0;

  const idleCutoff = nowMs - 30 * DAY_MS;
  const idleAssets = assets.filter((a) => {
    if (a.status !== "AVAILABLE") return false;
    const assetAllocs = allocations.filter((al) => al.assetId === a.id);
    if (assetAllocs.length === 0) return true;
    let latest = 0;
    for (const al of assetAllocs) {
      const t = parseDate(al.returnedAt ?? al.allocatedAt);
      if (t !== null && t > latest) latest = t;
    }
    return latest < idleCutoff;
  }).length;

  const maintenanceCost = tasks.reduce((sum, t) => sum + Number(t.actualCost ?? t.estimatedCost ?? 0), 0);
  const approvedCompleted = bookings.filter((b) => b.status === "APPROVED" || b.status === "COMPLETED").length;
  const bookingRate = bookings.length > 0 ? Math.round((approvedCompleted / bookings.length) * 100) : 0;

  const retirementDue = assets.filter((a) => {
    const t = parseDate(a.warrantyExpiry);
    return t !== null && t <= nowMs + 12 * MONTH_MS;
  }).length;

  const costInLakh = maintenanceCost / 100000;
  const costDisplay = costInLakh >= 1 ? `\u20B9${costInLakh.toFixed(1)}L` : `\u20B9${maintenanceCost.toLocaleString("en-IN")}`;

  const make = (label: string, value: number, display: string) => ({ label, value: display, change: "calculated live", up: value > 0 });

  return [
    { ...make("Total Assets", totalAssets, totalAssets.toLocaleString()), icon: Package },
    { ...make("Utilization Rate", utilizationRate, `${utilizationRate}%`), icon: BarChart3 },
    { ...make("Idle Assets", idleAssets, idleAssets.toLocaleString()), icon: Clock },
    { ...make("Maintenance Cost", maintenanceCost, costDisplay), icon: TrendingUp },
    { ...make("Booking Rate", bookingRate, `${bookingRate}%`), icon: CalendarCheck },
    { ...make("Retirement Due", retirementDue, retirementDue.toLocaleString()), icon: AlertTriangle },
  ];
}

function computeHeatmap(bookings: ApiBooking[]): { slots: BookingHeatmapSlot[]; peakText: string } {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const occupancy = new Map<string, number>();
  for (const b of bookings) {
    if (b.status !== "APPROVED" && b.status !== "COMPLETED") continue;
    const start = parseDate(b.startDate);
    const end = parseDate(b.endDate);
    if (start === null || end === null) continue;
    const hourKey = `${String(new Date(start).getHours()).padStart(2, "0")}:00`;
    if (!hours.includes(hourKey)) continue;
    const startDay = new Date(start);
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);
    let count = 0;
    for (let cur = startDay.getTime(); cur <= endDay.getTime() && count < 60; cur += DAY_MS, count++) {
      const dayIndex = (new Date(cur).getDay() + 6) % 7;
      if (dayIndex >= 5) continue;
      const key = `${days[dayIndex]}|${hourKey}`;
      occupancy.set(key, (occupancy.get(key) ?? 0) + 1);
    }
  }
  const maxOccupancy = occupancy.size > 0 ? Math.max(...occupancy.values()) : 0;
  const slots: BookingHeatmapSlot[] = [];
  days.forEach((day) => {
    hours.forEach((hour) => {
      const occ = occupancy.get(`${day}|${hour}`) ?? 0;
      slots.push({ day, hour, utilization: maxOccupancy > 0 ? Math.round((occ / maxOccupancy) * 100) : 0 });
    });
  });
  let peakText = "No booking data available";
  if (maxOccupancy > 0) {
    let peakDay = "";
    let peakHour = "";
    let peakOcc = 0;
    occupancy.forEach((occ, key) => {
      if (occ > peakOcc) {
        peakOcc = occ;
        const [day, hour] = key.split("|");
        peakDay = day;
        peakHour = hour;
      }
    });
    peakText = `Peak: ${peakHour} on ${peakDay} (${Math.round((peakOcc / maxOccupancy) * 100)}%)`;
  }
  return { slots, peakText };
}

export function ReportTabs() {
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [assets, setAssets] = useState<ApiAsset[]>([]);
  const [allocations, setAllocations] = useState<ApiAllocation[]>([]);
  const [tasks, setTasks] = useState<ApiMaintenanceTask[]>([]);
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [assetRes, allocationRes, maintenanceRes, bookingRes, departmentRes, categoryRes] = await Promise.all([
        assetApi.list({ limit: 1000 }),
        allocationApi.list({ limit: 1000 }),
        maintenanceApi.list({ limit: 1000 }),
        bookingApi.list({ limit: 1000 }),
        departmentApi.list(),
        categoryApi.list(),
      ]);
      setAssets(asArray<ApiAsset>(assetRes.data));
      setAllocations(asArray<ApiAllocation>(allocationRes.data));
      setTasks(asArray<ApiMaintenanceTask>(maintenanceRes.data));
      setBookings(asArray<ApiBooking>(bookingRes.data));
      setDepartments(asArray<ApiDepartment>(departmentRes.data));
      setCategories(asArray<ApiCategory>(categoryRes.data));
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const departmentsList = useMemo(() => departments.map((d) => d.name), [departments]);
  const categoriesList = useMemo(() => categories.map((c) => c.name), [categories]);

  const utilizationRows = useMemo(() => computeUtilizationRows(assets, allocations, tasks, bookings), [assets, allocations, tasks, bookings]);
  const idleRows = useMemo(() => computeIdleRows(assets, allocations), [assets, allocations]);
  const maintenanceTrends = useMemo(() => computeMaintenanceTrends(assets, tasks), [assets, tasks]);
  const monthlyMaintenance = useMemo(() => computeMonthlyMaintenance(tasks), [tasks]);
  const monthlyUtilization = useMemo(() => computeMonthlyUtilization(assets, allocations), [assets, allocations]);
  const maintenanceTypes = useMemo(() => computeMaintenanceTypes(tasks), [tasks]);
  const categoryFailureRates = useMemo(() => computeCategoryFailureRates(assets, tasks, categories), [assets, tasks, categories]);
  const retirementRows = useMemo(() => computeRetirementRows(assets, tasks), [assets, tasks]);
  const departmentRows = useMemo(() => computeDepartmentRows(departments, assets, allocations), [departments, assets, allocations]);
  const heatmap = useMemo(() => computeHeatmap(bookings), [bookings]);

  const kpis = useMemo(() => computeKpis(assets, allocations, tasks, bookings), [assets, allocations, tasks, bookings]);

  const tabs: { key: ReportTab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { key: "utilization", label: "Asset Utilization", icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { key: "idle", label: "Idle Assets", icon: <Clock className="h-3.5 w-3.5" /> },
    { key: "maintenance", label: "Maintenance Trends", icon: <RefreshCw className="h-3.5 w-3.5" /> },
    { key: "retirement", label: "Retirement Forecast", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    { key: "department", label: "Department Allocation", icon: <Package className="h-3.5 w-3.5" /> },
    { key: "heatmap", label: "Booking Heatmap", icon: <CalendarCheck className="h-3.5 w-3.5" /> },
    { key: "export", label: "Export", icon: <Download className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/20 p-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); setSearch(""); }}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${activeTab === tab.key ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-card py-20">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-20">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button size="sm" variant="outline" className="btn-enterprise" onClick={fetchData}>
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      ) : (
        <>
          {activeTab !== "export" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
                <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${inputCls} pl-9`} />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <TableDropdown label="" options={["All", ...departmentsList].map((d) => ({ label: d, value: d }))} value={deptFilter} onChange={(v) => { setDeptFilter(v); setPage(1); }} placeholder="All Depts" />
                <TableDropdown label="" options={["All", ...categoriesList].map((c) => ({ label: c, value: c }))} value={catFilter} onChange={(v) => { setCatFilter(v); setPage(1); }} placeholder="All Categories" />
              </div>
            </div>
          )}

          {activeTab === "overview" && <OverviewTab kpis={kpis} deptData={departmentRows} maintenanceTypes={maintenanceTypes} monthlyUtilization={monthlyUtilization} />}
          {activeTab === "utilization" && <UtilizationTab search={search} deptFilter={deptFilter} catFilter={catFilter} page={page} setPage={setPage} data={utilizationRows} deptData={departmentRows} monthlyUtilization={monthlyUtilization} />}
          {activeTab === "idle" && <IdleTab search={search} deptFilter={deptFilter} page={page} setPage={setPage} data={idleRows} />}
          {activeTab === "maintenance" && <MaintenanceTab search={search} catFilter={catFilter} page={page} setPage={setPage} data={maintenanceTrends} monthlyMaintenance={monthlyMaintenance} maintenanceTypes={maintenanceTypes} categoryFailureRates={categoryFailureRates} />}
          {activeTab === "retirement" && <RetirementTab search={search} statusFilter={statusFilter} setStatusFilter={setStatusFilter} page={page} setPage={setPage} data={retirementRows} />}
          {activeTab === "department" && <DepartmentTab search={search} page={page} setPage={setPage} data={departmentRows} />}
          {activeTab === "heatmap" && <HeatmapTab data={heatmap.slots} peakText={heatmap.peakText} />}
          {activeTab === "export" && <ExportTab departmentsList={departmentsList} categoriesList={categoriesList} />}
        </>
      )}
    </div>
  );
}

function OverviewTab({ kpis, deptData, maintenanceTypes, monthlyUtilization }: {
  kpis: { label: string; value: string; change: string; up: boolean; icon: React.ElementType }[];
  deptData: DepartmentAllocation[];
  maintenanceTypes: MaintenanceSlice[];
  monthlyUtilization: MonthlyData[];
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <kpi.icon className="h-4 w-4 text-primary" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <DeptBarChart data={deptData} />
        <MaintenanceDonut data={maintenanceTypes} />
      </div>
      <MonthlyLineChart data={monthlyUtilization} title="Utilization Trend" subtitle="Monthly utilization percentage" />
    </>
  );
}

function UtilizationTab({ search, deptFilter, catFilter, page, setPage, data, deptData, monthlyUtilization }: {
  search: string;
  deptFilter: string;
  catFilter: string;
  page: number;
  setPage: (p: number) => void;
  data: AssetUtilization[];
  deptData: DepartmentAllocation[];
  monthlyUtilization: MonthlyData[];
}) {
  const filtered = useMemo(() => {
    let items = [...data];
    if (deptFilter !== "All") items = items.filter((a) => a.department === deptFilter);
    if (catFilter !== "All") items = items.filter((a) => a.category === catFilter);
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((a) => a.assetName.toLowerCase().includes(s) || a.assetTag.toLowerCase().includes(s)); }
    return items.sort((a, b) => b.utilizationPercent - a.utilizationPercent);
  }, [search, deptFilter, catFilter, data]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <DeptBarChart data={deptData} />
        <MonthlyLineChart data={monthlyUtilization} title="Utilization Trend" subtitle="Year-over-year" />
      </div>
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-foreground">Asset Utilization Rankings</h3>
          <p className="text-xs text-muted-foreground">All assets sorted by utilization percentage</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Asset</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Dept</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Utilization</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Alloc Days</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Booking Hrs</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Downtime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((a) => (
              <TableRow key={a.assetTag} className="border-border hover:bg-muted/20">
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.assetName}</p>
                    <p className="text-[11px] text-muted-foreground">{a.assetTag}</p>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.category}</span></TableCell>
                <TableCell><span className="text-xs text-foreground">{a.department}</span></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted">
                      <div className={`h-full rounded-full ${a.utilizationPercent >= 80 ? "bg-emerald-500" : a.utilizationPercent >= 50 ? "bg-primary" : "bg-amber-500"}`} style={{ width: `${a.utilizationPercent}%` }} />
                    </div>
                    <span className="text-xs font-medium text-foreground">{a.utilizationPercent}%</span>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.totalAllocationDays}</span></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.bookingHours.toLocaleString()}</span></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.averageDowntimeDays}d</span></TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
      </div>
    </>
  );
}

function IdleTab({ search, deptFilter, page, setPage, data }: { search: string; deptFilter: string; page: number; setPage: (p: number) => void; data: IdleAsset[] }) {
  const filtered = useMemo(() => {
    let items = [...data];
    if (deptFilter !== "All") items = items.filter((a) => a.department === deptFilter);
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((a) => a.assetName.toLowerCase().includes(s) || a.assetTag.toLowerCase().includes(s)); }
    return items.sort((a, b) => b.idleDays - a.idleDays);
  }, [search, deptFilter, data]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">Idle Assets</h3>
        <p className="text-xs text-muted-foreground">Assets with no activity in the last 20+ days</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-xs font-medium text-muted-foreground">Asset</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Last Used</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Days Idle</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Dept</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Est. Value</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((a) => (
            <TableRow key={a.assetTag} className="border-border hover:bg-muted/20">
              <TableCell>
                <div>
                  <p className="text-sm font-medium text-foreground">{a.assetName}</p>
                  <p className="text-[11px] text-muted-foreground">{a.assetTag}</p>
                </div>
              </TableCell>
              <TableCell><span className="text-xs text-muted-foreground">{a.category}</span></TableCell>
              <TableCell><span className="text-xs text-muted-foreground">{a.lastUsageDate}</span></TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${SEVERITY_COLORS[a.severity]}`}>
                  {a.idleDays} days
                </span>
              </TableCell>
              <TableCell><span className="text-xs text-foreground">{a.department}</span></TableCell>
              <TableCell><span className="text-xs text-foreground">{"\u20B9"}{a.estimatedValue.toLocaleString("en-IN")}</span></TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {a.severity === "severe" ? "Retire Asset" : a.severity === "critical" ? "Reallocate or Retire" : a.severity === "warning" ? "Convert to Shared" : "Monitor"}
                </span>
              </TableCell>
            </TableRow>
          ))}
          {paged.length === 0 && (
            <TableRow className="border-border hover:bg-transparent">
              <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No records found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
    </div>
  );
}

function MaintenanceTab({ search, catFilter, page, setPage, data, monthlyMaintenance, maintenanceTypes, categoryFailureRates }: {
  search: string;
  catFilter: string;
  page: number;
  setPage: (p: number) => void;
  data: MaintenanceTrend[];
  monthlyMaintenance: MonthlyData[];
  maintenanceTypes: MaintenanceSlice[];
  categoryFailureRates: { category: string; rate: number }[];
}) {
  const filtered = useMemo(() => {
    let items = [...data];
    if (catFilter !== "All") items = items.filter((a) => a.category === catFilter);
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((a) => a.assetName.toLowerCase().includes(s) || a.assetTag.toLowerCase().includes(s)); }
    return items.sort((a, b) => b.totalRequests - a.totalRequests);
  }, [search, catFilter, data]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const maxRate = Math.max(1, ...categoryFailureRates.map((c) => c.rate));

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart data={monthlyMaintenance} title="Monthly Maintenance Requests" subtitle="Total requests per month" />
        <MaintenanceDonut data={maintenanceTypes} />
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Category Failure Rates</h3>
        <div className="space-y-3">
          {[...categoryFailureRates].sort((a, b) => b.rate - a.rate).map((c) => (
            <div key={c.category} className="flex items-center gap-3">
              <span className="w-32 text-xs text-muted-foreground">{c.category}</span>
              <div className="flex-1 h-4 rounded-sm bg-muted/50 overflow-hidden">
                <div className="h-full rounded-sm bg-primary/70" style={{ width: `${(c.rate / maxRate) * 100}%` }} />
              </div>
              <span className="w-10 text-right text-xs font-medium text-foreground">{c.rate}%</span>
            </div>
          ))}
          {categoryFailureRates.length === 0 && <p className="text-sm text-muted-foreground">No data available</p>}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-foreground">Top Problematic Assets</h3>
          <p className="text-xs text-muted-foreground">Assets with highest maintenance frequency</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Asset</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Requests</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Avg Repair</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Total Cost</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Dept</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((a, i) => (
              <TableRow key={a.assetTag} className="border-border hover:bg-muted/20">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.assetName}</p>
                      <p className="text-[11px] text-muted-foreground">{a.assetTag}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.category}</span></TableCell>
                <TableCell><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{a.totalRequests}</span></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.averageRepairDays} days</span></TableCell>
                <TableCell><span className="text-xs text-foreground">{"\u20B9"}{a.totalCost.toLocaleString("en-IN")}</span></TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.department}</span></TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
      </div>
    </>
  );
}

function RetirementTab({ search, statusFilter, setStatusFilter, page, setPage, data }: { search: string; statusFilter: string; setStatusFilter: (v: string) => void; page: number; setPage: (p: number) => void; data: RetirementForecast[] }) {
  const filtered = useMemo(() => {
    let items = [...data];
    if (statusFilter !== "All") items = items.filter((a) => a.status === statusFilter);
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((a) => a.assetName.toLowerCase().includes(s) || a.assetTag.toLowerCase().includes(s)); }
    return items;
  }, [search, statusFilter, data]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <TableDropdown label="" options={["All", "Healthy", "Monitor", "Replace Soon", "Critical"].map((s) => ({ label: s, value: s }))} value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} placeholder="All Statuses" />
      </div>
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-foreground">Retirement Forecast</h3>
          <p className="text-xs text-muted-foreground">Assets predicted to reach end-of-life</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Asset</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Age (mo)</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Maint. Freq</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Condition</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Warranty</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Remaining Life</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((a) => (
              <TableRow key={a.assetTag} className="border-border hover:bg-muted/20">
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.assetName}</p>
                    <p className="text-[11px] text-muted-foreground">{a.assetTag}</p>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.assetAge}</span></TableCell>
                <TableCell><span className="text-xs text-foreground">{a.maintenanceFrequency}</span></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-muted">
                      <div className={`h-full rounded-full ${a.conditionScore >= 70 ? "bg-emerald-500" : a.conditionScore >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${a.conditionScore}%` }} />
                    </div>
                    <span className="text-xs text-foreground">{a.conditionScore}%</span>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.warrantyExpiry}</span></TableCell>
                <TableCell><span className="text-xs text-foreground">{a.remainingUsefulLifeMonths === "—" ? "—" : `${a.remainingUsefulLifeMonths} months`}</span></TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[a.status as RetirementStatus]}`}>
                    {a.status}
                  </span>
                </TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.recommendedAction}</span></TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
      </div>
    </>
  );
}

function DepartmentTab({ search, page, setPage, data }: { search: string; page: number; setPage: (p: number) => void; data: DepartmentAllocation[] }) {
  const filtered = useMemo(() => {
    let items = [...data];
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((d) => d.department.toLowerCase().includes(s)); }
    return items.sort((a, b) => b.assetsAllocated - a.assetsAllocated);
  }, [search, data]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <DeptBarChart data={data} />
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-foreground">Department Allocation Summary</h3>
          <p className="text-xs text-muted-foreground">Resource distribution across departments</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Department</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Assets</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Total Value</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Shared Usage</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Overdue</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((d) => (
              <TableRow key={d.department} className="border-border hover:bg-muted/20">
                <TableCell><span className="text-sm font-medium text-foreground">{d.department}</span></TableCell>
                <TableCell><span className="text-xs text-foreground">{d.assetsAllocated}</span></TableCell>
                <TableCell><span className="text-xs text-foreground">{"\u20B9"}{(d.totalAssetValue / 100000).toFixed(1)}L</span></TableCell>
                <TableCell><span className="text-xs text-foreground">{d.sharedResourceUsage}</span></TableCell>
                <TableCell>
                  <span className={`text-xs font-medium ${d.overdueReturns > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {d.overdueReturns}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${d.utilizationRate}%` }} />
                    </div>
                    <span className="text-xs font-medium text-foreground">{d.utilizationRate}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
      </div>
    </>
  );
}

function HeatmapTab({ data, peakText }: { data: BookingHeatmapSlot[]; peakText: string }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const getHeatColor = (val: number) => {
    if (val >= 90) return "bg-primary text-primary-foreground";
    if (val >= 75) return "bg-primary/70 text-primary-foreground";
    if (val >= 50) return "bg-primary/50 text-foreground";
    if (val >= 25) return "bg-primary/25 text-foreground";
    return "bg-primary/10 text-muted-foreground";
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Booking Heatmap</h3>
        <p className="text-xs text-muted-foreground">Resource utilization by day and hour</p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: `80px repeat(${hours.length}, 1fr)` }}>
            <div />
            {hours.map((h) => (
              <div key={h} className="text-center text-[10px] font-medium text-muted-foreground py-1">{h}</div>
            ))}
            {days.map((day) => (
              <React.Fragment key={day}>
                <div className="text-[11px] text-muted-foreground flex items-center pr-2">{day}</div>
                {hours.map((hour) => {
                  const slot = data.find((s) => s.day === day && s.hour === hour);
                  const val = slot?.utilization || 0;
                  return (
                    <div key={`${day}-${hour}`} className={`rounded-sm p-2 text-center text-[10px] font-medium ${getHeatColor(val)} transition-colors`}>
                      {val}%
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-[10px] text-muted-foreground">
            <span>Low</span>
            <div className="flex gap-1">
              <div className="h-3 w-6 rounded-sm bg-primary/10" />
              <div className="h-3 w-6 rounded-sm bg-primary/25" />
              <div className="h-3 w-6 rounded-sm bg-primary/50" />
              <div className="h-3 w-6 rounded-sm bg-primary/70" />
              <div className="h-3 w-6 rounded-sm bg-primary" />
            </div>
            <span>High</span>
            <span className="ml-4 text-primary font-medium">{peakText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportTab({ departmentsList, categoriesList }: { departmentsList: string[]; categoriesList: string[] }) {
  const [selectedFormat, setSelectedFormat] = useState("CSV");
  const [generating, setGenerating] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Statuses");
  const formats = [
    { label: "CSV", desc: "Comma-separated values for data analysis", icon: FileText, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { label: "PDF", desc: "Formatted report for sharing and printing", icon: File, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
    { label: "Excel", desc: "Spreadsheet with charts and pivots", icon: FileSpreadsheet, color: "bg-primary/10 text-primary" },
  ];

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const payload: Record<string, unknown> = {
        type: "custom",
        format: selectedFormat.toLowerCase(),
        department: department === "All Departments" ? undefined : department,
        category: category === "All Categories" ? undefined : category,
        status: status === "All Statuses" ? undefined : status,
      };
      if (startDate) payload.startDate = startDate;
      if (endDate) payload.endDate = endDate;
      const res = await reportApi.generate(payload);
      const report = res.data as { id?: string } | undefined;
      if (report?.id) {
        await reportApi.download(report.id);
      }
    } catch (err) {
      const apiErr = err as ApiError;
      alert(apiErr.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedFormat("CSV");
    setStartDate("");
    setEndDate("");
    setDepartment("All Departments");
    setCategory("All Categories");
    setStatus("All Statuses");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {formats.map((f) => (
          <button key={f.label} onClick={() => setSelectedFormat(f.label)}
            className={`rounded-xl border bg-card p-5 text-left transition-colors ${selectedFormat === f.label ? "border-primary ring-1 ring-primary/20" : "border-border hover:bg-muted/20"}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.color}`}>
              <f.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{f.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Report Configuration</h3>
        <p className="text-xs text-muted-foreground">Configure date range and filters for your export</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`${inputCls} w-full`} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`${inputCls} w-full`} />
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <TableDropdown label="Department" options={["All Departments", ...departmentsList].map((d) => ({ label: d, value: d }))} value={department} onChange={setDepartment} placeholder="All Depts" />
          <TableDropdown label="Category" options={["All Categories", ...categoriesList].map((c) => ({ label: c, value: c }))} value={category} onChange={setCategory} placeholder="All Categories" />
          <TableDropdown label="Status" options={["All Statuses", "Active", "Idle", "Under Maintenance", "Retired"].map((s) => ({ label: s, value: s }))} value={status} onChange={setStatus} placeholder="All Statuses" />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button size="sm" className="btn-enterprise" onClick={handleGenerate} disabled={generating}>
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} {generating ? "Generating..." : "Generate Report"}
          </Button>
          <Button variant="outline" size="sm" className="btn-enterprise" onClick={handleReset}><Filter className="h-3.5 w-3.5" /> Reset Filters</Button>
        </div>
      </div>
    </div>
  );
}

function DeptBarChart({ data }: { data: DepartmentAllocation[] }) {
  const rows = [...data].sort((a, b) => b.utilizationRate - a.utilizationRate);
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Utilization by Department</h3>
        <p className="text-xs text-muted-foreground">Current utilization rates</p>
      </div>
      <div className="mt-5 space-y-3">
        {rows.map((d) => (
          <div key={d.department} className="flex items-center gap-3">
            <span className="w-28 text-xs text-muted-foreground">{d.department}</span>
            <div className="flex-1 h-5 rounded-sm bg-muted/50 overflow-hidden">
              <div className="h-full rounded-sm bg-primary/70 transition-all" style={{ width: `${d.utilizationRate}%` }} />
            </div>
            <span className="w-10 text-right text-xs font-medium text-foreground">{d.utilizationRate}%</span>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No data available</p>}
      </div>
    </div>
  );
}

function MaintenanceDonut({ data }: { data: MaintenanceSlice[] }) {
  const offsets = data.reduce<number[]>((acc, _s, idx) => {
    const lastOffset = acc.length > 0 ? acc[acc.length - 1] + data[acc.length - 1].value : 0;
    acc.push(idx === 0 ? 0 : lastOffset);
    return acc;
  }, []);
  const total = data.reduce((sum, s) => sum + s.value, 0);
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Maintenance Type Distribution</h3>
        <p className="text-xs text-muted-foreground">Breakdown by request type</p>
      </div>
      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {data.map((s, i) => {
              const dash = (s.value / 100) * 100;
              return (
                <circle key={s.label} cx="18" cy="18" r="15.915" fill="none" className={s.color} strokeOpacity="0.8" strokeWidth="3.5" strokeDasharray={`${dash} ${100 - dash}`} strokeDashoffset={`${-offsets[i]}`} />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">{total}%</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
              <span className="flex-1 text-sm text-muted-foreground">{s.label}</span>
              <span className="text-sm font-medium text-foreground">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonthlyLineChart({ data, title, subtitle }: { data: { month: string; value: number }[]; title: string; subtitle: string }) {
  const values = data.map((d) => d.value);
  const min = Math.min(...values) - 5;
  const max = Math.max(...values) + 5;
  const range = max - min;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="mt-5 relative h-40 sm:h-48">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available</p>
        ) : (
          <svg viewBox="0 0 120 80" className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`M0,${80 - ((values[0] - min) / range) * 70} ${values.map((v, i) => `L${i * (120 / (values.length - 1))},${80 - ((v - min) / range) * 70}`).join(" ")} L120,80 L0,80 Z`} fill={`url(#grad-${title})`} />
            <path d={`M0,${80 - ((values[0] - min) / range) * 70} ${values.map((v, i) => `L${i * (120 / (values.length - 1))},${80 - ((v - min) / range) * 70}`).join(" ")}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
            {values.map((v, i) => (
              <circle key={i} cx={i * (120 / (values.length - 1))} cy={80 - ((v - min) / range) * 70} r="1.5" fill="var(--primary)" />
            ))}
          </svg>
        )}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">{data.map((d) => <span key={d.month}>{d.month}</span>)}</div>
    </div>
  );
}

function BarChart({ data, title, subtitle }: { data: { month: string; value: number }[]; title: string; subtitle: string }) {
  const max = data.length > 0 ? Math.max(...data.map((d) => d.value)) + 5 : 5;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="mt-5 flex items-end gap-1.5 h-40 sm:h-48">
        {data.map((d, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-primary/20 transition-colors hover:bg-primary/30" style={{ height: `${(d.value / max) * 100}%` }}>
            <div className="rounded-t-sm bg-primary/70 transition-colors hover:bg-primary" style={{ height: "100%" }} />
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-muted-foreground">No data available</p>}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">{data.map((d) => <span key={d.month}>{d.month}</span>)}</div>
    </div>
  );
}

function Pagination({ page, totalPages, total, setPage }: { page: number; totalPages: number; total: number; setPage: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-3">
      <span className="text-xs text-muted-foreground">
        Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, total)} of {total}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs text-foreground">{page} / {totalPages}</span>
        <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
