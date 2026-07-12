"use client";

import { useCountUp } from "@/hooks/use-count-up";

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
  Clock,
  AlertTriangle,
} from "lucide-react";

/* ── KPI Cards ──────────────────────────────────── */

const kpis = [
  { label: "Assets Available", value: 1247, format: "number" as const, change: "+3.2%", up: true, icon: Package },
  { label: "Assets Allocated", value: 892, format: "number" as const, change: "+5.1%", up: true, icon: ArrowLeftRight },
  { label: "Maintenance Today", value: 23, format: "number" as const, change: "8 urgent", up: false, icon: Wrench },
  { label: "Active Bookings", value: 47, format: "number" as const, change: "+12 today", up: true, icon: CalendarClock },
  { label: "Pending Transfers", value: 18, format: "number" as const, change: "-2 from yesterday", up: false, icon: ArrowRightLeft },
  { label: "Upcoming Returns", value: 34, format: "number" as const, change: "5 overdue", up: false, icon: RotateCcw },
];

function formatValue(value: number, format: string) {
  if (format === "decimal") return `${value}%`;
  return value.toLocaleString("en-IN");
}

function KpiCard({ kpi }: { kpi: (typeof kpis)[0] }) {
  const count = useCountUp(kpi.value, 1200);
  const Icon = kpi.icon;

  return (
    <div className="card-hover rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
          {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {kpi.change}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold text-foreground">
        {formatValue(count, kpi.format)}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{kpi.label}</p>
    </div>
  );
}

/* ── Quick Actions ──────────────────────────────── */

const actions = [
  { icon: Plus, label: "Register Asset", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", hoverBorder: "hover:border-blue-500/30" },
  { icon: CalendarClock, label: "Book Resource", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", hoverBorder: "hover:border-emerald-500/30" },
  { icon: Wrench, label: "Raise Maintenance", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", hoverBorder: "hover:border-amber-500/30" },
];

function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        <p className="text-xs text-muted-foreground">Common operations</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            className={`flex flex-col items-center gap-2 rounded-xl border border-border p-4 transition-all ${a.hoverBorder} hover:bg-muted`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${a.color}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Asset Status Donut Chart ───────────────────── */

function AssetStatusChart() {
  const statuses = [
    { label: "Available", value: 45, color: "#10b981" },
    { label: "Allocated", value: 32, color: "var(--primary)" },
    { label: "Under Maintenance", value: 12, color: "#f59e0b" },
    { label: "Reserved", value: 8, color: "#8b5cf6" },
    { label: "Retired", value: 3, color: "#ef4444" },
  ];
  const total = statuses.reduce((a, s) => a + s.value, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Asset Status</h3>
        <p className="text-xs text-muted-foreground">Current distribution across statuses</p>
      </div>
      <div className="mt-6 flex items-center gap-6">
        <div className="relative h-36 w-36 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {statuses.reduce(
              (acc, s) => {
                const offset = acc.offset;
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
                    strokeDashoffset={`${-offset}`}
                  />
                );
                acc.offset += dash;
                return acc;
              },
              { offset: 0, elements: [] as React.ReactNode[] }
            ).elements}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{total}%</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {statuses.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="flex-1 text-sm text-muted-foreground">{s.label}</span>
              <span className="text-sm font-medium text-foreground">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Department Summary Bar Chart ───────────────── */

function DepartmentSummary() {
  const departments = [
    { label: "Engineering", value: 156 },
    { label: "Procurement", value: 134 },
    { label: "Operations", value: 112 },
    { label: "Finance", value: 89 },
    { label: "HR", value: 67 },
    { label: "Marketing", value: 54 },
  ];
  const max = Math.max(...departments.map((d) => d.value));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Department Summary</h3>
        <p className="text-xs text-muted-foreground">Assets per department</p>
      </div>
      <div className="mt-6 space-y-4">
        {departments.map((d) => (
          <div key={d.label}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{d.label}</span>
              <span className="text-sm font-medium text-foreground">{d.value}</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70 transition-all duration-500"
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Recent Activities ──────────────────────────── */

const activities = [
  { user: "SC", name: "Sarah Chen", action: "allocated Laptop Dell XPS to", entity: "Engineering dept", time: "09:12 AM", color: "bg-emerald-500" },
  { user: "MW", name: "Marcus Webb", action: "registered", entity: "5 new monitors", time: "10:25 AM", color: "bg-primary" },
  { user: "PS", name: "Priya Sharma", action: "completed maintenance on", entity: "CNC Machine", time: "11:43 AM", color: "bg-amber-500" },
  { user: "AR", name: "Alex Rivera", action: "transferred projector to", entity: "Board Room", time: "01:15 PM", color: "bg-violet-500" },
  { user: "JL", name: "Jordan Lee", action: "raised maintenance request for", entity: "AC Unit", time: "02:30 PM", color: "bg-rose-500" },
  { user: "KT", name: "Kim Tanaka", action: "booked conference room for", entity: "Jul 15", time: "03:45 PM", color: "bg-blue-500" },
];

function ActivityTimeline() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Activities</h3>
          <p className="text-xs text-muted-foreground">Latest actions from your team</p>
        </div>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-5 space-y-0">
        {activities.map((a, i) => (
          <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
            <div className="relative">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ${a.color}`}>
                {a.user}
              </div>
              {i < activities.length - 1 && (
                <div className="absolute left-1/2 top-8 -translate-x-1/2 h-3 w-px bg-border" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{a.name}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>{" "}
                <span className="font-medium text-primary">{a.entity}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Overdue Returns Widget ─────────────────────── */

const overdueItems = [
  { asset: "MacBook Pro 16\"", allocatedTo: "M. Webb", daysOverdue: 3 },
  { asset: "Projector Epson", allocatedTo: "A. Rivera", daysOverdue: 2 },
  { asset: "Laptop Dell", allocatedTo: "P. Sharma", daysOverdue: 1 },
];

function OverdueReturns() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Overdue Returns</h3>
          <p className="text-xs text-muted-foreground">Items past their return date</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {overdueItems.map((item) => (
          <div key={item.asset} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{item.asset}</p>
              <p className="text-xs text-muted-foreground">Allocated to {item.allocatedTo}</p>
            </div>
            <span className="flex-shrink-0 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400">
              {item.daysOverdue} {item.daysOverdue === 1 ? "day" : "days"} overdue
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Asset management at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AssetStatusChart />
        <DepartmentSummary />
      </div>

      {/* Activity + Overdue Returns */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityTimeline />
        </div>
        <div>
          <OverdueReturns />
        </div>
      </div>
    </div>
  );
}
