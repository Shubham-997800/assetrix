"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { useInView } from "@/hooks/use-in-view";
import {
  DollarSign,
  Users,
  CheckCircle,
  Activity,
  AlertCircle,
  Server,
  TrendingUp,
  TrendingDown,
  Plus,
  FileText,
  GitBranch,
  UserPlus,
  Brain,
  Download,
  ArrowUpRight,
} from "lucide-react";

/* ── KPI Cards ──────────────────────────────────── */

const kpis = [
  { label: "Total Revenue", value: 4200000, prefix: "₹", suffix: "", format: "currency" as const, change: "+18.2%", up: true, icon: DollarSign },
  { label: "Active Users", value: 24589, prefix: "", suffix: "", format: "number" as const, change: "+7.1%", up: true, icon: Users },
  { label: "Tasks Completed", value: 1482, prefix: "", suffix: "", format: "number" as const, change: "+12.4%", up: true, icon: CheckCircle },
  { label: "AI Recommendations", value: 342, prefix: "", suffix: "", format: "number" as const, change: "+24.8%", up: true, icon: Brain },
  { label: "Pending Approvals", value: 18, prefix: "", suffix: "", format: "number" as const, change: "-3 from yesterday", up: false, icon: AlertCircle },
  { label: "System Health", value: 99.99, prefix: "", suffix: "%", format: "decimal" as const, change: "SLA met", up: true, icon: Server },
];

