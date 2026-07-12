"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/use-count-up";
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Plus,
  User,
  Calendar,
} from "lucide-react";

/* ── KPI Cards ── */

const kpis = [
  { label: "Total Requests", value: 47, icon: Wrench },
  { label: "Pending", value: 8, icon: Clock },
  { label: "In Progress", value: 12, icon: AlertTriangle },
  { label: "Resolved", value: 27, icon: CheckCircle },
];

function KpiCard({ kpi }: { kpi: (typeof kpis)[0] }) {
  const count = useCountUp(kpi.value, 1200);
  const Icon = kpi.icon;
  return (
    <div className="card-hover rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{count}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
    </div>
  );
}

/* ── Data ── */

const allRequests = [
  { id: "MNT-301", asset: "CNC Machine Model X", type: "Preventive", priority: "High", raisedBy: "M. Webb", assignedTo: "Technician A", status: "In Progress", date: "10 Jul 2026" },
  { id: "MNT-302", asset: "AC Unit Floor 3", type: "Corrective", priority: "Critical", raisedBy: "J. Lee", assignedTo: "Unassigned", status: "Pending Approval", date: "11 Jul 2026" },
  { id: "MNT-303", asset: "HP LaserJet Pro", type: "Corrective", priority: "Medium", raisedBy: "P. Sharma", assignedTo: "Technician B", status: "Resolved", date: "09 Jul 2026" },
  { id: "MNT-304", asset: 'Dell Monitor 27"', type: "Preventive", priority: "Low", raisedBy: "S. Chen", assignedTo: "Technician A", status: "Approved", date: "08 Jul 2026" },
  { id: "MNT-305", asset: "Toyota Hilux", type: "Preventive", priority: "High", raisedBy: "M. Webb", assignedTo: "Technician C", status: "Resolved", date: "07 Jul 2026" },
  { id: "MNT-306", asset: "Meeting Room AC", type: "Corrective", priority: "Medium", raisedBy: "A. Rivera", assignedTo: "Unassigned", status: "Pending Approval", date: "11 Jul 2026" },
];

const pendingRequests = allRequests.filter((r) => r.status === "Pending Approval");
const inProgressRequests = allRequests.filter((r) => r.status === "In Progress");
const resolvedRequests = allRequests.filter((r) => r.status === "Resolved");

const historyData = [
  { id: "MNT-295", asset: "Server Rack A", type: "Preventive", priority: "High", raisedBy: "K. Tanaka", assignedTo: "Technician A", status: "Resolved", date: "01 Jul 2026" },
  { id: "MNT-296", asset: "UPS System", type: "Corrective", priority: "Critical", raisedBy: "S. Chen", assignedTo: "Technician B", status: "Resolved", date: "28 Jun 2026" },
  { id: "MNT-297", asset: "Office Printer", type: "Corrective", priority: "Low", raisedBy: "P. Sharma", assignedTo: "Technician C", status: "Resolved", date: "25 Jun 2026" },
  { id: "MNT-298", asset: "Forklift Unit 2", type: "Preventive", priority: "Medium", raisedBy: "M. Webb", assignedTo: "Technician A", status: "Resolved", date: "22 Jun 2026" },
  { id: "MNT-299", asset: "HVAC System", type: "Preventive", priority: "High", raisedBy: "J. Lee", assignedTo: "Technician B", status: "Resolved", date: "19 Jun 2026" },
  { id: "MNT-300", asset: "Conference Display", type: "Corrective", priority: "Low", raisedBy: "A. Rivera", assignedTo: "Technician C", status: "Resolved", date: "15 Jun 2026" },
];

const statusStyles: Record<string, string> = {
  "In Progress": "bg-primary/10 text-primary",
  "Pending Approval": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Resolved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Approved: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const priorityStyles: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-600 dark:text-red-400",
  High: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Low: "bg-muted text-muted-foreground",
};

/* ── All Requests Tab ── */

function AllRequestsTable() {
  const [search, setSearch] = useState("");

  const filtered = allRequests.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.asset.toLowerCase().includes(search.toLowerCase()) ||
      r.raisedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">All Maintenance Requests</h3>
            <p className="text-xs text-muted-foreground">{filtered.length} requests</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-48"
              />
            </div>
            <Button variant="outline" size="sm" className="btn-enterprise">
              <Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button size="sm" className="btn-enterprise">
              <Plus className="h-3.5 w-3.5" /> <span className="hidden sm:inline">New Request</span>
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Request ID", "Asset", "Type", "Priority", "Raised By", "Assigned To", "Status", "Date"].map((h) => (
                  <th key={h} className={`px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6 ${h === "Type" || h === "Raised By" ? "hidden md:table-cell" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                  <td className="px-3 py-3 font-medium text-foreground sm:px-6">{row.id}</td>
                  <td className="px-3 py-3 text-foreground sm:px-6">{row.asset}</td>
                  <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{row.type}</span>
                  </td>
                  <td className="px-3 py-3 sm:px-6">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[row.priority]}`}>{row.priority}</span>
                  </td>
                  <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.raisedBy}</td>
                  <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.assignedTo}</td>
                  <td className="px-3 py-3 sm:px-6">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}>{row.status}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Pending Approval Tab ── */

