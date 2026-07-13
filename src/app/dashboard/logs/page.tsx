"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ScrollText,
  User,
  Package,
  CheckCircle,
  Server,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";

/* ── Data ── */

const allActivity = [
  { id: 1, time: "10:42 AM", date: "Today", user: "S. Chen", action: "Allocated Laptop to Engineering dept", entity: "AST-001", type: "asset", icon: Package, iconBg: "bg-primary/10 text-primary" },
  { id: 2, time: "09:15 AM", date: "Today", user: "System", action: "Auto-backup completed successfully", entity: "Database", type: "system", icon: Server, iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: 3, time: "09:00 AM", date: "Today", user: "M. Webb", action: "Registered 5 monitors", entity: "AST-085 to AST-089", type: "asset", icon: Package, iconBg: "bg-primary/10 text-primary" },
  { id: 4, time: "08:45 AM", date: "Today", user: "P. Sharma", action: "Completed maintenance on CNC Machine", entity: "MNT-301", type: "user", icon: User, iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { id: 5, time: "08:30 AM", date: "Today", user: "A. Rivera", action: "Transferred projector to Board Room", entity: "AST-004", type: "asset", icon: Package, iconBg: "bg-primary/10 text-primary" },
  { id: 6, time: "04:15 PM", date: "Yesterday", user: "J. Lee", action: "Raised maintenance request for AC", entity: "MNT-302", type: "user", icon: User, iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { id: 7, time: "03:00 PM", date: "Yesterday", user: "K. Tanaka", action: "Booked conference room for Jul 15", entity: "BK-101", type: "user", icon: User, iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { id: 8, time: "02:00 PM", date: "Yesterday", user: "System", action: "Scheduled maintenance window completed", entity: "System", type: "system", icon: Server, iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
] as const;

const approvalLogs = [
  { id: 1, action: "Laptop allocation request", requestedBy: "S. Chen", approvedBy: "M. Webb", date: "12 Jul 2026", status: "Approved" as const },
  { id: 2, action: "Budget increase for procurement", requestedBy: "A. Rivera", approvedBy: "Finance Dept", date: "11 Jul 2026", status: "Approved" as const },
  { id: 3, action: "Server room access request", requestedBy: "P. Sharma", approvedBy: "IT Admin", date: "10 Jul 2026", status: "Pending" as const },
  { id: 4, action: "New vendor onboarding", requestedBy: "K. Tanaka", approvedBy: "Procurement Lead", date: "09 Jul 2026", status: "Rejected" as const },
] as const;

const systemLogs = [
  { id: 1, timestamp: "12 Jul 2026 10:42:15 AM", level: "Info" as const, message: "Database backup completed successfully", source: "Scheduler" },
  { id: 2, timestamp: "12 Jul 2026 09:15:03 AM", level: "Warning" as const, message: "Disk usage exceeded 80% threshold", source: "Monitor" },
  { id: 3, timestamp: "12 Jul 2026 08:30:22 AM", level: "Info" as const, message: "User session cache cleared", source: "Cache Service" },
  { id: 4, timestamp: "12 Jul 2026 07:45:10 AM", level: "Error" as const, message: "Email service connection timeout", source: "Mailer" },
  { id: 5, timestamp: "11 Jul 2026 11:20:00 PM", level: "Info" as const, message: "Scheduled maintenance window started", source: "Scheduler" },
  { id: 6, timestamp: "11 Jul 2026 06:10:45 PM", level: "Warning" as const, message: "Failed login attempt from unknown IP", source: "Auth Service" },
] as const;

/* ── Tabs ── */

const tabs = [
  { id: "all", label: "All Activity", icon: ScrollText },
  { id: "user", label: "User Activity", icon: User },
  { id: "asset", label: "Asset Activity", icon: Package },
  { id: "approval", label: "Approval Logs", icon: CheckCircle },
  { id: "system", label: "System Logs", icon: Server },
] as const;

const APPROVAL_HEADERS = ["Action", "Requested By", "Approved By", "Date", "Status"] as const;
const SYSTEM_HEADERS = ["Timestamp", "Level", "Message", "Source"] as const;

const placeholderByTab: Record<string, string> = {
  approval: "Search approvals...",
  system: "Search system logs...",
};

const defaultPlaceholder = "Search activity logs...";

/* ── Timeline Item ── */

const TimelineItem = React.memo(function TimelineItem({ entry }: { entry: (typeof allActivity)[number] }) {
  const timeLabel = entry.date === "Today" ? `Today, ${entry.time}` : `${entry.date}, ${entry.time}`;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${entry.iconBg}`}>
          <entry.icon className="h-5 w-5" />
        </div>
        <div className="mt-2 h-full w-px bg-border" />
      </div>
      <div className="flex-1 pb-8">
        <p className="text-sm font-medium text-foreground">{entry.action}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{entry.entity}</span>
          <span className="text-xs text-muted-foreground/60">by {entry.user}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/60">
          <Clock className="h-3 w-3" />
          {timeLabel}
        </div>
      </div>
    </div>
  );
});

/* ── Filter Bar ── */

const FilterBar = React.memo(function FilterBar({ search, setSearch, placeholder }: { search: string; setSearch: (v: string) => void; placeholder: string }) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={handleChange}
          className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <input
          type="date"
          className="h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <Button variant="outline" size="sm" className="btn-enterprise">
          <Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span>
        </Button>
        <Button variant="outline" size="sm" className="btn-enterprise">
          <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </div>
  );
});

/* ── Page ── */

function LogsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const searchLower = useMemo(() => search.toLowerCase(), [search]);

  const filteredAll = useMemo(
    () =>
      allActivity.filter(
        (e) =>
          e.action.toLowerCase().includes(searchLower) ||
          e.user.toLowerCase().includes(searchLower) ||
          e.entity.toLowerCase().includes(searchLower)
      ),
    [searchLower]
  );

  const userActivity = useMemo(() => filteredAll.filter((e) => e.type === "user"), [filteredAll]);
  const assetActivity = useMemo(() => filteredAll.filter((e) => e.type === "asset"), [filteredAll]);

  const filteredApprovals = useMemo(
    () =>
      approvalLogs.filter(
        (r) =>
          r.action.toLowerCase().includes(searchLower) ||
          r.requestedBy.toLowerCase().includes(searchLower) ||
          r.approvedBy.toLowerCase().includes(searchLower)
      ),
    [searchLower]
  );

  const filteredSystem = useMemo(
    () =>
      systemLogs.filter(
        (l) =>
          l.message.toLowerCase().includes(searchLower) ||
          l.source.toLowerCase().includes(searchLower) ||
          l.level.toLowerCase().includes(searchLower)
      ),
    [searchLower]
  );

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      setSearch("");
    },
    []
  );

  const placeholder = useMemo(() => placeholderByTab[activeTab] ?? defaultPlaceholder, [activeTab]);

  const tabNavigation = useMemo(
    () =>
      tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const className = `flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
        }`;
        return { ...tab, isActive, className };
      }),
    [activeTab]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Activity Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor system activity and audit trails</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300" role="status">
            Demo Data
          </span>
          <Button variant="outline" size="sm" className="btn-enterprise">
            <Download className="h-3.5 w-3.5" /> Export Logs
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Log tabs">
          {tabNavigation.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={tab.className}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder={placeholder}
      />

      {/* All Activity Tab */}
      {activeTab === "all" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">All Activity</h3>
              <p className="text-xs text-muted-foreground">{filteredAll.length} entries found</p>
            </div>
          </div>
          <div className="mt-5">
            {filteredAll.length > 0 ? (
              filteredAll.map((entry) => <TimelineItem key={entry.id} entry={entry} />)
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No activity found matching your search.</p>
            )}
          </div>
        </div>
      )}

      {/* User Activity Tab */}
      {activeTab === "user" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">User Activity</h3>
              <p className="text-xs text-muted-foreground">{userActivity.length} user-initiated actions</p>
            </div>
          </div>
          <div className="mt-5">
            {userActivity.length > 0 ? (
              userActivity.map((entry) => <TimelineItem key={entry.id} entry={entry} />)
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No user activity found matching your search.</p>
            )}
          </div>
        </div>
      )}

      {/* Asset Activity Tab */}
      {activeTab === "asset" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Asset Activity</h3>
              <p className="text-xs text-muted-foreground">{assetActivity.length} asset-related actions</p>
            </div>
          </div>
          <div className="mt-5">
            {assetActivity.length > 0 ? (
              assetActivity.map((entry) => <TimelineItem key={entry.id} entry={entry} />)
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No asset activity found matching your search.</p>
            )}
          </div>
        </div>
      )}

      {/* Approval Logs Tab */}
      {activeTab === "approval" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground">Approval Logs</h3>
            <p className="text-xs text-muted-foreground">{filteredApprovals.length} approval records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {APPROVAL_HEADERS.map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredApprovals.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium text-foreground">{row.action}</td>
                    <td className="px-6 py-3 text-muted-foreground">{row.requestedBy}</td>
                    <td className="px-6 py-3 text-muted-foreground">{row.approvedBy}</td>
                    <td className="px-6 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : row.status === "Pending"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredApprovals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No approval records found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Logs Tab */}
      {activeTab === "system" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground">System Logs</h3>
            <p className="text-xs text-muted-foreground">{filteredSystem.length} system log entries</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {SYSTEM_HEADERS.map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSystem.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                    <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">{row.timestamp}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.level === "Info"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : row.level === "Warning"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {row.level === "Info" && <Info className="h-3 w-3" />}
                        {row.level === "Warning" && <AlertTriangle className="h-3 w-3" />}
                        {row.level === "Error" && <AlertTriangle className="h-3 w-3" />}
                        {row.level}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-foreground">{row.message}</td>
                    <td className="px-6 py-3 text-muted-foreground">{row.source}</td>
                  </tr>
                ))}
                {filteredSystem.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No system logs found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(LogsPage);
