"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  Search,
  Plus,
  Calendar,
  Eye,
  FileText,
} from "lucide-react";

/* ── Audit Cycles ── */

const auditCycles = [
  {
    id: "q2-2026",
    name: "Q2 2026 Audit",
    status: "In Progress",
    progress: 85,
    auditors: 3,
    started: "01 Jul 2026",
  },
  {
    id: "q1-2026",
    name: "Q1 2026 Audit",
    status: "Completed",
    progress: 100,
    auditors: 4,
    started: "01 Apr 2026",
  },
  {
    id: "q4-2025",
    name: "Q4 2025 Audit",
    status: "Completed",
    progress: 100,
    auditors: 3,
    started: "01 Oct 2025",
  },
];

/* ── Verification Items ── */

const verificationItems = [
  { tag: "AST-001", name: 'MacBook Pro 16"', location: "Engineering Floor", verifiedBy: "S. Chen", status: "Verified", date: "10 Jul 2026" },
  { tag: "AST-002", name: 'Dell Monitor 27"', location: "Finance Room", verifiedBy: "P. Sharma", status: "Verified", date: "10 Jul 2026" },
  { tag: "AST-003", name: "CNC Machine", location: "Workshop", verifiedBy: "M. Webb", status: "Verified", date: "11 Jul 2026" },
  { tag: "AST-045", name: "Old Server Unit", location: "Storage Room", verifiedBy: "—", status: "Missing", date: "11 Jul 2026" },
  { tag: "AST-067", name: "Projector (Old)", location: "Closet", verifiedBy: "A. Rivera", status: "Damaged", date: "10 Jul 2026" },
  { tag: "AST-089", name: "Desktop PC", location: "HR Office", verifiedBy: "K. Tanaka", status: "Verified", date: "11 Jul 2026" },
];

