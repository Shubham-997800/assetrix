"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/use-count-up";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Search,
  Save,
  BarChart3,
  RefreshCw,
  Users,
  CheckCircle,
  AlertTriangle,
  Activity,
} from "lucide-react";

/* ── KPI Cards ── */

const kpis = [
  { label: "Total Revenue", value: 4200000, prefix: "₹", format: "currency" as const, change: "+12.4%", up: true, icon: TrendingUp },
  { label: "Active Users", value: 24589, prefix: "", format: "number" as const, change: "+7.1%", up: true, icon: Users },
  { label: "Conversion Rate", value: 3.8, prefix: "", suffix: "%", format: "decimal" as const, change: "+0.4%", up: true, icon: Activity },
  { label: "Approval Rate", value: 97.2, prefix: "", suffix: "%", format: "decimal" as const, change: "+1.2%", up: true, icon: CheckCircle },
  { label: "Efficiency Score", value: 89, prefix: "", suffix: "/100", format: "number" as const, change: "+5pts", up: true, icon: BarChart3 },
  { label: "Risk Score", value: 12, prefix: "", suffix: "", format: "number" as const, change: "-3", up: false, icon: AlertTriangle },
];

function formatVal(v: number, fmt: string, pfx: string, sfx?: string) {
  if (fmt === "currency") return `${pfx}${(v / 100000).toFixed(1)}L`;
  if (fmt === "decimal") return `${v}${sfx || ""}`;
  return `${pfx}${v.toLocaleString("en-IN")}${sfx || ""}`;
}

