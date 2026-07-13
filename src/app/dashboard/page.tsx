"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { dashboardApi, ApiError } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import {
  KpiCard,
  OverdueReturns,
  QuickActions,
  ActivityTimeline,
  AssetStatusChart,
  NotificationsWidget,
  BookingPreview,
  DepartmentSummary,
  defaultStats,
  buildKpis,
} from "@/components/dashboard/charts";

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-border bg-card p-5 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-2 w-12 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-7 w-16 rounded bg-muted" />
        <div className="h-2 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}

export default memo(function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [error, setError] = useState<string | null>(null);

  const dateString = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    dashboardApi
      .getStats()
      .then((res) => {
        if (!cancelled && res.data) setStats(res.data as DashboardStats);
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : "Failed to load dashboard";
          setError(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const kpis = buildKpis(stats);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <SkeletonCard className="lg:col-span-2" />
          <SkeletonCard />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Operational command center &mdash; {dateString}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          {error} &mdash; showing placeholder data.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Overdue Returns */}
      <OverdueReturns />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <ActivityTimeline />
          <AssetStatusChart />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <NotificationsWidget />
          <BookingPreview />
        </div>
      </div>

      {/* Department Summary */}
      <DepartmentSummary />
    </div>
  );
});
