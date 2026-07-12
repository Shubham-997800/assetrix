"use client";

import {
  TrendingUp,
  Clock,
  Gauge,
  Wrench,
  CalendarCheck,
} from "lucide-react";

const metrics = [
  { label: "Asset Utilization", value: "+24%", icon: TrendingUp, color: "text-emerald-500" },
  { label: "Maintenance Time", value: "-40%", icon: Clock, color: "text-blue-500" },
  { label: "Allocation Success", value: "+35%", icon: Gauge, color: "text-violet-500" },
  { label: "Audit Compliance", value: "99.8%", icon: Wrench, color: "text-amber-500" },
  { label: "Booking Efficiency", value: "+28%", icon: CalendarCheck, color: "text-rose-500" },
];

const utilizationData = [
  { month: "Jan", value: 62 },
  { month: "Feb", value: 68 },
  { month: "Mar", value: 55 },
  { month: "Apr", value: 75 },
  { month: "May", value: 65 },
  { month: "Jun", value: 80 },
  { month: "Jul", value: 72 },
  { month: "Aug", value: 88 },
  { month: "Sep", value: 78 },
  { month: "Oct", value: 92 },
  { month: "Nov", value: 85 },
  { month: "Dec", value: 95 },
];

const maintenanceData = [28, 35, 30, 42, 38, 52, 48, 62, 55, 70, 65, 78];

const departments = [
  { name: "Engineering", pct: 78, color: "bg-primary" },
  { name: "Operations", pct: 65, color: "bg-emerald-500" },
  { name: "Marketing", pct: 52, color: "bg-amber-500" },
  { name: "HR", pct: 40, color: "bg-violet-500" },
];

const retirement = [
  { label: "Retain", pct: 72, color: "bg-emerald-500" },
  { label: "Replace", pct: 18, color: "bg-amber-500" },
  { label: "Dispose", pct: 10, color: "bg-red-500" },
];

export function Analytics() {
  return (
    <section className="border-b border-border bg-muted/30 py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Analytics
          </p>
          <h2
            className="mt-3 font-bold tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.75rem, 0.5rem + 2vw, 3rem)" }}
          >
            Measure what matters
          </h2>
          <p
            className="mt-4 text-muted-foreground"
            style={{ fontSize: "clamp(0.95rem, 0.2rem + 0.8vw, 1.125rem)" }}
          >
            Real-time analytics dashboards with drillable charts, exportable
            reports, and automated insights for asset operations.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-16 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="group rounded-2xl border border-border bg-card p-5 text-center transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {m.value}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="mt-8 grid gap-5 sm:gap-6 lg:grid-cols-2">
          {/* Asset Utilization - Bar Chart */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Asset Utilization
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">Year over year</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" /> +24%
              </span>
            </div>
            <div className="mt-6 flex items-end gap-1.5" style={{ height: 200 }}>
              {utilizationData.map((d, i) => (
                <div key={i} className="group/bar relative flex-1">
                  <div
                    className="rounded-t-sm bg-primary/15 transition-all group-hover/bar:bg-primary/25"
                    style={{ height: `${d.value}%` }}
                  >
                    <div
                      className="rounded-t-sm bg-primary transition-colors group-hover/bar:bg-primary/90"
                      style={{ height: `${[65, 72, 58, 80, 68, 85, 75, 90, 82, 95, 88, 95][i]}%` }}
                    />
                  </div>
                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover/bar:opacity-100">
                    {d.value}%
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
              {utilizationData.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>

          {/* Maintenance Frequency - Area Chart */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Maintenance Frequency
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">Monthly average</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                <Clock className="h-3 w-3" /> -40%
              </span>
            </div>
            <div className="mt-6 relative" style={{ height: 200 }}>
              <svg viewBox="0 0 400 160" className="h-full w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="analyticsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,${160 - maintenanceData[0] * 1.8} ${maintenanceData.map((v, i) => `L${i * (400 / 11)},${160 - v * 1.8}`).join(" ")} L400,160 L0,160 Z`}
                  fill="url(#analyticsAreaGrad)"
                />
                <path
                  d={`M0,${160 - maintenanceData[0] * 1.8} ${maintenanceData.map((v, i) => `L${i * (400 / 11)},${160 - v * 1.8}`).join(" ")}`}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {maintenanceData.map((v, i) => (
                  <circle
                    key={i}
                    cx={i * (400 / 11)}
                    cy={160 - v * 1.8}
                    r="3"
                    fill="var(--background)"
                    stroke="var(--primary)"
                    strokeWidth="1.5"
                    className="opacity-0 transition-opacity hover:opacity-100"
                  />
                ))}
              </svg>
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
              {utilizationData.map((d) => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>

          {/* Department Allocation */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Department Allocation
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">Asset distribution</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                <Gauge className="h-3 w-3" /> +35%
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {departments.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{d.name}</span>
                    <span className="text-sm font-semibold text-foreground">{d.pct}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-primary/10">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${d.color}`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retirement Forecast - Donut */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Retirement Forecast
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">Next 12 months</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Wrench className="h-3 w-3" /> Planning
              </span>
            </div>
            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative h-40 w-40 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--border)" strokeWidth="3" />
                  {retirement.reduce(
                    (acc, r) => {
                      const dash = r.pct;
                      acc.elements.push(
                        <circle
                          key={r.label}
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          className={r.color}
                          strokeOpacity="0.8"
                          strokeWidth="3"
                          strokeDasharray={`${dash} ${100 - dash}`}
                          strokeDashoffset={`${-acc.offset}`}
                        />
                      );
                      acc.offset += dash;
                      return acc;
                    },
                    { offset: 0, elements: [] as React.ReactNode[] }
                  ).elements}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-foreground">2,450</p>
                  <p className="text-[10px] font-medium text-muted-foreground">Assets</p>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {retirement.map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${r.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{r.label}</span>
                        <span className="text-sm font-semibold text-foreground">{r.pct}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-primary/10">
                        <div
                          className={`h-full rounded-full ${r.color}`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
