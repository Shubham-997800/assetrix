"use client";

import { useMemo } from "react";
import { LIFECYCLE_STATS } from "./data";
import { STATUS_COLORS } from "./types";
import type { Asset, AssetStatus } from "./types";

interface AssetLifecycleTabProps {
  assets: Asset[];
}

export function AssetLifecycleTab({ assets }: AssetLifecycleTabProps) {
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    const total = assets.length || 1;
    return LIFECYCLE_STATS.map((s) => ({
      ...s,
      count: counts[s.label] ?? 0,
      pct: Math.round(((counts[s.label] ?? 0) / total) * 100),
    }));
  }, [assets]);

  const total = assets.length;

  const donutSegments = useMemo(() => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const filtered = stats.filter((s) => s.count > 0);

    return filtered.reduce<{ label: string; color: string; dashArray: string; dashOffset: number; pct: number; count: number; cumPct: number }[]>(
      (acc, s) => {
        const pct = s.count / (total || 1);
        const prevCum = acc.length > 0 ? acc[acc.length - 1].cumPct : 0;
        const dashArray = `${pct * circumference} ${circumference}`;
        const dashOffset = -prevCum * circumference;
        acc.push({
          label: s.label,
          color: s.color,
          dashArray,
          dashOffset,
          pct: Math.round(pct * 100),
          count: s.count,
          cumPct: prevCum + pct,
        });
        return acc;
      },
      []
    );
  }, [stats, total]);

  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, Record<string, number>> = {};
    assets.forEach((a) => {
      if (!cats[a.category]) cats[a.category] = {};
      cats[a.category][a.status] = (cats[a.category][a.status] || 0) + 1;
    });
    return Object.entries(cats)
      .map(([category, statuses]) => ({
        category,
        total: Object.values(statuses).reduce((s, v) => s + v, 0),
        statuses,
      }))
      .sort((a, b) => b.total - a.total);
  }, [assets]);

  const departmentBreakdown = useMemo(() => {
    const depts: Record<string, Record<string, number>> = {};
    assets.forEach((a) => {
      if (!depts[a.department]) depts[a.department] = {};
      depts[a.department][a.status] = (depts[a.department][a.status] || 0) + 1;
    });
    return Object.entries(depts)
      .map(([dept, statuses]) => ({
        dept,
        total: Object.values(statuses).reduce((s, v) => s + v, 0),
        statuses,
      }))
      .sort((a, b) => b.total - a.total);
  }, [assets]);

  return (
    <div className="space-y-6">
      {/* Donut + Legend */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">
            Lifecycle Distribution
          </h3>
          <p className="text-xs text-muted-foreground">
            {total} total assets across all lifecycle stages
          </p>

          <div className="mt-6 flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
            {/* SVG Donut */}
            <div className="relative flex-shrink-0">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted/50"
                  strokeWidth="24"
                />
                {/* Segments */}
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.label}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="24"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    strokeLinecap="butt"
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{total}</span>
                <span className="text-xs text-muted-foreground">Total Assets</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-1 flex-col gap-2.5 sm:mt-0">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[s.label as AssetStatus] }}
                  />
                  <span className="flex-1 text-sm text-foreground">{s.label}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {s.count}
                  </span>
                  <span className="w-12 text-right text-xs text-muted-foreground">
                    {s.pct}%
                  </span>
                  <div className="hidden w-24 sm:block">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${s.pct}%`,
                          backgroundColor: STATUS_COLORS[s.label as AssetStatus],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[s.label as AssetStatus] }}
                />
                <span className="text-sm font-medium text-foreground">
                  {s.label}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{s.count}</p>
                <p className="text-xs text-muted-foreground">
                  {s.pct}% of total assets
                </p>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${s.pct}%`,
                    backgroundColor: STATUS_COLORS[s.label as AssetStatus],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">
          Breakdown by Category
        </h3>
        <p className="text-xs text-muted-foreground">
          Asset status distribution per category
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">
                  Total
                </th>
                {LIFECYCLE_STATS.map((s) => (
                  <th
                    key={s.label}
                    className="px-3 py-3 text-xs font-medium text-muted-foreground text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[s.label as AssetStatus] }}
                      />
                      <span className="hidden lg:inline">{s.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map((cat) => (
                <tr
                  key={cat.category}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {cat.category}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {cat.total}
                  </td>
                  {LIFECYCLE_STATS.map((s) => (
                    <td
                      key={s.label}
                      className="px-3 py-3 text-center text-muted-foreground"
                    >
                      {cat.statuses[s.label] ?? 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">
          Breakdown by Department
        </h3>
        <p className="text-xs text-muted-foreground">
          Asset status distribution per department
        </p>
        <div className="mt-4 space-y-4">
          {departmentBreakdown.map((dept) => (
            <div key={dept.dept}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {dept.dept}
                </span>
                <span className="text-xs text-muted-foreground">
                  {dept.total} assets
                </span>
              </div>
              <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-muted">
                {LIFECYCLE_STATS.map((s) => {
                  const count = dept.statuses[s.label] ?? 0;
                  if (count === 0) return null;
                  const pct = (count / dept.total) * 100;
                  return (
                    <div
                      key={s.label}
                      className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: STATUS_COLORS[s.label as AssetStatus],
                      }}
                      title={`${s.label}: ${count}`}
                    />
                  );
                })}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-3">
                {LIFECYCLE_STATS.map((s) => {
                  const count = dept.statuses[s.label] ?? 0;
                  if (count === 0) return null;
                  return (
                    <span
                      key={s.label}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[s.label as AssetStatus] }}
                      />
                      {s.label}: {count}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
