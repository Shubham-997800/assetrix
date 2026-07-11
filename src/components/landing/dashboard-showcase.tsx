"use client";

import {
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  CheckCircle,
  Bell,
  MoreHorizontal,
} from "lucide-react";

export function DashboardShowcase() {
  return (
    <section className="border-b border-border bg-muted/30 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Dashboard
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A command center for your operations
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Monitor every aspect of your business from a unified, real-time
            dashboard designed for decision makers.
          </p>
        </div>

        {/* Full Dashboard */}
        <div className="mt-8 sm:mt-12 md:mt-16 rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
          {/* Browser Bar */}
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted-foreground">
                nexus.platform/dashboard
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Top KPI Row */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Total Revenue", value: "₹4.2Cr", change: "+18.2%", icon: DollarSign },
                { label: "Active Users", value: "24,589", change: "+7.1%", icon: Users },
                { label: "Conversion", value: "4.12%", change: "+1.3%", icon: TrendingUp },
                { label: "System Uptime", value: "99.99%", change: "0.0%", icon: Activity },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {kpi.label}
                    </span>
                    <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-foreground">
                    {kpi.value}
                  </p>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {kpi.change}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Revenue Chart */}
              <div className="rounded-xl border border-border bg-background p-5 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Revenue Overview
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Monthly recurring revenue
                    </p>
                  </div>
                  <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-end gap-1.5" style={{ height: 180 }}>
                  {[35, 48, 42, 60, 52, 72, 65, 82, 78, 90, 85, 95].map(
                    (h, i) => (
                      <div key={i} className="flex-1 flex flex-col gap-0.5">
                        <div
                          className="rounded-t-sm bg-primary/20 transition-all hover:bg-primary/30"
                          style={{ height: `${h}%` }}
                        >
                          <div
                            className="rounded-t-sm bg-primary"
                            style={{ height: `${[62, 70, 55, 78, 65, 82, 72, 88, 80, 92, 85, 95][i]}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                  <div className="mt-2 flex justify-between text-[10px] text-muted-foreground overflow-hidden">
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(
                      (m, i) => (
                        <span key={m} className={i % 2 === 1 ? "hidden sm:inline" : ""}>{m}</span>
                      )
                    )}
                  </div>
              </div>

              {/* Activity Feed + Notifications */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">
                      Notifications
                    </p>
                    <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { text: "Budget approved for Q3", time: "2m ago" },
                      { text: "New vendor onboarded", time: "15m ago" },
                      { text: "Security audit passed", time: "1h ago" },
                    ].map((n) => (
                      <div key={n.text} className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <div>
                          <p className="text-xs text-foreground">{n.text}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">
                      Approval Queue
                    </p>
                    <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { name: "PO #4821", dept: "Procurement" },
                      { name: "Budget #127", dept: "Finance" },
                      { name: "Vendor #89", dept: "Operations" },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.dept}
                          </p>
                        </div>
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                          Pending
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
              <div className="rounded-xl border border-border bg-background p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Recent Transactions
                </p>
                <button className="min-h-[44px] min-w-[44px] rounded-lg px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5">
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["ID", "Department", "Amount", "Status", "Assigned To", "Date"].map(
                        (h) => (
                          <th
                            key={h}
                            className="pb-3 pr-4 text-xs font-medium text-muted-foreground"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "TXN-8241", dept: "Procurement", amount: "₹12,45,000", status: "Approved", assignee: "S. Chen", date: "Jul 10" },
                      { id: "TXN-8240", dept: "Engineering", amount: "₹8,92,000", status: "Pending", assignee: "M. Webb", date: "Jul 10" },
                      { id: "TXN-8239", dept: "Marketing", amount: "₹5,68,000", status: "Approved", assignee: "P. Sharma", date: "Jul 9" },
                      { id: "TXN-8238", dept: "Operations", amount: "₹20,13,000", status: "Review", assignee: "A. Rivera", date: "Jul 9" },
                      { id: "TXN-8237", dept: "Finance", amount: "₹7,34,000", status: "Approved", assignee: "J. Lee", date: "Jul 8" },
                    ].map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-3 pr-4 font-medium text-foreground">
                          {row.id}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {row.dept}
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
                        <td className="py-3 pr-4 text-muted-foreground">
                          {row.assignee}
                        </td>
                        <td className="py-3 text-muted-foreground">{row.date}</td>
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
