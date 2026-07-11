"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Shield,
  ScrollText,
  Zap,
  Menu,
  X,
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Users", href: "/dashboard" },
  { icon: FileText, label: "Reports", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard" },
  { icon: ScrollText, label: "Audit Logs", href: "/dashboard" },
  { icon: Shield, label: "Security", href: "/dashboard" },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

const kpiCards = [
  { label: "Total Revenue", value: "₹4.2Cr", change: "+18.2%" },
  { label: "Active Users", value: "24,589", change: "+7.1%" },
  { label: "Approvals", value: "1,482", change: "98% rate" },
  { label: "Uptime", value: "99.99%", change: "SLA met" },
];

const activityFeed = [
  { user: "Sarah Chen", action: "approved procurement order #8241", time: "2m ago" },
  { user: "Marcus Webb", action: "deployed workflow v2.4 to production", time: "8m ago" },
  { user: "Priya Sharma", action: "exported Q2 financial report", time: "15m ago" },
  { user: "Alex Rivera", action: "updated RBAC policy for finance team", time: "22m ago" },
  { user: "Jordan Lee", action: "resolved security audit finding #127", time: "31m ago" },
  { user: "Kim Tanaka", action: "created new approval workflow", time: "45m ago" },
];

const tableData = [
  { id: "ORD-8241", dept: "Procurement", amount: "₹12,45,000", status: "Approved", assignee: "S. Chen" },
  { id: "ORD-8240", dept: "Engineering", amount: "₹8,92,000", status: "Pending", assignee: "M. Webb" },
  { id: "ORD-8239", dept: "Marketing", amount: "₹5,68,000", status: "Approved", assignee: "P. Sharma" },
  { id: "ORD-8238", dept: "Operations", amount: "₹20,13,000", status: "Review", assignee: "A. Rivera" },
  { id: "ORD-8237", dept: "Finance", amount: "₹7,34,000", status: "Approved", assignee: "J. Lee" },
  { id: "ORD-8236", dept: "HR", amount: "₹3,42,000", status: "Pending", assignee: "K. Tanaka" },
];

const notifications = [
  { text: "Budget approved for Q3", time: "2m ago", unread: true },
  { text: "New vendor onboarded", time: "15m ago", unread: true },
  { text: "Security audit passed", time: "1h ago", unread: false },
  { text: "Report generated", time: "2h ago", unread: false },
  { text: "User onboarded", time: "3h ago", unread: false },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-[280px] flex-shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">Nexus</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sidebarLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@company.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex h-full w-[280px] flex-col border-r border-border bg-sidebar">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-foreground">Nexus</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <nav className="flex-1 space-y-1 p-3">
              {sidebarLinks.map((link) => (
                <Link key={link.label} href={link.href} onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <link.icon className="h-4 w-4" />{link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">JD</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Overview</h2>
              <p className="text-sm text-muted-foreground">Business operations at a glance</p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">{kpi.change}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
                <h3 className="text-sm font-semibold text-foreground">Revenue Overview</h3>
                <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
                <div className="mt-6 flex items-end gap-1.5" style={{ height: 200 }}>
                  {[35, 48, 42, 60, 52, 72, 65, 82, 78, 90, 85, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-0.5">
                      <div className="rounded-t-sm bg-primary/20 hover:bg-primary/30" style={{ height: `${h}%` }}>
                        <div className="rounded-t-sm bg-primary" style={{ height: `${50 + Math.random() * 50}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                <div className="mt-4 space-y-4">
                  {activityFeed.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{item.user}</span>{" "}
                          <span className="text-muted-foreground">{item.action}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <div className="mt-4 space-y-3">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-border"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{n.text}</p>
                        <p className="text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
                  <span className="text-xs text-primary cursor-pointer">Export CSV</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["ID", "Department", "Amount", "Status", "Assignee"].map((h) => (
                          <th key={h} className="pb-3 pr-4 text-xs font-medium text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row) => (
                        <tr key={row.id} className="border-b border-border last:border-0">
                          <td className="py-3 pr-4 font-medium text-foreground">{row.id}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{row.dept}</td>
                          <td className="py-3 pr-4 font-medium text-foreground">{row.amount}</td>
                          <td className="py-3 pr-4">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              row.status === "Approved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : row.status === "Pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}>{row.status}</span>
                          </td>
                          <td className="py-3 text-muted-foreground">{row.assignee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