const verificationStatusStyles: Record<string, string> = {
  Verified: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Missing: "bg-red-500/10 text-red-600 dark:text-red-400",
  Damaged: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

/* ── Discrepancy Reports ── */

const discrepancies = [
  {
    id: 1,
    type: "Missing Asset",
    asset: "Old Server Unit",
    detail: "Last seen: Storage Room",
    reported: "11 Jul 2026",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
  {
    id: 2,
    type: "Damaged Asset",
    asset: "Projector (Old)",
    detail: "Damage: Lens cracked",
    reported: "10 Jul 2026",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    id: 3,
    type: "Unaccounted",
    asset: "2 Monitors",
    detail: "Expected in Engineering, not found",
    reported: "11 Jul 2026",
    icon: AlertTriangle,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
];

/* ── Audit History ── */

const auditHistory = [
  { cycle: "Q1 2026", period: "Jan – Mar 2026", assetsAudited: 238, verified: 234, missing: 3, damaged: 1, status: "Completed", conductedBy: "S. Chen, P. Sharma, M. Webb, A. Rivera" },
  { cycle: "Q4 2025", period: "Oct – Dec 2025", assetsAudited: 225, verified: 220, missing: 2, damaged: 3, status: "Completed", conductedBy: "S. Chen, M. Webb, K. Tanaka" },
  { cycle: "Q3 2025", period: "Jul – Sep 2025", assetsAudited: 215, verified: 210, missing: 4, damaged: 1, status: "Completed", conductedBy: "S. Chen, P. Sharma, A. Rivera" },
];

const historyStatusStyles: Record<string, string> = {
  Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "In Progress": "bg-primary/10 text-primary",
};

/* ── Page ── */

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState("cycles");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Asset Audit</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track verification cycles, discrepancies, and audit history</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto">
          {[
            { id: "cycles", label: "Audit Cycles", icon: ClipboardCheck },
            { id: "verification", label: "Verification", icon: CheckCircle },
            { id: "discrepancies", label: "Discrepancy Reports", icon: AlertTriangle },
            { id: "history", label: "Audit History", icon: FileText },
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

      {/* ── Audit Cycles Tab ── */}
      {activeTab === "cycles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{auditCycles.length} audit cycles</p>
            <Button size="sm" className="btn-enterprise"><Plus className="h-3.5 w-3.5" /> Create Audit Cycle</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {auditCycles.map((cycle) => (
              <div key={cycle.id} className="card-hover rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{cycle.name}</h3>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      cycle.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-primary/10 text-primary"
                    }`}>{cycle.status}</span>
                  </div>
                  <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{cycle.progress}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full transition-all ${
                        cycle.progress === 100 ? "bg-emerald-500" : "bg-primary"
                      }`} style={{ width: `${cycle.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Started {cycle.started}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">{cycle.auditors} auditors assigned</p>
                </div>

                <div className="mt-4">
                  {cycle.status === "Completed" ? (
                    <Button variant="outline" size="sm" className="w-full btn-enterprise"><Eye className="h-3.5 w-3.5" /> View Report</Button>
                  ) : (
                    <Button size="sm" className="w-full btn-enterprise"><ClipboardCheck className="h-3.5 w-3.5" /> Continue</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Verification Tab ── */}
      {activeTab === "verification" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Verified", value: 234, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: CheckCircle },
              { label: "Missing", value: 3, color: "bg-red-500/10 text-red-600 dark:text-red-400", icon: AlertTriangle },
              { label: "Damaged", value: 5, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: AlertTriangle },
              { label: "Total", value: 242, color: "bg-muted text-foreground", icon: ClipboardCheck },
            ].map((s) => (
              <div key={s.label} className="card-hover rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color.split(" ")[0]}`}>
                    <s.icon className={`h-5 w-5 ${s.color.split(" ").slice(1).join(" ")}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search assets..." className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      { label: "Asset Tag" },
                      { label: "Asset Name" },
                      { label: "Location", hide: true },
                      { label: "Verified By" },
                      { label: "Status" },
                      { label: "Date", hide: true },
                    ].map((h) => (
                      <th key={h.label} className={`px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6 ${h.hide ? "hidden md:table-cell" : ""}`}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {verificationItems.map((item) => (
                    <tr key={item.tag} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-3 font-medium text-foreground sm:px-6">{item.tag}</td>
                      <td className="px-3 py-3 text-muted-foreground sm:px-6">{item.name}</td>
                      <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{item.location}</td>
                      <td className="px-3 py-3 text-muted-foreground sm:px-6">{item.verifiedBy}</td>
                      <td className="px-3 py-3 sm:px-6">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${verificationStatusStyles[item.status]}`}>{item.status}</span>
                      </td>
                      <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Discrepancy Reports Tab ── */}
      {activeTab === "discrepancies" && (
        <div className="space-y-4">
          {discrepancies.map((d) => (
            <div key={d.id} className="card-hover rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${d.iconBg}`}>
                    <d.icon className={`h-5 w-5 ${d.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{d.type}</p>
                    <h3 className="mt-0.5 text-sm font-semibold text-foreground">{d.asset}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{d.detail}</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">Reported: {d.reported}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="btn-enterprise"><Search className="h-3.5 w-3.5" /> Investigate</Button>
                  <Button size="sm" className="btn-enterprise"><CheckCircle className="h-3.5 w-3.5" /> Resolve</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Audit History Tab ── */}
      {activeTab === "history" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { label: "Cycle" },
                    { label: "Period", hide: true },
                    { label: "Assets Audited" },
                    { label: "Verified" },
                    { label: "Missing" },
                    { label: "Damaged" },
                    { label: "Status" },
                    { label: "Conducted By", hide: true },
                  ].map((h) => (
                    <th key={h.label} className={`px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6 ${h.hide ? "hidden lg:table-cell" : ""}`}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditHistory.map((row) => (
                  <tr key={row.cycle} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-3 py-3 font-medium text-foreground sm:px-6">{row.cycle}</td>
                    <td className="hidden px-3 py-3 text-muted-foreground lg:table-cell sm:px-6">{row.period}</td>
                    <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.assetsAudited}</td>
                    <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.verified}</td>
                    <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.missing}</td>
                    <td className="px-3 py-3 text-muted-foreground sm:px-6">{row.damaged}</td>
                    <td className="px-3 py-3 sm:px-6">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${historyStatusStyles[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="hidden px-3 py-3 text-muted-foreground lg:table-cell sm:px-6 max-w-[220px] truncate">{row.conductedBy}</td>
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