function formatValue(value: number, format: string, prefix: string, suffix: string) {
  if (format === "currency") {
    if (value >= 10000000) return `${prefix}${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `${prefix}${(value / 100000).toFixed(1)}L`;
    return `${prefix}${value.toLocaleString("en-IN")}`;
  }
  if (format === "decimal") return `${value}${suffix}`;
  return `${prefix}${value.toLocaleString("en-IN")}${suffix}`;
}

function KpiCard({ kpi }: { kpi: (typeof kpis)[0] }) {
  const count = useCountUp(kpi.format === "decimal" ? 9999 : kpi.value, 1200);
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
        {formatValue(count, kpi.format, kpi.prefix, kpi.suffix)}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{kpi.label}</p>
    </div>
  );
}

/* ── Charts (Pure CSS/SVG) ──────────────────────── */

function RevenueChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = [35, 48, 42, 60, 52, 72, 65, 82, 78, 90, 85, 95];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
        </div>
        <span className="text-xs text-muted-foreground">FY 2026</span>
      </div>
      <div className="mt-6 flex items-end gap-1.5" style={{ height: 180 }}>
        {data.map((h, i) => (
          <div key={i} className="group relative flex-1">
            <div className="flex items-end" style={{ height: 180 }}>
              <div className="w-full rounded-t-sm bg-primary/20 transition-colors group-hover:bg-primary/30" style={{ height: `${h}%` }}>
                <div className="rounded-t-sm bg-primary/70 transition-colors group-hover:bg-primary" style={{ height: `${60 + Math.random() * 40}%` }} />
              </div>
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
              ₹{((h / 100) * 42).toFixed(1)}L
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {months.map((m) => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

function WorkflowStatusChart() {
  const statuses = [
    { label: "Completed", value: 68, color: "bg-emerald-500" },
    { label: "In Progress", value: 22, color: "bg-primary" },
    { label: "Pending", value: 7, color: "bg-amber-500" },
    { label: "Failed", value: 3, color: "bg-red-500" },
  ];
  const total = statuses.reduce((a, s) => a + s.value, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Workflow Status</h3>
        <p className="text-xs text-muted-foreground">Current pipeline breakdown</p>
      </div>
      {/* Donut representation */}
      <div className="mt-6 flex items-center gap-6">
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {statuses.reduce((acc, s) => {
              const offset = acc.offset;
              const dash = (s.value / total) * 100;
              acc.elements.push(
                <circle
                  key={s.label}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  className={s.color}
                  strokeOpacity="0.8"
                  strokeWidth="3.5"
                  strokeDasharray={`${dash} ${100 - dash}`}
                  strokeDashoffset={`${-offset}`}
                />
              );
              acc.offset += dash;
              return acc;
            }, { offset: 0, elements: [] as React.ReactNode[] }).elements}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">{total}%</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {statuses.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
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

function PerformanceChart() {
  const data = [20, 35, 28, 45, 38, 55, 48, 65, 60, 72, 68, 80];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Monthly Performance</h3>
        <p className="text-xs text-muted-foreground">Tasks completed per month</p>
      </div>
      <div className="mt-6 relative" style={{ height: 160 }}>
        <svg viewBox="0 0 120 80" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area */}
          <path
            d={`M0,${80 - data[0] * 0.8} ${data.map((v, i) => `L${i * (120 / 11)},${80 - v * 0.8}`).join(" ")} L120,80 L0,80 Z`}
            fill="url(#areaGrad)"
          />
          {/* Line */}
          <path
            d={`M0,${80 - data[0] * 0.8} ${data.map((v, i) => `L${i * (120 / 11)},${80 - v * 0.8}`).join(" ")}`}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dots */}
          {data.map((v, i) => (
            <circle
              key={i}
              cx={i * (120 / 11)}
              cy={80 - v * 0.8}
              r="1.5"
              fill="var(--primary)"
              className="opacity-0 transition-opacity hover:opacity-100"
            />
          ))}
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function CategoryChart() {
  const categories = [
    { label: "Procurement", value: 35, color: "bg-primary" },
    { label: "Engineering", value: 25, color: "bg-emerald-500" },
    { label: "Marketing", value: 20, color: "bg-amber-500" },
    { label: "Operations", value: 12, color: "bg-violet-500" },
    { label: "Other", value: 8, color: "bg-muted-foreground/30" },
  ];
  const max = Math.max(...categories.map((c) => c.value));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Category Distribution</h3>
        <p className="text-xs text-muted-foreground">Orders by department</p>
      </div>
      <div className="mt-6 space-y-4">
        {categories.map((c) => (
          <div key={c.label}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <span className="text-sm font-medium text-foreground">{c.value}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${c.color}`}
                style={{ width: `${(c.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Recent Activity ────────────────────────────── */

const activities = [
  { user: "SC", name: "Sarah Chen", action: "approved procurement order", entity: "#8241", time: "09:12 AM", color: "bg-emerald-500" },
  { user: "MW", name: "Marcus Webb", action: "deployed workflow", entity: "v2.4", time: "10:25 AM", color: "bg-primary" },
  { user: "PS", name: "Priya Sharma", action: "exported report", entity: "Q2 Financial", time: "11:43 AM", color: "bg-amber-500" },
  { user: "AR", name: "Alex Rivera", action: "updated RBAC policy", entity: "Finance", time: "01:15 PM", color: "bg-violet-500" },
  { user: "JL", name: "Jordan Lee", action: "resolved audit finding", entity: "#127", time: "02:30 PM", color: "bg-emerald-500" },
  { user: "KT", name: "Kim Tanaka", action: "created approval workflow", entity: "Procurement", time: "03:45 PM", color: "bg-primary" },
];

function ActivityTimeline() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          <p className="text-xs text-muted-foreground">Latest actions from your team</p>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
          View all <ArrowUpRight className="h-3 w-3" />
        </button>
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

/* ── Quick Actions ──────────────────────────────── */

const actions = [
  { icon: FileText, label: "Create Report", color: "bg-primary/10 text-primary" },
  { icon: GitBranch, label: "New Workflow", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { icon: UserPlus, label: "Invite User", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { icon: Brain, label: "AI Analysis", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { icon: Download, label: "Export Data", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { icon: Plus, label: "New Request", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
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
            className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:bg-muted"
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

/* ── System Status ──────────────────────────────── */

const statuses = [
  { label: "API", status: "Operational", color: "bg-emerald-500" },
  { label: "Database", status: "Healthy", color: "bg-emerald-500" },
  { label: "Workers", status: "3 Running", color: "bg-emerald-500" },
  { label: "Queue", status: "12 Pending", color: "bg-amber-500" },
  { label: "Cache", status: "Operational", color: "bg-emerald-500" },
];

function SystemStatus() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">System Status</h3>
        <p className="text-xs text-muted-foreground">Infrastructure health</p>
      </div>
      <div className="mt-4 space-y-3">
        {statuses.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`h-2 w-2 rounded-full ${s.color}`} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Orders Table ───────────────────────────────── */

const orders = [
  { id: "ORD-8241", dept: "Procurement", amount: "₹12,45,000", status: "Approved", assignee: "S. Chen" },
  { id: "ORD-8240", dept: "Engineering", amount: "₹8,92,000", status: "Pending", assignee: "M. Webb" },
  { id: "ORD-8239", dept: "Marketing", amount: "₹5,68,000", status: "Approved", assignee: "P. Sharma" },
  { id: "ORD-8238", dept: "Operations", amount: "₹20,13,000", status: "Review", assignee: "A. Rivera" },
  { id: "ORD-8237", dept: "Finance", amount: "₹7,34,000", status: "Approved", assignee: "J. Lee" },
];

function OrdersTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
          <p className="text-xs text-muted-foreground">Latest procurement activity</p>
        </div>
        <button className="text-xs font-medium text-primary transition-colors hover:text-primary/80">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Department", "Amount", "Status", "Assignee"].map((h) => (
                <th key={h} className="px-6 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-6 py-3.5 font-medium text-foreground">{row.id}</td>
                <td className="px-6 py-3.5 text-muted-foreground">{row.dept}</td>
                <td className="px-6 py-3.5 font-medium text-foreground">{row.amount}</td>
                <td className="px-6 py-3.5">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    row.status === "Approved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : row.status === "Pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>{row.status}</span>
                </td>
                <td className="px-6 py-3.5 text-muted-foreground">{row.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Business operations at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <WorkflowStatusChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart />
        <CategoryChart />
      </div>

      {/* Activity + Quick Actions + System Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityTimeline />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <SystemStatus />
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
