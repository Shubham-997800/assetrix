"use client";

import {
  Box,
  CalendarCheck,
  Wrench,
  RotateCcw,
  Clock,
  AlertTriangle,
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
            A command center for your assets
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Monitor every asset from allocation to retirement from a unified,
            real-time dashboard designed for operations managers.
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
                assetrix.app/dashboard
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Top KPI Row */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Assets Available", value: "12,450", change: "+2.4%", icon: Box },
                { label: "Active Bookings", value: "3,200", change: "+12%", icon: CalendarCheck },
                { label: "Maintenance Today", value: "24", change: "On Track", icon: Wrench },
                { label: "Pending Transfers", value: "18", change: "Awaiting", icon: RotateCcw },
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
              {/* Asset Utilization Chart */}
              <div className="rounded-xl border border-border bg-background p-5 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Asset Utilization
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Monthly allocation vs available
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

              {/* Notifications + Maintenance Queue */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">
                      Upcoming Returns
                    </p>
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { text: "Laptop #4821 - Engineering", time: "Due in 2 days" },
                      { text: "Projector #127 - Marketing", time: "Due tomorrow" },
                      { text: "Camera #89 - Media", time: "Overdue 1 day" },
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
                      Maintenance Queue
                    </p>
                    <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { name: "AC Unit #203", dept: "Floor 2" },
                      { name: "Printer #156", dept: "Admin Wing" },
                      { name: "Server Rack B3", dept: "Data Center" },
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
                          Scheduled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Table */}
              <div className="rounded-xl border border-border bg-background p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Recent Asset Activity
                </p>
                <button className="min-h-[44px] min-w-[44px] rounded-lg px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5">
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Asset ID", "Department", "Status", "Custodian", "Last Audit", "Next Due"].map(
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
                      { id: "AST-8241", dept: "Engineering", status: "Active", custodian: "S. Chen", audit: "Jul 10", next: "Oct 10" },
                      { id: "AST-8240", dept: "Marketing", status: "Maintenance", custodian: "M. Webb", audit: "Jul 9", next: "Jul 20" },
                      { id: "AST-8239", dept: "Finance", status: "Active", custodian: "P. Sharma", audit: "Jul 8", next: "Oct 8" },
                      { id: "AST-8238", dept: "Operations", status: "Transfer", custodian: "A. Rivera", audit: "Jul 7", next: "Oct 7" },
                      { id: "AST-8237", dept: "HR", status: "Active", custodian: "J. Lee", audit: "Jul 6", next: "Oct 6" },
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
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              row.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : row.status === "Maintenance"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {row.custodian}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{row.audit}</td>
                        <td className="py-3 text-muted-foreground">{row.next}</td>
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
