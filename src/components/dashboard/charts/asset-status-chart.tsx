import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { assetStatuses } from "./dashboard-data";

export function AssetStatusChart() {
  const total = useMemo(() => assetStatuses.reduce((a, s) => a + s.value, 0), []);

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
            {assetStatuses.reduce(
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
          {assetStatuses.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="flex-1 text-xs text-muted-foreground">
                {s.label}
              </span>
              <span className="text-xs font-medium text-foreground">
                {s.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