function PendingApprovalTab() {
  return (
    <div className="space-y-4">
      {pendingRequests.map((req) => (
        <div key={req.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{req.id}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[req.priority]}`}>{req.priority}</span>
              </div>
              <p className="text-sm text-foreground">{req.asset}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> {req.type}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {req.raisedBy}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {req.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="btn-enterprise">
                <CheckCircle className="h-3.5 w-3.5" /> Approve
              </Button>
              <Button variant="destructive" size="sm" className="btn-enterprise">
                Reject
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── In Progress Tab ── */

const progressData = [
  { ...inProgressRequests[0], progress: 45 },
  { id: "MNT-307", asset: "Elevator B", type: "Preventive", priority: "High", raisedBy: "S. Chen", assignedTo: "Technician A", status: "In Progress", date: "10 Jul 2026", progress: 72 },
  { id: "MNT-308", asset: "Generator Unit", type: "Corrective", priority: "Critical", raisedBy: "K. Tanaka", assignedTo: "Technician B", status: "In Progress", date: "09 Jul 2026", progress: 20 },
];

function InProgressTab() {
  return (
    <div className="space-y-4">
      {progressData.map((req) => (
        <div key={req.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{req.id}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[req.priority]}`}>{req.priority}</span>
              </div>
              <p className="text-sm text-foreground">{req.asset}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> {req.type}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {req.assignedTo}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {req.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="text-sm font-semibold text-foreground">{req.progress}%</p>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${req.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Resolved Tab ── */

function ResolvedTab() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">Resolved Requests</h3>
        <p className="text-xs text-muted-foreground">{resolvedRequests.length} resolved items</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Request ID", "Asset", "Type", "Priority", "Assigned To", "Date"].map((h) => (
                <th key={h} className="px-6 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resolvedRequests.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-6 py-3 font-medium text-foreground">{row.id}</td>
                <td className="px-6 py-3 text-foreground">{row.asset}</td>
                <td className="px-6 py-3 text-muted-foreground">{row.type}</td>
                <td className="px-6 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[row.priority]}`}>{row.priority}</span>
                </td>
                <td className="px-6 py-3 text-muted-foreground">{row.assignedTo}</td>
                <td className="px-6 py-3 text-muted-foreground">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Maintenance History Tab ── */

function MaintenanceHistoryTab() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = historyData.filter(
    (r) =>
      (r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.asset.toLowerCase().includes(search.toLowerCase())) &&
      (!dateFilter || r.date.includes(dateFilter))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by date..."
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-48"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Request ID", "Asset", "Type", "Priority", "Raised By", "Assigned To", "Status", "Date"].map((h) => (
                  <th key={h} className="px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-3 font-medium text-foreground sm:px-6">{row.id}</td>
                  <td className="px-3 py-3 text-foreground sm:px-6">{row.asset}</td>
                  <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.type}</td>
                  <td className="px-3 py-3 sm:px-6">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[row.priority]}`}>{row.priority}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.raisedBy}</td>
                  <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.assignedTo}</td>
                  <td className="px-3 py-3 sm:px-6">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}>{row.status}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Maintenance</h1>
          <p className="mt-1 text-sm text-muted-foreground">Asset maintenance requests and tracking</p>
        </div>
        <Button size="sm" className="btn-enterprise">
          <Plus className="h-3.5 w-3.5" /> New Request
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto">
          {[
            { id: "all", label: "All Requests" },
            { id: "pending", label: "Pending Approval" },
            { id: "in-progress", label: "In Progress" },
            { id: "resolved", label: "Resolved" },
            { id: "history", label: "Maintenance History" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "all" && <AllRequestsTable />}
      {activeTab === "pending" && <PendingApprovalTab />}
      {activeTab === "in-progress" && <InProgressTab />}
      {activeTab === "resolved" && <ResolvedTab />}
      {activeTab === "history" && <MaintenanceHistoryTab />}
    </div>
  );
}
