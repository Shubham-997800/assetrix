"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  Key,
  Activity,
  Clock,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Server,
  Database,
  HardDrive,
  Cpu,
  UserPlus,
  Download,
  Ban,
  Copy,
  ScrollText,
  Settings,
} from "lucide-react";

/* ── Users Data ── */

const users = [
  { name: "Sarah Chen", email: "sarah@company.com", role: "Admin", dept: "Engineering", status: "Active", lastLogin: "2 min ago", initials: "SC", color: "bg-emerald-500" },
  { name: "Marcus Webb", email: "marcus@company.com", role: "Manager", dept: "Procurement", status: "Active", lastLogin: "1 hour ago", initials: "MW", color: "bg-primary" },
  { name: "Priya Sharma", email: "priya@company.com", role: "Employee", dept: "Finance", status: "Active", lastLogin: "3 hours ago", initials: "PS", color: "bg-amber-500" },
  { name: "Alex Rivera", email: "alex@company.com", role: "Manager", dept: "Operations", status: "Inactive", lastLogin: "5 days ago", initials: "AR", color: "bg-violet-500" },
  { name: "Jordan Lee", email: "jordan@company.com", role: "Employee", dept: "HR", status: "Suspended", lastLogin: "2 weeks ago", initials: "JL", color: "bg-red-500" },
  { name: "Kim Tanaka", email: "kim@company.com", role: "Viewer", dept: "Marketing", status: "Active", lastLogin: "1 day ago", initials: "KT", color: "bg-blue-500" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Inactive: "bg-muted text-muted-foreground",
  Suspended: "bg-red-500/10 text-red-600 dark:text-red-400",
};

/* ── Roles Data ── */

const roles = [
  { name: "Administrator", users: 3, permissions: 24, color: "bg-red-500", iconColor: "text-red-500" },
  { name: "Manager", users: 8, permissions: 18, color: "bg-amber-500", iconColor: "text-amber-500" },
  { name: "Employee", users: 42, permissions: 12, color: "bg-primary", iconColor: "text-primary" },
  { name: "Viewer", users: 15, permissions: 6, color: "bg-emerald-500", iconColor: "text-emerald-500" },
];

/* ── Permissions Matrix ── */

const permResources = ["Assets", "Allocations", "Bookings", "Maintenance", "Audit", "Reports", "Users", "Settings"];
const permActions = ["Read", "Create", "Update", "Delete", "Approve", "Export"];
const permMatrix: Record<string, Record<string, boolean>> = {
  Administrator: Object.fromEntries(permResources.flatMap((r) => permActions.map((a) => [`${r}:${a}`, true]))),
  Manager: {
    "Assets:Read": true, "Assets:Create": true, "Assets:Update": true, "Assets:Export": true,
    "Allocations:Read": true, "Allocations:Create": true, "Allocations:Approve": true,
    "Bookings:Read": true, "Bookings:Create": true, "Bookings:Update": true,
    "Maintenance:Read": true, "Maintenance:Create": true,
    "Audit:Read": true, "Audit:Export": true,
    "Reports:Read": true, "Reports:Create": true, "Reports:Export": true,
    "Users:Read": true,
    "Settings:Read": true,
  },
  Employee: {
    "Assets:Read": true,
    "Allocations:Read": true, "Allocations:Create": true,
    "Bookings:Read": true, "Bookings:Create": true,
    "Maintenance:Read": true, "Maintenance:Create": true,
    "Reports:Read": true,
    "Users:Read": true,
  },
  Viewer: {
    "Assets:Read": true,
    "Allocations:Read": true,
    "Bookings:Read": true,
    "Reports:Read": true,
  },
};

/* ── System Health ── */

const health = [
  { label: "API Status", value: "Operational", icon: Server, color: "bg-emerald-500" },
  { label: "Database", value: "Healthy (42ms)", icon: Database, color: "bg-emerald-500" },
  { label: "Queue", value: "12 Pending", icon: Clock, color: "bg-amber-500" },
  { label: "Workers", value: "3 Running", icon: Activity, color: "bg-emerald-500" },
  { label: "Storage", value: "67% Used", icon: HardDrive, color: "bg-amber-500" },
  { label: "CPU", value: "23% Average", icon: Cpu, color: "bg-emerald-500" },
];

/* ── Audit Logs ── */

const auditLogs = [
  { time: "10:42 AM", user: "Sarah Chen", action: "Created user", resource: "Kim Tanaka", ip: "103.21.58.xx", device: "Chrome · Windows" },
  { time: "09:15 AM", user: "Sarah Chen", action: "Updated role permissions", resource: "Manager role", ip: "103.21.58.xx", device: "Chrome · Windows" },
  { time: "Yesterday", user: "Marcus Webb", action: "Suspended user", resource: "Jordan Lee", ip: "49.36.128.xx", device: "Safari · macOS" },
  { time: "Yesterday", user: "Sarah Chen", action: "Enabled feature flag", resource: "AI Recommendations", ip: "103.21.58.xx", device: "Chrome · Windows" },
  { time: "10 Jul", user: "Priya Sharma", action: "Changed user role", resource: "Alex Rivera → Manager", ip: "103.21.58.xx", device: "Chrome · Windows" },
  { time: "09 Jul", user: "Sarah Chen", action: "Deactivated user", resource: "Alex Rivera", ip: "103.21.58.xx", device: "Chrome · Windows" },
];

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
            { id: "permissions", label: "Permissions", icon: Key },
            { id: "health", label: "System Health", icon: Activity },
            { id: "audit", label: "Audit Controls", icon: ScrollText },
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                    {[
                      { label: "User" },
                      { label: "Role" },
                      { label: "Department", hide: true },
                      { label: "Status" },
                      { label: "Last Login", hide: true },
                      { label: "Actions" },
                    ].map((h) => (
                      <th key={h.label} className={`px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6 ${h.hide ? "hidden md:table-cell" : ""}`}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.email} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ${u.color}`}>{u.initials}</div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{u.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground sm:px-6">{u.role}</td>
                      <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{u.dept}</td>
                      <td className="px-3 py-3 sm:px-6">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[u.status]}`}>{u.status}</span>
                      </td>
                      <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">{u.lastLogin}</td>
                      <td className="px-3 py-3 sm:px-6">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-11 w-11" title="Edit" aria-label="Edit user"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="hidden h-11 w-11 sm:inline-flex" title="Suspend" aria-label="Suspend user"><Ban className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-11 w-11 text-destructive hover:text-destructive" title="Delete" aria-label="Delete user"><Trash2 className="h-3.5 w-3.5" /></Button>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((r) => (
              <div key={r.name} className="card-hover rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${r.color}/10`}>
                    <Shield className={`h-5 w-5 ${r.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.users} users · {r.permissions} permissions</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1">
                  <Button variant="ghost" size="default" className="flex-1 btn-enterprise"><Edit className="h-3 w-3" /> Edit</Button>
                  <Button variant="ghost" size="icon" className="h-11 w-11 btn-enterprise" aria-label="Duplicate role"><Copy className="h-3 w-3" /></Button>
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
                    <th className="px-3 py-2 text-muted-foreground">Role</th>
                    {permResources.map((r) => <th key={r} className="px-3 py-2 text-center text-muted-foreground">{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {permActions.map((a) => (
                    <tr key={a} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 font-medium text-foreground">{a}</td>
                      {permResources.map((r) => (
                        <td key={r} className="px-3 py-2 text-center">
                          {permMatrix["Administrator"][`${r}:${a}`] ? (
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

      {/* ── Permissions Tab ── */}
      {activeTab === "permissions" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Manager Permissions</h3>
              <p className="text-xs text-muted-foreground">Resource-action mapping for Manager role</p>
            </div>
          </div>
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

      {/* ── Audit Controls Tab ── */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          {/* Audit Cycle Management */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Audit Cycle</h3>
                <p className="text-xs text-muted-foreground">Manage automated audit schedules and retention</p>
              </div>
              <Button variant="outline" size="sm" className="btn-enterprise"><Settings className="h-3.5 w-3.5" /> Configure</Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Current Cycle</p>
                <p className="text-sm font-semibold text-foreground">Q2 2025</p>
                <p className="text-[11px] text-muted-foreground/60">Apr 1 – Jun 30</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Retention Policy</p>
                <p className="text-sm font-semibold text-foreground">12 Months</p>
                <p className="text-[11px] text-muted-foreground/60">Auto-archive after expiry</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Last Export</p>
                <p className="text-sm font-semibold text-foreground">Jul 10, 2025</p>
                <p className="text-[11px] text-muted-foreground/60">PDF · 2.4 MB</p>
              </div>
            </div>
          </div>

          {/* Recent Admin Actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Recent Admin Actions</h3>
              <Button variant="outline" size="sm" className="btn-enterprise"><Download className="h-3.5 w-3.5" /> Export Log</Button>
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
        </div>
      )}
    </div>
  );
}
