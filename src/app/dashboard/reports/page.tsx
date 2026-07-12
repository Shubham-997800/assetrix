"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/use-count-up";
import {
  Package,
  BarChart3,
  Clock,
  TrendingUp,
  TrendingDown,
  CalendarCheck,
  AlertTriangle,
  Download,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  File,
  Calendar,
  Filter,
  ChevronDown,
} from "lucide-react";

/* ── KPI Data ── */

const kpis = [
  { label: "Total Assets", value: 1247, display: "1,247", change: "+3.2%", up: true, icon: Package },
  { label: "Utilization Rate", value: 87, display: "87%", change: "+2.1%", up: true, icon: BarChart3 },
  { label: "Idle Assets", value: 42, display: "42", change: "-5 from last month", up: false, icon: Clock },
  { label: "Maintenance Cost", value: 8.4, display: "₹8.4L", change: "+12%", up: false, icon: TrendingUp, costRed: true },
  { label: "Booking Rate", value: 94, display: "94%", change: "+1.8%", up: true, icon: CalendarCheck },
  { label: "Retirement Due", value: 15, display: "15", change: "+3 this quarter", up: false, icon: AlertTriangle },
];

function KpiCard({ kpi }: { kpi: (typeof kpis)[0] }) {
  const count = useCountUp(kpi.value, 1200);
  return (
    <div className="card-hover rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <kpi.icon className="h-4 w-4 text-primary" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-600 dark:text-emerald-400" : kpi.costRed ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
          {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {kpi.change}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">
        {kpi.label === "Maintenance Cost" ? `₹${count >= 8 ? "8" : count}.4L` : kpi.label === "Total Assets" ? count.toLocaleString("en-IN") : `${count}${kpi.label === "Utilization Rate" || kpi.label === "Booking Rate" ? "%" : ""}`}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
    </div>
  );
}

/* ── Asset Utilization Tab ── */

const deptUtilization = [
  { dept: "Engineering", value: 92 },
  { dept: "Procurement", value: 88 },
  { dept: "Operations", value: 85 },
  { dept: "Finance", value: 78 },
  { dept: "HR", value: 72 },
  { dept: "Marketing", value: 80 },
];

const monthlyUtilization = [78, 80, 82, 85, 83, 87, 86, 89, 88, 90, 87, 87];

const idleAssets = [
  { name: "HP Laptop Pro 14", category: "IT Equipment", lastUsed: "12 Jun 2026", daysIdle: 30, dept: "HR" },
  { name: "Canon ImagePress C750", category: "Printers", lastUsed: "05 Jun 2026", daysIdle: 37, dept: "Marketing" },
  { name: "JCB 3DX Backhoe", category: "Heavy Machinery", lastUsed: "28 May 2026", daysIdle: 44, dept: "Operations" },
  { name: "Dell PowerEdge R740", category: "Servers", lastUsed: "20 Jun 2026", daysIdle: 22, dept: "IT" },
  { name: "Toyota Hilux", category: "Vehicles", lastUsed: "15 Jun 2026", daysIdle: 27, dept: "Engineering" },
];

function DeptBarChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Utilization by Department</h3>
        <p className="text-xs text-muted-foreground">Current utilization rates</p>
      </div>
      <div className="mt-5 space-y-3">
        {deptUtilization.map((d) => (
          <div key={d.dept} className="flex items-center gap-3">
            <span className="w-28 text-xs text-muted-foreground">{d.dept}</span>
            <div className="flex-1 h-5 rounded-sm bg-muted/50 overflow-hidden">
              <div className="h-full rounded-sm bg-primary/70 transition-all" style={{ width: `${d.value}%` }} />
            </div>
            <span className="w-10 text-right text-xs font-medium text-foreground">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyUtilizationLine() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const min = Math.min(...monthlyUtilization) - 5;
  const max = Math.max(...monthlyUtilization) + 5;
  const range = max - min;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Monthly Utilization Trend</h3>
        <p className="text-xs text-muted-foreground">Year-over-year trend</p>
      </div>
      <div className="mt-5 relative h-40 sm:h-48">
        <svg viewBox="0 0 120 80" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0,${80 - ((monthlyUtilization[0] - min) / range) * 70} ${monthlyUtilization.map((v, i) => `L${i * (120 / 11)},${80 - ((v - min) / range) * 70}`).join(" ")} L120,80 L0,80 Z`} fill="url(#utilGrad)" />
          <path d={`M0,${80 - ((monthlyUtilization[0] - min) / range) * 70} ${monthlyUtilization.map((v, i) => `L${i * (120 / 11)},${80 - ((v - min) / range) * 70}`).join(" ")}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
          {monthlyUtilization.map((v, i) => (
            <circle key={i} cx={i * (120 / 11)} cy={80 - ((v - min) / range) * 70} r="1.5" fill="var(--primary)" />
          ))}
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">{months.map((m) => <span key={m}>{m}</span>)}</div>
    </div>
  );
}

function IdleAssetsTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">Idle Assets</h3>
        <p className="text-xs text-muted-foreground">Assets with no activity in the last 20+ days</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Asset Name", "Category", "Last Used", "Days Idle", "Department"].map((h) => (
                <th key={h} className="px-6 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {idleAssets.map((a) => (
              <tr key={a.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-6 py-3 font-medium text-foreground">{a.name}</td>
                <td className="px-6 py-3 text-muted-foreground">{a.category}</td>
                <td className="px-6 py-3 text-muted-foreground">{a.lastUsed}</td>
                <td className="px-6 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.daysIdle >= 40 ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                    {a.daysIdle} days
                  </span>
                </td>
                <td className="px-6 py-3 text-muted-foreground">{a.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Maintenance Trends Tab ── */

const monthlyMaintenance = [18, 22, 15, 28, 20, 32, 25, 30, 27, 35, 22, 28];

const maintenanceType = [
  { label: "Preventive", value: 45, color: "bg-emerald-500" },
  { label: "Corrective", value: 35, color: "bg-amber-500" },
  { label: "Emergency", value: 20, color: "bg-red-500" },
];

const topMaintained = [
  { name: "CAT 320 Excavator", category: "Heavy Machinery", requests: 14, avgDays: 3.2, dept: "Operations" },
  { name: "CNC Lathe Haas ST-20", category: "Manufacturing", requests: 11, avgDays: 2.5, dept: "Engineering" },
  { name: "Volvo FH16 Truck", category: "Vehicles", requests: 9, avgDays: 4.1, dept: "Logistics" },
  { name: "Xerox Versant 4100", category: "Printers", requests: 8, avgDays: 1.8, dept: "Marketing" },
  { name: "Schneider UPS 60kVA", category: "IT Infrastructure", requests: 7, avgDays: 2.0, dept: "IT" },
];

function MaintenanceBarChart() {
  const max = Math.max(...monthlyMaintenance) + 5;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Monthly Maintenance Requests</h3>
        <p className="text-xs text-muted-foreground">Total requests per month</p>
      </div>
      <div className="mt-5 flex items-end gap-1.5 h-40 sm:h-48">
        {monthlyMaintenance.map((h, i) => {
          const innerHeights = [75, 65, 80, 60, 70, 85, 72, 78, 68, 82, 77, 88];
          return (
          <div key={i} className="flex-1 rounded-t-sm bg-primary/20 transition-colors hover:bg-primary/30" style={{ height: `${(h / max) * 100}%` }}>
            <div className="rounded-t-sm bg-primary/70 transition-colors hover:bg-primary" style={{ height: `${innerHeights[i]}%` }} />
          </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">{months.map((m) => <span key={m}>{m}</span>)}</div>
    </div>
  );
}

function MaintenanceDonut() {
  const offsets = maintenanceType.reduce<number[]>((acc, _s, idx) => {
    const lastOffset = acc.length > 0 ? acc[acc.length - 1] + maintenanceType[acc.length - 1].value : 0;
    acc.push(idx === 0 ? 0 : lastOffset);
    return acc;
  }, []);
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Maintenance Type Distribution</h3>
        <p className="text-xs text-muted-foreground">Breakdown by request type</p>
      </div>
      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {maintenanceType.map((s, i) => {
              const dash = (s.value / 100) * 100;
              return (
                <circle key={s.label} cx="18" cy="18" r="15.915" fill="none" className={s.color} strokeOpacity="0.8" strokeWidth="3.5" strokeDasharray={`${dash} ${100 - dash}`} strokeDashoffset={`${-offsets[i]}`} />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">100%</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {maintenanceType.map((s) => (
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

function TopMaintainedTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">Top 5 Most Maintained Assets</h3>
        <p className="text-xs text-muted-foreground">Assets with highest maintenance frequency</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Asset Name", "Category", "Requests", "Avg Days", "Department"].map((h) => (
                <th key={h} className="px-6 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topMaintained.map((a, i) => (
              <tr key={a.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                    <span className="font-medium text-foreground">{a.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-muted-foreground">{a.category}</td>
                <td className="px-6 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{a.requests}</span>
                </td>
                <td className="px-6 py-3 text-muted-foreground">{a.avgDays} days</td>
                <td className="px-6 py-3 text-muted-foreground">{a.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Export Tab ── */

const exportFormats = [
  { label: "CSV", desc: "Comma-separated values for data analysis", icon: FileText, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { label: "PDF", desc: "Formatted report for sharing and printing", icon: File, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  { label: "Excel", desc: "Spreadsheet with charts and pivots", icon: FileSpreadsheet, color: "bg-primary/10 text-primary" },
];

const departments = ["All Departments", "Engineering", "Procurement", "Operations", "Finance", "HR", "Marketing"];
const categories = ["All Categories", "IT Equipment", "Heavy Machinery", "Vehicles", "Printers", "Servers"];
const statuses = ["All Statuses", "Active", "Idle", "Under Maintenance", "Retired"];

function ExportTab() {
  const [selectedFormat, setSelectedFormat] = useState("CSV");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {exportFormats.map((f) => (
          <button key={f.label} onClick={() => setSelectedFormat(f.label)}
            className={`card-hover rounded-xl border bg-card p-5 text-left transition-colors ${selectedFormat === f.label ? "border-primary ring-1 ring-primary/20" : "border-border"}`}>
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
        <p className="text-xs text-muted-foreground">Configure date range and filters for your report</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="date" defaultValue="2026-01-01" className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="date" defaultValue="2026-07-12" className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
            <div className="relative">
              <select className="h-9 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm outline-none focus:border-primary">
                {departments.map((d) => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
            <div className="relative">
              <select className="h-9 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm outline-none focus:border-primary">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
            <div className="relative">
              <select className="h-9 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm outline-none focus:border-primary">
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button size="sm" className="btn-enterprise"><Download className="h-3.5 w-3.5" /> Generate Report</Button>
          <Button variant="outline" size="sm" className="btn-enterprise"><Filter className="h-3.5 w-3.5" /> Reset Filters</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">AssetFlow ERP — Asset intelligence and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-enterprise"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          <Button size="sm" className="btn-enterprise"><Download className="h-3.5 w-3.5" /> Export All</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "utilization", label: "Asset Utilization" },
            { id: "maintenance", label: "Maintenance Trends" },
            { id: "export", label: "Export" },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>{t.label}</button>
          ))}
        </nav>
      </div>

      {/* KPI Cards */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} />)}
        </div>
      )}

      {/* Overview Charts */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <DeptBarChart />
          <MaintenanceDonut />
        </div>
      )}

      {/* Asset Utilization Tab */}
      {activeTab === "utilization" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <DeptBarChart />
            <MonthlyUtilizationLine />
          </div>
          <IdleAssetsTable />
        </div>
      )}

      {/* Maintenance Trends Tab */}
      {activeTab === "maintenance" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <MaintenanceBarChart />
            <MaintenanceDonut />
          </div>
          <TopMaintainedTable />
        </div>
      )}

      {/* Export Tab */}
      {activeTab === "export" && <ExportTab />}
    </div>
  );
}
