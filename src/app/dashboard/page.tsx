"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCountUp } from "@/hooks/use-count-up";
import { dashboardApi, ApiError } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import {
  Package,
  ArrowLeftRight,
  Wrench,
  CalendarClock,
  ArrowRightLeft,
  RotateCcw,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Bell,
  CheckCircle2,
  Circle,
  ChevronRight,
  Send,
  CalendarDays,
  Users,
  Building2,
  BarChart3,
  ClipboardCheck,
  X,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const defaultStats: DashboardStats = {
  totalAssets: 0, availableAssets: 0, allocatedAssets: 0,
  maintenanceAssets: 0, activeBookings: 0, pendingTransfers: 0,
  overdueReturns: 0, activeAllocations: 0,
};

function buildKpis(s: DashboardStats) {
  return [
    { label: "Assets Available", value: s.availableAssets, change: `${s.totalAssets} total`, up: true, icon: Package, href: "/dashboard/assets" },
    { label: "Assets Allocated", value: s.allocatedAssets, change: `${s.activeAllocations} active`, up: true, icon: ArrowLeftRight, href: "/dashboard/allocations" },
    { label: "Maintenance Today", value: s.maintenanceAssets, change: "ongoing", up: false, icon: Wrench, href: "/dashboard/maintenance" },
    { label: "Active Bookings", value: s.activeBookings, change: "reservations", up: true, icon: CalendarClock, href: "/dashboard/bookings" },
    { label: "Pending Transfers", value: s.pendingTransfers, change: "awaiting action", up: false, icon: ArrowRightLeft, href: "/dashboard/allocations" },
    { label: "Overdue Returns", value: s.overdueReturns, change: `${s.overdueReturns} overdue`, up: false, icon: RotateCcw, href: "/dashboard/allocations" },
  ];
}

const overdueItems = [
  { tag: "AF-0114", name: "MacBook Pro 16\"", holder: "Marcus Webb", dept: "Engineering", returnDate: "Jul 8, 2026", days: 4, priority: "high" as const },
  { tag: "AF-0087", name: "Projector Epson EB-X51", holder: "Alex Rivera", dept: "Marketing", returnDate: "Jul 9, 2026", days: 3, priority: "warning" as const },
  { tag: "AF-0203", name: "Laptop Dell XPS 15", holder: "Priya Sharma", dept: "Operations", returnDate: "Jul 10, 2026", days: 2, priority: "warning" as const },
  { tag: "AF-0156", name: "Conference Speaker Set", holder: "Jordan Lee", dept: "HR", returnDate: "Jul 5, 2026", days: 7, priority: "critical" as const },
  { tag: "AF-0042", name: "Standing Desk Ergo", holder: "Kim Tanaka", dept: "Finance", returnDate: "Jun 30, 2026", days: 12, priority: "critical" as const },
];

const activities = [
  { user: "SC", name: "Sarah Chen", action: "allocated Laptop Dell XPS to", entity: "Engineering dept", time: "2 min ago", color: "bg-emerald-500", type: "allocation" },
  { user: "MW", name: "Marcus Webb", action: "registered", entity: "5 new monitors", time: "18 min ago", color: "bg-primary", type: "registration" },
  { user: "PS", name: "Priya Sharma", action: "completed maintenance on", entity: "CNC Machine AF-0031", time: "45 min ago", color: "bg-amber-500", type: "maintenance" },
  { user: "AR", name: "Alex Rivera", action: "transferred projector to", entity: "Board Room", time: "1 hr ago", color: "bg-violet-500", type: "transfer" },
  { user: "JL", name: "Jordan Lee", action: "raised maintenance request for", entity: "AC Unit AF-0098", time: "2 hr ago", color: "bg-rose-500", type: "maintenance" },
  { user: "KT", name: "Kim Tanaka", action: "booked Conference Room B2 for", entity: "Jul 15, 10:00–11:00", time: "3 hr ago", color: "bg-blue-500", type: "booking" },
  { user: "RD", name: "Raj Deshmukh", action: "verified 12 assets in", entity: "Audit Cycle AC-004", time: "4 hr ago", color: "bg-emerald-500", type: "audit" },
  { user: "NP", name: "Nina Petrov", action: "approved transfer of", entity: "AF-0178 to Finance", time: "5 hr ago", color: "bg-primary", type: "transfer" },
];

const notifications = [
  { id: 1, title: "Overdue Return Alert", desc: "MacBook Pro AF-0114 is 4 days overdue", type: "alert", time: "10 min ago", read: false },
  { id: 2, title: "Maintenance Approved", desc: "Request MR-0089 approved for CNC Machine", type: "success", time: "25 min ago", read: false },
  { id: 3, title: "Booking Confirmed", desc: "Room B2 reserved for Jul 15, 10–11 AM", type: "info", time: "1 hr ago", read: false },
  { id: 4, title: "Transfer Request", desc: "AF-0178 transfer to Finance pending approval", type: "warning", time: "2 hr ago", read: true },
  { id: 5, title: "Audit Discrepancy", desc: "AF-0201 marked missing in Cycle AC-003", type: "alert", time: "3 hr ago", read: true },
  { id: 6, title: "Asset Returned", desc: "AF-0155 returned by S. Chen in good condition", type: "success", time: "4 hr ago", read: true },
];

const assetStatuses = [
  { label: "Available", value: 45, color: "#10B981" },
  { label: "Allocated", value: 32, color: "#0891B2" },
  { label: "Reserved", value: 8, color: "#2563EB" },
  { label: "Under Maintenance", value: 10, color: "#F59E0B" },
  { label: "Lost", value: 2, color: "#EF4444" },
  { label: "Retired", value: 2, color: "#64748B" },
  { label: "Disposed", value: 1, color: "#475569" },
];

const bookings = [
  { room: "Conference Room A", owner: "Sarah Chen", start: "09:00", end: "10:00", status: "ongoing" },
  { room: "Meeting Room B2", owner: "Marcus Webb", start: "10:00", end: "11:00", status: "upcoming" },
  { room: "Board Room", owner: "Priya Sharma", start: "11:00", end: "12:30", status: "upcoming" },
  { room: "Huddle Room 1", owner: "Alex Rivera", start: "14:00", end: "15:00", status: "upcoming" },
  { room: "Training Lab", owner: "Jordan Lee", start: "15:30", end: "17:00", status: "upcoming" },
];

const departments = [
  { name: "Engineering", assets: 156, employees: 42, maintenance: 8, overdue: 2 },
  { name: "Operations", assets: 134, employees: 38, maintenance: 5, overdue: 1 },
  { name: "Procurement", assets: 112, employees: 24, maintenance: 3, overdue: 0 },
  { name: "Finance", assets: 89, employees: 18, maintenance: 2, overdue: 1 },
  { name: "HR", assets: 67, employees: 15, maintenance: 1, overdue: 0 },
  { name: "Marketing", assets: 54, employees: 22, maintenance: 4, overdue: 1 },
];

/* ═══════════════════════════════════════════════════════
   KPI CARDS
   ═══════════════════════════════════════════════════════ */

const KpiCard = memo(function KpiCard({ kpi, index }: { kpi: ReturnType<typeof buildKpis>[number]; index: number }) {
  const count = useCountUp(kpi.value, 1200);
  const Icon = kpi.icon;

  return (
    <Link
      href={kpi.href}
      className="card-hover group rounded-xl border border-border bg-card p-4 animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-medium ${
            kpi.up
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {kpi.up ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {kpi.change}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">
        {count.toLocaleString("en-IN")}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
    </Link>
  );
});

/* ═══════════════════════════════════════════════════════
   OVERDUE RETURNS
   ═══════════════════════════════════════════════════════ */

function priorityStyle(p: "warning" | "high" | "critical") {
  if (p === "critical")
    return "border-l-red-500 bg-red-500/5 text-red-600 dark:text-red-400";
  if (p === "high")
    return "border-l-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400";
  return "border-l-yellow-500 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400";
}

function OverdueReturns() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Overdue Returns
            </h3>
            <p className="text-xs text-muted-foreground">
              {overdueItems.length} items past return date
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/allocations"
          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {overdueItems.map((item) => (
          <div
            key={item.tag}
            className={`flex items-center gap-4 border-l-2 px-5 py-3 transition-colors hover:bg-muted/30 ${priorityStyle(item.priority)}`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-muted-foreground">
                  {item.tag}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.holder} · {item.dept} · Due {item.returnDate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  item.priority === "critical"
                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                    : item.priority === "high"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {item.days}d overdue
              </span>
              <button
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Send reminder"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   QUICK ACTIONS
   ═══════════════════════════════════════════════════════ */

const quickActions = [
  { icon: Plus, label: "Register Asset", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", hover: "hover:border-blue-500/30" },
  { icon: CalendarClock, label: "Book Resource", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", hover: "hover:border-emerald-500/30" },
  { icon: Wrench, label: "Raise Maintenance", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", hover: "hover:border-amber-500/30" },
  { icon: ClipboardCheck, label: "Start Audit", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400", hover: "hover:border-violet-500/30" },
  { icon: ArrowLeftRight, label: "Transfer Asset", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400", hover: "hover:border-rose-500/30" },
  { icon: BarChart3, label: "View Reports", color: "bg-primary/10 text-primary", hover: "hover:border-primary/30" },
];

function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {quickActions.map((a) => (
          <button
            key={a.label}
            className={`flex flex-col items-center gap-2 rounded-xl border border-border p-3 transition-all ${a.hover} hover:bg-muted`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.color}`}>
              <a.icon className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-medium text-foreground leading-tight text-center">
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RECENT ACTIVITIES
   ═══════════════════════════════════════════════════════ */

const typeIcon: Record<string, typeof Package> = {
  allocation: ArrowLeftRight,
  registration: Plus,
  maintenance: Wrench,
  transfer: ArrowRightLeft,
  booking: CalendarClock,
  audit: ClipboardCheck,
};

function ActivityTimeline() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Recent Activities
            </h3>
            <p className="text-xs text-muted-foreground">Latest team actions</p>
          </div>
        </div>
        <Link
          href="/dashboard/logs"
          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {activities.map((a, i) => {
          const TypeIcon = typeIcon[a.type] || Circle;
          return (
            <div
              key={i}
              className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-muted/30"
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${a.color}`}
              >
                {a.user}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{a.name}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  <span className="font-medium text-primary">{a.entity}</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <TypeIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {a.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NOTIFICATIONS WIDGET
   ═══════════════════════════════════════════════════════ */

function typeColor(t: string) {
  if (t === "alert") return "bg-red-500/10 text-red-600 dark:text-red-400";
  if (t === "success")
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (t === "warning")
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return "bg-primary/10 text-primary";
}

type NotifFilter = "all" | "unread" | "alerts";

function NotificationsWidget() {
  const [filter, setFilter] = useState<NotifFilter>("all");
  const [items, setItems] = useState(notifications);

  const filtered = useMemo(
    () =>
      filter === "unread"
        ? items.filter((n) => !n.read)
        : filter === "alerts"
          ? items.filter((n) => n.type === "alert")
          : items,
    [items, filter],
  );

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  );

  const markRead = useCallback(
    (id: number) =>
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      ),
    [],
  );

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-4 w-4 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Notifications
            </h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(["all", "unread", "alerts"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-5 py-3 transition-colors hover:bg-muted/30 ${
                !n.read ? "bg-primary/[0.02]" : ""
              }`}
            >
              <div
                className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${typeColor(n.type)}`}
              >
                {n.type === "alert" ? (
                  <AlertTriangle className="h-3.5 w-3.5" />
                ) : n.type === "success" ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : n.type === "warning" ? (
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                ) : (
                  <Bell className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {n.title}
                  </p>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="flex-shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                      title="Mark as read"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.desc}</p>
                <p className="mt-1 text-[10px] text-muted-foreground/60">
                  {n.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ASSET STATUS DONUT
   ═══════════════════════════════════════════════════════ */

function AssetStatusChart() {
  const total = useMemo(() => assetStatuses.reduce((a, s) => a + s.value, 0), []);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Asset Status
          </h3>
          <p className="text-xs text-muted-foreground">
            Distribution across all statuses
          </p>
        </div>
        <Link
          href="/dashboard/assets"
          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          Details
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {assetStatuses.reduce(
              (acc, s) => {
                const dash = (s.value / total) * 100;
                acc.elements.push(
                  <circle
                    key={s.label}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke={s.color}
                    strokeOpacity="0.85"
                    strokeWidth="3.5"
                    strokeDasharray={`${dash} ${100 - dash}`}
                    strokeDashoffset={`${-acc.offset}`}
                  />,
                );
                acc.offset += dash;
                return acc;
              },
              { offset: 0, elements: [] as React.ReactNode[] },
            ).elements}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">{total}</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {assetStatuses.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="flex-1 text-xs text-muted-foreground">
                {s.label}
              </span>
              <span className="text-xs font-medium text-foreground">
                {s.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BOOKING CALENDAR PREVIEW
   ═══════════════════════════════════════════════════════ */

function BookingPreview() {
  const timeStr = useMemo(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Today&apos;s Bookings
            </h3>
            <p className="text-xs text-muted-foreground">
              {bookings.length} reservations
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View calendar
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-4 space-y-2">
        {bookings.map((b, i) => {
          const isOngoing =
            timeStr >= b.start && timeStr < b.end;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                isOngoing
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-semibold text-foreground">
                  {b.start}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {b.end}
                </span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{b.room}</p>
                <p className="text-xs text-muted-foreground">{b.owner}</p>
              </div>
              {isOngoing ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Ongoing
                </span>
              ) : (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Upcoming
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DEPARTMENT SUMMARY
   ═══════════════════════════════════════════════════════ */

function DepartmentSummary() {
  const maxAssets = useMemo(() => Math.max(...departments.map((d) => d.assets)), []);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Department Summary
            </h3>
            <p className="text-xs text-muted-foreground">
              Assets per department
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {departments.map((d) => (
          <div
            key={d.name}
            className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {d.name}
              </span>
              <span className="text-xs font-semibold text-primary">
                {d.assets}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/60 transition-all duration-500"
                style={{ width: `${(d.assets / maxAssets) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {d.employees}
              </span>
              <span className="flex items-center gap-1">
                <Wrench className="h-3 w-3" />
                {d.maintenance}
              </span>
              {d.overdue > 0 && (
                <span className="flex items-center gap-1 text-red-500">
                  <AlertTriangle className="h-3 w-3" />
                  {d.overdue} overdue
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SKELETON LOADER
   ═══════════════════════════════════════════════════════ */

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-border bg-card p-5 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-2 w-12 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-7 w-16 rounded bg-muted" />
        <div className="h-2 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

export default memo(function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [error, setError] = useState<string | null>(null);

  const dateString = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    dashboardApi
      .getStats()
      .then((res) => {
        if (!cancelled && res.data) setStats(res.data as DashboardStats);
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : "Failed to load dashboard";
          setError(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const kpis = buildKpis(stats);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <SkeletonCard className="lg:col-span-2" />
          <SkeletonCard />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Operational command center — {dateString}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          {error} — showing placeholder data.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Overdue Returns — always above fold */}
      <OverdueReturns />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          <ActivityTimeline />
          <AssetStatusChart />
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          <NotificationsWidget />
          <BookingPreview />
        </div>
      </div>

      {/* Department Summary — full width */}
      <DepartmentSummary />
    </div>
  );
});
