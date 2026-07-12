"use client";

import React, { useState, useMemo } from "react";
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
  Calendar,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { TableDropdown } from "@/app/dashboard/assets/_components/table-dropdown";
import {
  DEPARTMENTS,
  CATEGORIES,
  STATUS_COLORS,
  SEVERITY_COLORS,
  type ReportTab,
  type RetirementStatus,
} from "./types";
import {
  MOCK_UTILIZATION,
  MOCK_IDLE,
  MOCK_MAINTENANCE_TRENDS,
  MOCK_RETIREMENT,
  MOCK_DEPARTMENT,
  MOCK_HEATMAP,
  MONTHLY_UTILIZATION,
  MONTHLY_MAINTENANCE,
  MAINTENANCE_TYPES,
  CATEGORY_FAILURE_RATES,
} from "./data";

const ITEMS_PER_PAGE = 10;
const inputCls = "h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

export function ReportTabs() {
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

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

  const kpis = [
    { label: "Total Assets", value: "1,247", change: "+3.2%", up: true, icon: Package },
    { label: "Utilization Rate", value: "87%", change: "+2.1%", up: true, icon: BarChart3 },
    { label: "Idle Assets", value: "42", change: "-5 from last month", up: false, icon: Clock },
    { label: "Maintenance Cost", value: "\u20B98.4L", change: "+12%", up: false, icon: TrendingUp },
    { label: "Booking Rate", value: "94%", change: "+1.8%", up: true, icon: CalendarCheck },
    { label: "Retirement Due", value: "15", change: "+3 this quarter", up: false, icon: AlertTriangle },
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

      {activeTab !== "export" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${inputCls} pl-9`} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <TableDropdown label="" options={["All", ...DEPARTMENTS].map((d) => ({ label: d, value: d }))} value={deptFilter} onChange={(v) => { setDeptFilter(v); setPage(1); }} placeholder="All Depts" />
            <TableDropdown label="" options={["All", ...CATEGORIES].map((c) => ({ label: c, value: c }))} value={catFilter} onChange={(v) => { setCatFilter(v); setPage(1); }} placeholder="All Categories" />
          </div>
        </div>
      )}

      {activeTab === "overview" && <OverviewTab kpis={kpis} />}
      {activeTab === "utilization" && <UtilizationTab search={search} deptFilter={deptFilter} catFilter={catFilter} page={page} setPage={setPage} />}
      {activeTab === "idle" && <IdleTab search={search} deptFilter={deptFilter} page={page} setPage={setPage} />}
      {activeTab === "maintenance" && <MaintenanceTab search={search} catFilter={catFilter} page={page} setPage={setPage} />}
      {activeTab === "retirement" && <RetirementTab search={search} statusFilter={statusFilter} setStatusFilter={setStatusFilter} page={page} setPage={setPage} />}
      {activeTab === "department" && <DepartmentTab search={search} page={page} setPage={setPage} />}
      {activeTab === "heatmap" && <HeatmapTab />}
      {activeTab === "export" && <ExportTab />}
    </div>
  );
}

function OverviewTab({ kpis }: { kpis: { label: string; value: string; change: string; up: boolean; icon: React.ElementType }[] }) {
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
        <DeptBarChart />
        <MaintenanceDonut />
      </div>
      <MonthlyLineChart data={MONTHLY_UTILIZATION} title="Utilization Trend" subtitle="Monthly utilization percentage" />
    </>
  );
}

function UtilizationTab({ search, deptFilter, catFilter, page, setPage }: { search: string; deptFilter: string; catFilter: string; page: number; setPage: (p: number) => void }) {
  const filtered = useMemo(() => {
    let items = [...MOCK_UTILIZATION];
    if (deptFilter !== "All") items = items.filter((a) => a.department === deptFilter);
    if (catFilter !== "All") items = items.filter((a) => a.category === catFilter);
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((a) => a.assetName.toLowerCase().includes(s) || a.assetTag.toLowerCase().includes(s)); }
    return items.sort((a, b) => b.utilizationPercent - a.utilizationPercent);
  }, [search, deptFilter, catFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <DeptBarChart />
        <MonthlyLineChart data={MONTHLY_UTILIZATION} title="Utilization Trend" subtitle="Year-over-year" />
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
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
      </div>
    </>
  );
}

function IdleTab({ search, deptFilter, page, setPage }: { search: string; deptFilter: string; page: number; setPage: (p: number) => void }) {
  const filtered = useMemo(() => {
    let items = [...MOCK_IDLE];
    if (deptFilter !== "All") items = items.filter((a) => a.department === deptFilter);
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((a) => a.assetName.toLowerCase().includes(s) || a.assetTag.toLowerCase().includes(s)); }
    return items.sort((a, b) => b.idleDays - a.idleDays);
  }, [search, deptFilter]);

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
        </TableBody>
      </Table>
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
    </div>
  );
}

function MaintenanceTab({ search, catFilter, page, setPage }: { search: string; catFilter: string; page: number; setPage: (p: number) => void }) {
  const filtered = useMemo(() => {
    let items = [...MOCK_MAINTENANCE_TRENDS];
    if (catFilter !== "All") items = items.filter((a) => a.category === catFilter);
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((a) => a.assetName.toLowerCase().includes(s) || a.assetTag.toLowerCase().includes(s)); }
    return items.sort((a, b) => b.totalRequests - a.totalRequests);
  }, [search, catFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart data={MONTHLY_MAINTENANCE} title="Monthly Maintenance Requests" subtitle="Total requests per month" />
        <MaintenanceDonut />
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Category Failure Rates</h3>
        <div className="space-y-3">
          {CATEGORY_FAILURE_RATES.sort((a, b) => b.rate - a.rate).map((c) => (
            <div key={c.category} className="flex items-center gap-3">
              <span className="w-32 text-xs text-muted-foreground">{c.category}</span>
              <div className="flex-1 h-4 rounded-sm bg-muted/50 overflow-hidden">
                <div className="h-full rounded-sm bg-primary/70" style={{ width: `${(c.rate / 15) * 100}%` }} />
              </div>
              <span className="w-10 text-right text-xs font-medium text-foreground">{c.rate}%</span>
            </div>
          ))}
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
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
      </div>
    </>
  );
}

function RetirementTab({ search, statusFilter, setStatusFilter, page, setPage }: { search: string; statusFilter: string; setStatusFilter: (v: string) => void; page: number; setPage: (p: number) => void }) {
  const filtered = useMemo(() => {
    let items = [...MOCK_RETIREMENT];
    if (statusFilter !== "All") items = items.filter((a) => a.status === statusFilter);
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((a) => a.assetName.toLowerCase().includes(s) || a.assetTag.toLowerCase().includes(s)); }
    return items;
  }, [search, statusFilter]);

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
                <TableCell><span className="text-xs text-foreground">{a.remainingUsefulLifeMonths} months</span></TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[a.status as RetirementStatus]}`}>
                    {a.status}
                  </span>
                </TableCell>
                <TableCell><span className="text-xs text-muted-foreground">{a.recommendedAction}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
      </div>
    </>
  );
}

