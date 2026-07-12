"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Send,
} from "lucide-react";

/* ── Data ── */

const activeAllocations = [
  { id: "ALLOC-101", asset: "MacBook Pro 16\"", allocatedTo: "S. Chen", department: "Engineering", allocatedDate: "01 Jul 2026", expectedReturn: "01 Oct 2026", status: "Active" },
  { id: "ALLOC-102", asset: "Toyota Hilux", allocatedTo: "M. Webb", department: "Procurement", allocatedDate: "15 Jun 2026", expectedReturn: "15 Sep 2026", status: "Active" },
  { id: "ALLOC-103", asset: "Ergonomic Chair", allocatedTo: "A. Rivera", department: "Operations", allocatedDate: "20 Jun 2026", expectedReturn: "20 Sep 2026", status: "Active" },
  { id: "ALLOC-104", asset: "Laptop Dell", allocatedTo: "P. Sharma", department: "Finance", allocatedDate: "05 Jul 2026", expectedReturn: "05 Oct 2026", status: "Active" },
  { id: "ALLOC-105", asset: "Projector Epson", allocatedTo: "K. Tanaka", department: "Marketing", allocatedDate: "28 Jun 2026", expectedReturn: "28 Sep 2026", status: "Active" },
];

const pendingApprovals = [
  { asset: "Monitor Dell 27\"", department: "Finance", requestedBy: "P. Sharma", daysPending: 2 },
  { asset: "Projector", department: "HR", requestedBy: "J. Lee", daysPending: 1 },
  { asset: "Laptop", department: "Marketing", requestedBy: "K. Tanaka", daysPending: 3 },
];

const transferRequests = [
  { id: "TRF-201", asset: "Conference Table", from: "Operations", to: "Engineering", requestedDate: "08 Jul 2026", status: "Pending" },
  { id: "TRF-202", asset: "HP Printer", from: "Finance", to: "HR", requestedDate: "09 Jul 2026", status: "Approved" },
  { id: "TRF-203", asset: "Projector", from: "Marketing", to: "Operations", requestedDate: "10 Jul 2026", status: "Rejected" },
];

const overdueReturns = [
  { asset: "MacBook Pro 16\"", employee: "M. Webb", daysOverdue: 3, expectedDate: "09 Jul 2026" },
  { asset: "Projector Epson", employee: "A. Rivera", daysOverdue: 2, expectedDate: "10 Jul 2026" },
  { asset: "Laptop Dell", employee: "P. Sharma", daysOverdue: 1, expectedDate: "11 Jul 2026" },
];

const allocationHistory = [
  { id: "ALLOC-091", asset: "MacBook Air", employee: "D. Kim", dept: "Engineering", allocated: "01 Jan 2026", returned: "15 Mar 2026", duration: "73 days" },
  { id: "ALLOC-092", asset: "Desk Chair", employee: "L. Park", dept: "HR", allocated: "10 Feb 2026", returned: "10 Jun 2026", duration: "120 days" },
  { id: "ALLOC-093", asset: "iPhone 15", employee: "R. Patel", dept: "Sales", allocated: "05 Mar 2026", returned: "05 Jul 2026", duration: "122 days" },
  { id: "ALLOC-094", asset: "Standing Desk", employee: "T. Nakamura", dept: "Operations", allocated: "15 Apr 2026", returned: "15 Jul 2026", duration: "91 days" },
  { id: "ALLOC-095", asset: "Monitor LG 27\"", employee: "H. Gupta", dept: "Finance", allocated: "20 May 2026", returned: "20 Jul 2026", duration: "61 days" },
];

/* ── Status Styles ── */

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  Overdue: "bg-red-500/10 text-red-600 dark:text-red-400",
};

/* ── Page ── */