function KpiCard({ kpi }: { kpi: (typeof kpis)[0] }) {
  const count = useCountUp(kpi.format === "decimal" ? (kpi.value > 100 ? kpi.value * 100 : kpi.value * 100) : kpi.value, 1200);
  const display = kpi.format === "decimal" ? kpi.value : count;
  return (
    <div className="card-hover rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <kpi.icon className="h-4 w-4 text-primary" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
          {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {kpi.change}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">
        {formatVal(display, kpi.format, kpi.prefix, kpi.suffix)}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
    </div>
  );
}

/* ── Charts ── */

function RevenueTrendChart() {
  const data = [35, 48, 42, 60, 52, 72, 65, 82, 78, 90, 85, 95];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
        </div>
        <Button variant="outline" size="sm" className="btn-enterprise"><Download className="h-3.5 w-3.5" /> Export</Button>
      </div>
      <div className="mt-5 flex items-end gap-1.5 h-40 sm:h-48">
        {data.map((h, i) => (
          <div key={i} className="group relative flex-1">
            <div className="flex items-end h-40 sm:h-48">
              <div className="w-full rounded-t-sm bg-primary/20 transition-colors group-hover:bg-primary/30" style={{ height: `${h}%` }}>
                <div className="rounded-t-sm bg-primary/70 transition-colors group-hover:bg-primary" style={{ height: `${[65, 72, 58, 80, 68, 85, 75, 90, 82, 95, 88, 92][i]}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">{months.map((m) => <span key={m}>{m}</span>)}</div>
    </div>
  );
}

function CategoryDonut() {
  const items = [
    { label: "Procurement", value: 35, color: "bg-primary" },
    { label: "Engineering", value: 25, color: "bg-emerald-500" },
    { label: "Marketing", value: 20, color: "bg-amber-500" },
    { label: "Operations", value: 12, color: "bg-violet-500" },
    { label: "Other", value: 8, color: "bg-muted-foreground/30" },
  ];
  const total = 100;
  let offset = 0;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Category Distribution</h3>
          <p className="text-xs text-muted-foreground">Orders by department</p>
        </div>
        <Button variant="outline" size="sm" className="btn-enterprise"><Download className="h-3.5 w-3.5" /></Button>
      </div>
      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {items.map((s) => {
              const dash = (s.value / total) * 100;
              const el = (
                <circle key={s.label} cx="18" cy="18" r="15.915" fill="none" className={s.color} strokeOpacity="0.8" strokeWidth="3.5" strokeDasharray={`${dash} ${100 - dash}`} strokeDashoffset={`${-offset}`} />
              );
              offset += dash;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">{total}</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {items.map((s) => (
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

function ApprovalTimelineChart() {
  const data = [12, 18, 15, 22, 19, 28, 24, 32, 28, 35, 30, 38];
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Approval Timeline</h3>
        <p className="text-xs text-muted-foreground">Monthly approvals processed</p>
      </div>
      <div className="mt-5 relative h-40 sm:h-48">
        <svg viewBox="0 0 120 80" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0,${80 - data[0] * 1.5} ${data.map((v, i) => `L${i * (120 / 11)},${80 - v * 1.5}`).join(" ")} L120,80 L0,80 Z`} fill="url(#areaGrad2)" />
          <path d={`M0,${80 - data[0] * 1.5} ${data.map((v, i) => `L${i * (120 / 11)},${80 - v * 1.5}`).join(" ")}`} fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

function UserGrowthChart() {
  const data = [40, 52, 48, 65, 58, 75, 68, 85, 80, 92, 88, 98];
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">User Growth</h3>
        <p className="text-xs text-muted-foreground">Monthly active users</p>
      </div>
      <div className="mt-5 flex items-end gap-1.5 h-40 sm:h-48">
        {data.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-emerald-500/20 transition-colors hover:bg-emerald-500/30" style={{ height: `${h}%` }}>
            <div className="rounded-t-sm bg-emerald-500/70 transition-colors hover:bg-emerald-500" style={{ height: `${[65, 72, 58, 80, 68, 85, 75, 90, 82, 95, 88, 98][i]}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

/* ── Data Table ── */

const tableData = [
  { id: "RPT-001", name: "Q2 Financial Summary", dept: "Finance", type: "PDF", rows: "2,847", date: "10 Jul 2026", status: "Ready" },
  { id: "RPT-002", name: "Procurement Analysis", dept: "Procurement", type: "CSV", rows: "1,293", date: "09 Jul 2026", status: "Ready" },
  { id: "RPT-003", name: "User Activity Report", dept: "HR", type: "Excel", rows: "8,412", date: "08 Jul 2026", status: "Ready" },
  { id: "RPT-004", name: "Vendor Performance", dept: "Operations", type: "PDF", rows: "567", date: "07 Jul 2026", status: "Ready" },
  { id: "RPT-005", name: "Security Audit Log", dept: "IT", type: "CSV", rows: "15,234", date: "06 Jul 2026", status: "Generating" },
  { id: "RPT-006", name: "Monthly Compliance", dept: "Legal", type: "PDF", rows: "1,891", date: "05 Jul 2026", status: "Ready" },
];

function DataTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const sort = (key: string) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = tableData.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.dept.toLowerCase().includes(search.toLowerCase()));
  filtered.sort((a, b) => {
    const av = a[sortKey as keyof typeof a] || "";
    const bv = b[sortKey as keyof typeof b] || "";
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Reports</h3>
          <p className="text-xs text-muted-foreground">{filtered.length} reports found</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search reports..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-48" />
          </div>
          <Button variant="outline" size="sm" className="btn-enterprise"><Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span></Button>
          <Button variant="outline" size="sm" className="btn-enterprise"><Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Export</span></Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {[{ key: "id", label: "ID" }, { key: "name", label: "Report" }, { key: "dept", label: "Department", hide: true }, { key: "type", label: "Format", hide: true }, { key: "rows", label: "Rows", hide: true }, { key: "date", label: "Date" }, { key: "status", label: "Status" }].map((col) => (
                <th key={col.key} className={`cursor-pointer px-3 py-3 text-xs font-medium text-muted-foreground hover:text-foreground select-none sm:px-6 ${col.hide ? "hidden md:table-cell" : ""}`} onClick={() => sort(col.key)}>
                  {col.label} {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-3 py-3 font-medium text-foreground sm:px-6">{row.id}</td>
                <td className="px-3 py-3 text-foreground sm:px-6">{row.name}</td>
                <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.dept}</td>
                <td className="hidden px-3 py-3 md:table-cell sm:px-6"><span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{row.type}</span></td>
                <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.rows}</td>
                <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.date}</td>
                <td className="px-3 py-3 sm:px-6">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.status === "Ready" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-6 py-3">
        <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Saved Views + Scheduled Reports ── */

const savedViews = [
  { name: "Executive Dashboard", filters: "Revenue, Users", updated: "2 hours ago" },
  { name: "Operations View", filters: "Approvals, Workflows", updated: "1 day ago" },
  { name: "Finance Reports", filters: "Revenue, Expenses", updated: "3 days ago" },
];

const scheduled = [
  { name: "Daily Revenue Summary", schedule: "Daily at 08:00 AM", delivery: "Email", status: "Active" },
  { name: "Weekly Operations", schedule: "Every Monday", delivery: "Download", status: "Active" },
  { name: "Monthly Compliance", schedule: "1st of every month", delivery: "Email", status: "Paused" },
];

/* ── Page ── */

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Business intelligence and data insights</p>
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
            { id: "charts", label: "Charts" },
            { id: "data", label: "Data Tables" },
            { id: "saved", label: "Saved Views" },
            { id: "scheduled", label: "Scheduled" },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>{t.label}</button>
          ))}
        </nav>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} />)}
      </div>

      {/* Charts */}
      {(activeTab === "overview" || activeTab === "charts") && (
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueTrendChart />
          <CategoryDonut />
          <ApprovalTimelineChart />
          <UserGrowthChart />
        </div>
      )}

      {/* Data Table */}
      {(activeTab === "overview" || activeTab === "data") && <DataTable />}

      {/* Saved Views */}
      {activeTab === "saved" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {savedViews.map((v) => (
            <div key={v.name} className="card-hover rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Save className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.filters}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground/60">Updated {v.updated}</p>
            </div>
          ))}
        </div>
      )}

      {/* Scheduled Reports */}
      {activeTab === "scheduled" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground">Scheduled Reports</h3>
            <p className="text-xs text-muted-foreground">Automated report delivery</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Report", "Schedule", "Delivery", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduled.map((r) => (
                  <tr key={r.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{r.schedule}</td>
                    <td className="px-6 py-3 text-muted-foreground">{r.delivery}</td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
