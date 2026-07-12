"use client";

import {
  TrendingUp,
  Clock,
  Gauge,
  Wrench,
  CalendarCheck,
} from "lucide-react";

const metrics = [
  { label: "Asset Utilization", value: "+24%", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Maintenance Time", value: "-40%", icon: Clock, color: "text-blue-600 dark:text-blue-400" },
  { label: "Allocation Success", value: "+35%", icon: Gauge, color: "text-violet-600 dark:text-violet-400" },
  { label: "Audit Compliance", value: "99.8%", icon: Wrench, color: "text-amber-600 dark:text-amber-400" },
  { label: "Booking Efficiency", value: "+28%", icon: CalendarCheck, color: "text-rose-600 dark:text-rose-400" },
];

export function Analytics() {
  return (
    <section className="border-b border-border bg-background py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Analytics
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Measure what matters
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-time analytics dashboards with drillable charts, exportable
            reports, and automated insights for asset operations.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-border bg-card p-5 text-center transition-all hover:shadow-md"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">{m.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Line Chart - Asset Utilization */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Asset Utilization
            </h3>
            <p className="text-xs text-muted-foreground">Year over year</p>
            <div className="mt-6 flex items-end gap-1 h-40 sm:h-48">
              {[30, 38, 35, 48, 42, 58, 52, 68, 62, 78, 72, 88].map(
                (h, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-0.5">
                    <div
                      className="rounded-t-sm bg-primary/20"
                      style={{ height: `${h}%` }}
                    >
                      <div
                        className="rounded-t-sm bg-primary"
                        style={{ height: `${[60, 68, 55, 75, 65, 80, 72, 88, 78, 92, 85, 95][i]}%` }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Area Chart - Maintenance Frequency */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Maintenance Frequency
            </h3>
            <p className="text-xs text-muted-foreground">Monthly average</p>
            <div className="mt-6 relative h-40 sm:h-48">
              <svg viewBox="0 0 400 160" className="w-full h-full">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,120 L33,100 L66,108 L100,85 L133,92 L166,70 L200,75 L233,55 L266,60 L300,40 L333,45 L366,25 L400,20 L400,160 L0,160 Z"
                  fill="url(#areaGrad)"
                />
                <path
                  d="M0,120 L33,100 L66,108 L100,85 L133,92 L166,70 L200,75 L233,55 L266,60 L300,40 L333,45 L366,25 L400,20"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Bar Chart - Department Allocation */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Department Allocation
            </h3>
            <p className="text-xs text-muted-foreground">Asset distribution</p>
            <div className="mt-6 space-y-3">
              {[
                { dept: "Engineering", pct: 78 },
                { dept: "Operations", pct: 65 },
                { dept: "Marketing", pct: 52 },
                { dept: "HR", pct: 40 },
              ].map((d) => (
                <div key={d.dept}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{d.dept}</span>
                    <span className="text-xs font-medium text-foreground">
                      {d.pct}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-primary/10">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart - Retirement Forecast */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Retirement Forecast
            </h3>
            <p className="text-xs text-muted-foreground">Next 12 months</p>
            <div className="mt-6 flex items-center justify-center">
              <div className="relative h-36 w-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--primary)" strokeWidth="12" strokeDasharray="235 80" strokeOpacity="0.8" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="50 265" strokeDashoffset="-235" strokeOpacity="0.8" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray="15 290" strokeDashoffset="-285" strokeOpacity="0.8" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">2,450</p>
                    <p className="text-[10px] text-muted-foreground">Assets</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {[
                { label: "Retain", color: "bg-emerald-500" },
                { label: "Replace", color: "bg-yellow-500" },
                { label: "Dispose", color: "bg-red-500" },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${r.color}`} />
                  <span className="text-[10px] text-muted-foreground">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