export default function AllocationsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Asset Allocations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage asset assignments, transfers, and returns</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto">
          {[
            { id: "active", label: "Active Allocations", icon: ArrowLeftRight },
            { id: "pending", label: "Pending Approvals", icon: Clock },
            { id: "transfers", label: "Transfer Requests", icon: ArrowLeftRight },
            { id: "overdue", label: "Overdue Returns", icon: AlertTriangle },
            { id: "history", label: "Allocation History", icon: Search },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Active Allocations Tab ── */}
      {activeTab === "active" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Active Allocations</h3>
              <p className="text-xs text-muted-foreground">{activeAllocations.length} active allocations</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search allocations..."
                  className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-48" />
              </div>
              <Button variant="outline" size="sm" className="btn-enterprise"><Filter className="h-3.5 w-3.5" /> Filter</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { label: "Allocation ID" },
                    { label: "Asset", hide: true },
                    { label: "Allocated To" },
                    { label: "Department", hide: true },
                    { label: "Allocated Date", hide: true },
                    { label: "Expected Return", hide: true },
                    { label: "Status" },
                    { label: "Actions" },
                  ].map((h, i) => (
                    <th key={i} className={`px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6 ${h.hide ? "hidden md:table-cell" : ""}`}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeAllocations.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-3 py-3 font-medium text-foreground sm:px-6">{row.id}</td>
                    <td className="hidden px-3 py-3 text-foreground md:table-cell sm:px-6">{row.asset}</td>
                    <td className="px-3 py-3 text-foreground sm:px-6">{row.allocatedTo}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.department}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.allocatedDate}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.expectedReturn}</td>
                    <td className="px-3 py-3 sm:px-6">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="px-3 py-3 sm:px-6">
                      <Button variant="ghost" size="sm" className="btn-enterprise">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pending Approvals Tab ── */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{pendingApprovals.length} pending requests</p>
          </div>
          {pendingApprovals.map((req, i) => (
            <div key={i} className="card-hover rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Request for {req.asset}</p>
                    <p className="text-xs text-muted-foreground">Department: {req.department} · Requested by: {req.requestedBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">{req.daysPending} day{req.daysPending > 1 ? "s" : ""} pending</span>
                  <Button variant="outline" size="sm" className="btn-enterprise"><CheckCircle className="h-3.5 w-3.5" /> Approve</Button>
                  <Button variant="ghost" size="sm" className="btn-enterprise text-destructive hover:text-destructive"><XCircle className="h-3.5 w-3.5" /> Reject</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Transfer Requests Tab ── */}
      {activeTab === "transfers" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground">Transfer Requests</h3>
            <p className="text-xs text-muted-foreground">{transferRequests.length} transfer requests</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { label: "Request ID" },
                    { label: "Asset" },
                    { label: "From", hide: true },
                    { label: "To", hide: true },
                    { label: "Requested Date", hide: true },
                    { label: "Status" },
                  ].map((h, i) => (
                    <th key={i} className={`px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6 ${h.hide ? "hidden md:table-cell" : ""}`}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transferRequests.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-3 py-3 font-medium text-foreground sm:px-6">{row.id}</td>
                    <td className="px-3 py-3 text-foreground sm:px-6">{row.asset}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.from}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.to}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.requestedDate}</td>
                    <td className="px-3 py-3 sm:px-6">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Overdue Returns Tab ── */}
      {activeTab === "overdue" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-medium text-foreground">{overdueReturns.length} overdue returns require attention</p>
          </div>
          {overdueReturns.map((item, i) => (
            <div key={i} className="card-hover rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.asset}</p>
                    <p className="text-xs text-muted-foreground">Allocated to: {item.employee} · Expected return: {item.expectedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">{item.daysOverdue} day{item.daysOverdue > 1 ? "s" : ""} overdue</span>
                  <Button variant="outline" size="sm" className="btn-enterprise"><Send className="h-3.5 w-3.5" /> Send Reminder</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Allocation History Tab ── */}
      {activeTab === "history" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Allocation History</h3>
              <p className="text-xs text-muted-foreground">{allocationHistory.length} historical allocations</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search history..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)}
                  className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-48" />
              </div>
              <input type="date" value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)}
                className="h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { label: "ID" },
                    { label: "Asset", hide: true },
                    { label: "Employee" },
                    { label: "Dept", hide: true },
                    { label: "Allocated", hide: true },
                    { label: "Returned", hide: true },
                    { label: "Duration" },
                  ].map((h, i) => (
                    <th key={i} className={`px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6 ${h.hide ? "hidden md:table-cell" : ""}`}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allocationHistory
                  .filter((row) => {
                    const matchSearch = !historySearch || row.asset.toLowerCase().includes(historySearch.toLowerCase()) || row.employee.toLowerCase().includes(historySearch.toLowerCase());
                    return matchSearch;
                  })
                  .map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-3 py-3 font-medium text-foreground sm:px-6">{row.id}</td>
                    <td className="hidden px-3 py-3 text-foreground md:table-cell sm:px-6">{row.asset}</td>
                    <td className="px-3 py-3 text-foreground sm:px-6">{row.employee}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.dept}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.allocated}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{row.returned}</td>
                    <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.duration}</td>
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
