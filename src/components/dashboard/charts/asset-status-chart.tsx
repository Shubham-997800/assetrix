import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, PackageOpen } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

export function AssetStatusChart({ stats }: { stats?: DashboardStats }) {
  const statuses = useMemo(() => {
    if (!stats || stats.totalAssets === 0) return [];
    const built = [
      { label: "Available", value: stats.availableAssets, color: "#10B981" },
      { label: "Allocated", value: stats.allocatedAssets, color: "#0891B2" },
      { label: "Under Maintenance", value: stats.maintenanceAssets, color: "#F59E0B" },
      { label: "Lost", value: stats.lostAssets ?? 0, color: "#EF4444" },
      { label: "Retired", value: stats.retiredAssets ?? 0, color: "#64748B" },
      { label: "Stolen", value: stats.stolenAssets ?? 0, color: "#475569" },
    ];
    return built.filter((s) => s.value > 0);
  }, [stats]);

  const total = useMemo(() => statuses.reduce((a, s) => a + s.value, 0), [statuses]);

  if (!stats || stats.totalAssets === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Asset Status
            </h3>
            <p className="text-xs text-muted-foreground">
              Distribution across all statuses
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 py-8 text-center">
          <PackageOpen className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No assets registered yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Asset Status
          </h3>
          <p className="text-xs text-muted-foreground">
            Distribution across all statuses
          </p>
        </div>
        <Link
          href="/dashboard/assets"
          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          Details
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {statuses.reduce(
              (acc, s) => {
                const dash = (s.value / total) * 100;
                acc.elements.push(
                  <circle
                    key={s.label}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke={s.color}
                    strokeOpacity="0.85"
                    strokeWidth="3.5"
                    strokeDasharray={`${dash} ${100 - dash}`}
                    strokeDashoffset={`${-acc.offset}`}
                  />,
                );
                acc.offset += dash;
                return acc;
              },
              { offset: 0, elements: [] as React.ReactNode[] },
            ).elements}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">{total}</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {statuses.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="flex-1 text-xs text-muted-foreground">
                {s.label}
              </span>
              <span className="text-xs font-medium text-foreground">
                {s.value}{total > 0 ? ` (${Math.round((s.value / total) * 100)}%)` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
