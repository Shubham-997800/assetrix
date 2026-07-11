"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  Key,
  ScrollText,
  Flag,
  Activity,
  Clock,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Server,
  Database,
  HardDrive,
  Cpu,
  RefreshCw,
  Ban,
  UserPlus,
  Eye,
  Copy,
  Download,
} from "lucide-react";

/* ── Users Data ── */

const users = [
  { name: "Sarah Chen", email: "sarah@company.com", role: "Admin", dept: "Engineering", status: "Active", lastLogin: "2 min ago", initials: "SC", color: "bg-emerald-500" },
  { name: "Marcus Webb", email: "marcus@company.com", role: "Manager", dept: "Procurement", status: "Active", lastLogin: "1 hour ago", initials: "MW", color: "bg-primary" },
  { name: "Priya Sharma", email: "priya@company.com", role: "Employee", dept: "Finance", status: "Active", lastLogin: "3 hours ago", initials: "PS", color: "bg-amber-500" },
  { name: "Alex Rivera", email: "alex@company.com", role: "Manager", dept: "Operations", status: "Inactive", lastLogin: "5 days ago", initials: "AR", color: "bg-violet-500" },
  { name: "Jordan Lee", email: "jordan@company.com", role: "Employee", dept: "HR", status: "Suspended", lastLogin: "2 weeks ago", initials: "JL", color: "bg-red-500" },
  { name: "Kim Tanaka", email: "kim@company.com", role: "Viewer", dept: "Marketing", status: "Pending", lastLogin: "Never", initials: "KT", color: "bg-blue-500" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Inactive: "bg-muted text-muted-foreground",
  Suspended: "bg-red-500/10 text-red-600 dark:text-red-400",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

/* ── Roles Data ── */

const roles = [
  { name: "Administrator", users: 3, permissions: 24, created: "15 Jan 2025", color: "bg-red-500" },
  { name: "Manager", users: 8, permissions: 18, created: "15 Jan 2025", color: "bg-amber-500" },
  { name: "Employee", users: 42, permissions: 12, created: "15 Jan 2025", color: "bg-primary" },
  { name: "Viewer", users: 15, permissions: 6, created: "20 Feb 2025", color: "bg-emerald-500" },
];

/* ── Permissions Matrix ── */

const permResources = ["Users", "Reports", "Analytics", "Settings", "Workflows", "Administration"];
const permActions = ["Read", "Create", "Update", "Delete", "Export", "Approve"];
const permMatrix: Record<string, Record<string, boolean>> = {
  Administrator: Object.fromEntries(permResources.flatMap((r) => permActions.map((a) => [`${r}:${a}`, true]))),
  Manager: { "Users:Read": true, "Users:Create": true, "Reports:Read": true, "Reports:Create": true, "Reports:Export": true, "Analytics:Read": true, "Workflows:Read": true, "Workflows:Approve": true },
  Employee: { "Users:Read": true, "Reports:Read": true, "Analytics:Read": true, "Workflows:Read": true },
  Viewer: { "Users:Read": true, "Reports:Read": true, "Analytics:Read": true },
};

/* ── Audit Logs ── */

const auditLogs = [
  { time: "10:42 AM", user: "Sarah Chen", action: "Updated permissions", resource: "Manager role", ip: "103.21.58.xx", device: "Chrome · Windows" },
  { time: "09:15 AM", user: "System", action: "Auto-backup completed", resource: "Database", ip: "—", device: "Server" },
  { time: "Yesterday", user: "Marcus Webb", action: "Created user", resource: "Kim Tanaka", ip: "49.36.128.xx", device: "Safari · macOS" },
  { time: "Yesterday", user: "Sarah Chen", action: "Enabled feature flag", resource: "AI Recommendations", ip: "103.21.58.xx", device: "Chrome · Windows" },
  { time: "10 Jul", user: "Priya Sharma", action: "Exported report", resource: "Q2 Financial Summary", ip: "103.21.58.xx", device: "Chrome · Windows" },
  { time: "09 Jul", user: "Sarah Chen", action: "Suspended user", resource: "Jordan Lee", ip: "103.21.58.xx", device: "Chrome · Windows" },
];

/* ── Feature Flags ── */

const flags = [
  { name: "AI Recommendations", description: "ML-powered vendor and budget suggestions", enabled: true, beta: false },
  { name: "Advanced Analytics", description: "Enhanced charts and drill-down views", enabled: true, beta: true },
  { name: "Experimental Dashboard", description: "New dashboard layout with widgets", enabled: false, beta: true },
  { name: "Webhook Notifications", description: "Real-time webhook delivery for events", enabled: true, beta: false },
  { name: "Bulk Operations", description: "Batch processing for large datasets", enabled: false, beta: true },
];

/* ── System Health ── */

const health = [
  { label: "API Status", value: "Operational", icon: Server, color: "bg-emerald-500" },
  { label: "Database", value: "Healthy (42ms)", icon: Database, color: "bg-emerald-500" },
  { label: "Queue", value: "12 Pending", icon: Clock, color: "bg-amber-500" },
  { label: "Workers", value: "3 Running", icon: Activity, color: "bg-emerald-500" },
  { label: "Storage", value: "67% Used (34GB/50GB)", icon: HardDrive, color: "bg-amber-500" },
  { label: "Memory", value: "2.4GB / 8GB", icon: Cpu, color: "bg-emerald-500" },
  { label: "CPU", value: "23% Average", icon: Cpu, color: "bg-emerald-500" },
];

/* ── Background Jobs ── */

const jobs = [
  { name: "Report Generation", status: "Running", duration: "2m 14s", by: "Sarah Chen", retries: 0 },
  { name: "Data Sync", status: "Completed", duration: "45s", by: "System", retries: 0 },
  { name: "Email Batch", status: "Queued", duration: "—", by: "System", retries: 0 },
  { name: "Backup", status: "Completed", duration: "5m 02s", by: "System", retries: 0 },
  { name: "Audit Cleanup", status: "Failed", duration: "12s", by: "System", retries: 3 },
];

const jobStatusStyles: Record<string, string> = {
  Running: "bg-primary/10 text-primary",
  Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Failed: "bg-red-500/10 text-red-600 dark:text-red-400",
  Queued: "bg-muted text-muted-foreground",
};

/* ── Page ── */

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Administration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage users, roles, permissions, and system</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto">
          {[
            { id: "users", label: "Users", icon: Users },
            { id: "roles", label: "Roles", icon: Shield },
            { id: "audit", label: "Audit Logs", icon: ScrollText },
            { id: "flags", label: "Feature Flags", icon: Flag },
            { id: "health", label: "System Health", icon: Activity },
            { id: "jobs", label: "Background Jobs", icon: Clock },
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

      {/* ── Users Tab ── */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search users..." className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" />
            </div>
            <Button size="sm" className="btn-enterprise"><UserPlus className="h-3.5 w-3.5" /> Add User</Button>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["User", "Role", "Department", "Status", "Last Login", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.email} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ${u.color}`}>{u.initials}</div>
                          <div>
                            <p className="font-medium text-foreground">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{u.role}</td>
                      <td className="px-6 py-3 text-muted-foreground">{u.dept}</td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[u.status]}`}>{u.status}</span>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{u.lastLogin}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Suspend"><Ban className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Roles Tab ── */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{roles.length} roles configured</p>
            <Button size="sm" className="btn-enterprise"><Plus className="h-3.5 w-3.5" /> Create Role</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((r) => (
              <div key={r.name} className="card-hover rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${r.color}/10`}>
                    <Shield className={`h-5 w-5 ${r.color === "bg-red-500" ? "text-red-500" : r.color === "bg-amber-500" ? "text-amber-500" : r.color === "bg-primary" ? "text-primary" : "text-emerald-500"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.users} users · {r.permissions} perms</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground/60">Created {r.created}</p>
                <div className="mt-3 flex gap-1">
                  <Button variant="ghost" size="sm" className="flex-1 btn-enterprise"><Edit className="h-3 w-3" /> Edit</Button>
                  <Button variant="ghost" size="sm" className="btn-enterprise"><Copy className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </div>

          {/* Permissions Matrix */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">Permissions Matrix</h3>
            <p className="text-xs text-muted-foreground">Role-resource-action mapping</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-muted-foreground">Resource</th>
                    {permActions.map((a) => <th key={a} className="px-3 py-2 text-center text-muted-foreground">{a}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {permResources.map((r) => (
                    <tr key={r} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 font-medium text-foreground">{r}</td>
                      {permActions.map((a) => (
                        <td key={a} className="px-3 py-2 text-center">
                          {permMatrix["Manager"][`${r}:${a}`] ? (
                            <CheckCircle className="mx-auto h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <XCircle className="mx-auto h-3.5 w-3.5 text-muted-foreground/30" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Audit Logs Tab ── */}
      {activeTab === "audit" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Audit Trail</h3>
            <Button variant="outline" size="sm" className="btn-enterprise"><Download className="h-3.5 w-3.5" /> Export</Button>
          </div>
          <div className="mt-5 space-y-0">
            {auditLogs.map((log, i) => (
              <div key={i} className="flex gap-4 py-3 border-b border-border last:border-0">
                <div className="relative flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  {i < auditLogs.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{log.action}</span>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    by <span className="font-medium text-foreground">{log.user}</span> · {log.resource}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/60">{log.ip} · {log.device}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Feature Flags Tab ── */}
      {activeTab === "flags" && (
        <div className="space-y-3">
          {flags.map((f) => (
            <div key={f.name} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <Flag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{f.name}</span>
                    {f.beta && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">Beta</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{f.description}</p>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={f.enabled}
                aria-label={`${f.name} feature flag`}
                onClick={() => {}} // Toggle state managed via state
                className={`relative inline-flex h-11 w-11 shrink-0 items-center rounded-full transition-colors ${f.enabled ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${f.enabled ? "translate-x-6" : "translate-x-1"}`} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── System Health Tab ── */}
      {activeTab === "health" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {health.map((h) => (
            <div key={h.label} className="card-hover rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted`}>
                  <h.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{h.label}</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${h.color}`} />
                    <p className="text-sm font-semibold text-foreground">{h.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Background Jobs Tab ── */}
      {activeTab === "jobs" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground">Background Jobs</h3>
            <Button variant="outline" size="sm" className="btn-enterprise"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Job", "Status", "Duration", "Started By", "Retries"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((j, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium text-foreground">{j.name}</td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${jobStatusStyles[j.status]}`}>{j.status}</span>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{j.duration}</td>
                    <td className="px-6 py-3 text-muted-foreground">{j.by}</td>
                    <td className="px-6 py-3 text-muted-foreground">{j.retries}</td>
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
