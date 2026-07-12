"use client";

import {
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  FileText,
  MoreHorizontal,
} from "lucide-react";

const kpiCards = [
  { label: "Total Revenue", value: "₹4.2Cr", change: "+18.2%", icon: DollarSign },
  { label: "Active Users", value: "24,589", change: "+7.1%", icon: Users },
  { label: "Conversion Rate", value: "4.12%", change: "+1.3%", icon: TrendingUp },
  { label: "System Uptime", value: "99.99%", change: "0.0%", icon: Activity },
];

const activityFeed = [
  { user: "Sarah Chen", action: "approved procurement order #8241", time: "2m ago" },
  { user: "Marcus Webb", action: "deployed workflow v2.4 to production", time: "8m ago" },
  { user: "Priya Sharma", action: "exported Q2 financial report", time: "15m ago" },
  { user: "Alex Rivera", action: "updated RBAC policy for finance team", time: "22m ago" },
  { user: "Jordan Lee", action: "resolved security audit finding #127", time: "31m ago" },
];

const reports = [
  { name: "Q2 Revenue Analysis", type: "Financial", status: "Ready" },
  { name: "User Growth Report", type: "Analytics", status: "Ready" },
  { name: "Security Audit Log", type: "Compliance", status: "Generating" },
  { name: "Operational Summary", type: "Operations", status: "Ready" },
];

const tableData = [
  { id: "ORD-8241", department: "Procurement", amount: "₹12,45,000", status: "Approved", assignee: "S. Chen" },
  { id: "ORD-8240", department: "Engineering", amount: "₹8,92,000", status: "Pending", assignee: "M. Webb" },
  { id: "ORD-8239", department: "Marketing", amount: "₹5,68,000", status: "Approved", assignee: "P. Sharma" },
  { id: "ORD-8238", department: "Operations", amount: "₹20,13,000", status: "Under Review", assignee: "A. Rivera" },
  { id: "ORD-8237", department: "Finance", amount: "₹7,34,000", status: "Approved", assignee: "J. Lee" },
];

export function AnalyticsPreview() {
  return (
    <section className="border-b border-border bg-background py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Analytics
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Every metric, one dashboard
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Consolidate data from every department into a single source of truth
            with live, drillable analytics.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {/* KPI Cards Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                  </span>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {kpi.value}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {kpi.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Revenue Chart */}
            <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Revenue Trend
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Monthly recurring revenue
                  </p>
                </div>
                <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-end gap-2" style={{ height: 200 }}>
                {[35, 42, 38, 55, 48, 62, 58, 72, 68, 80, 75, 88].map(
                  (h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-1">
                      <div
                        className="rounded-t-sm bg-primary/20 transition-all hover:bg-primary/30"
                        style={{ height: `${h}%` }}
                      >
                        <div
                          className="rounded-t-sm bg-primary transition-all"
                          style={{
                            height: `${[65, 72, 58, 80, 68, 85, 75, 90, 82, 95, 88, 92][i]}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(
                  (m) => (
                    <span key={m}>{m}</span>
                  )
                )}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Activity Feed
                </h3>
                <span className="text-xs text-primary">View all</span>
              </div>
              <div className="space-y-4">
                {activityFeed.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{item.user}</span>{" "}
                        <span className="text-muted-foreground">
                          {item.action}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Reports */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Reports</h3>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {r.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.type}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.status === "Ready"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Recent Orders
                </h3>
                <span className="text-xs text-primary">Export CSV</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                        Order ID
                      </th>
                      <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                        Department
                      </th>
                      <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="pb-3 text-xs font-medium text-muted-foreground">
                        Assignee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-3 pr-4 font-medium text-foreground">
                          {row.id}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {row.department}
                        </td>
                        <td className="py-3 pr-4 font-medium text-foreground">
                          {row.amount}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              row.status === "Approved"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : row.status === "Pending"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {row.assignee}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