function DepartmentTab({ search, page, setPage }: { search: string; page: number; setPage: (p: number) => void }) {
  const filtered = useMemo(() => {
    let items = [...MOCK_DEPARTMENT];
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((d) => d.department.toLowerCase().includes(s)); }
    return items.sort((a, b) => b.assetsAllocated - a.assetsAllocated);
  }, [search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <DeptBarChart />
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
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
      </div>
    </>
  );
}

function HeatmapTab() {
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
                  const slot = MOCK_HEATMAP.find((s) => s.day === day && s.hour === hour);
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
            <span className="ml-4 text-primary font-medium">Peak: 09:00-11:00 on Wednesday (95%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportTab() {
  const [selectedFormat, setSelectedFormat] = useState("CSV");
  const formats = [
    { label: "CSV", desc: "Comma-separated values for data analysis", icon: FileText, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { label: "PDF", desc: "Formatted report for sharing and printing", icon: File, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
    { label: "Excel", desc: "Spreadsheet with charts and pivots", icon: FileSpreadsheet, color: "bg-primary/10 text-primary" },
  ];

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
            <input type="date" defaultValue="2026-01-01" className={`${inputCls} w-full`} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">End Date</label>
            <input type="date" defaultValue="2026-07-12" className={`${inputCls} w-full`} />
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <TableDropdown label="Department" options={["All Departments", ...DEPARTMENTS].map((d) => ({ label: d, value: d }))} value="All Departments" onChange={() => {}} placeholder="All Depts" />
          <TableDropdown label="Category" options={["All Categories", ...CATEGORIES].map((c) => ({ label: c, value: c }))} value="All Categories" onChange={() => {}} placeholder="All Categories" />
          <TableDropdown label="Status" options={["All Statuses", "Active", "Idle", "Under Maintenance", "Retired"].map((s) => ({ label: s, value: s }))} value="All Statuses" onChange={() => {}} placeholder="All Statuses" />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button size="sm" className="btn-enterprise"><Download className="h-3.5 w-3.5" /> Generate Report</Button>
          <Button variant="outline" size="sm" className="btn-enterprise"><Filter className="h-3.5 w-3.5" /> Reset Filters</Button>
        </div>
      </div>
    </div>
  );
}

function DeptBarChart() {
  const data = MOCK_DEPARTMENT.sort((a, b) => b.utilizationRate - a.utilizationRate);
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Utilization by Department</h3>
        <p className="text-xs text-muted-foreground">Current utilization rates</p>
      </div>
      <div className="mt-5 space-y-3">
        {data.map((d) => (
          <div key={d.department} className="flex items-center gap-3">
            <span className="w-28 text-xs text-muted-foreground">{d.department}</span>
            <div className="flex-1 h-5 rounded-sm bg-muted/50 overflow-hidden">
              <div className="h-full rounded-sm bg-primary/70 transition-all" style={{ width: `${d.utilizationRate}%` }} />
            </div>
            <span className="w-10 text-right text-xs font-medium text-foreground">{d.utilizationRate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaintenanceDonut() {
  const offsets = MAINTENANCE_TYPES.reduce<number[]>((acc, _s, idx) => {
    const lastOffset = acc.length > 0 ? acc[acc.length - 1] + MAINTENANCE_TYPES[acc.length - 1].value : 0;
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
            {MAINTENANCE_TYPES.map((s, i) => {
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
          {MAINTENANCE_TYPES.map((s) => (
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
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">{data.map((d) => <span key={d.month}>{d.month}</span>)}</div>
    </div>
  );
}

function BarChart({ data, title, subtitle }: { data: { month: string; value: number }[]; title: string; subtitle: string }) {
  const max = Math.max(...data.map((d) => d.value)) + 5;
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
