import { memo } from "react";
import Link from "next/link";
import { useCountUp } from "@/hooks/use-count-up";
import {
  Package, ArrowLeftRight, Wrench, CalendarClock,
  ArrowRightLeft, RotateCcw, TrendingUp, TrendingDown,
} from "lucide-react";

const ICON_MAP = { Package, ArrowLeftRight, Wrench, CalendarClock, ArrowRightLeft, RotateCcw } as const;

type KpiItem = {
  label: string;
  value: number;
  change: string;
  up: boolean;
  icon: keyof typeof ICON_MAP;
  href: string;
};

export const KpiCard = memo(function KpiCard({ kpi, index }: { kpi: KpiItem; index: number }) {
  const count = useCountUp(kpi.value, 1200);
  const Icon = ICON_MAP[kpi.icon];

  return (
    <Link
      href={kpi.href}
      className="card-hover group rounded-xl border border-border bg-card p-4 animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-medium ${
            kpi.up
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {kpi.up ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {kpi.change}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">
        {count.toLocaleString("en-IN")}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
    </Link>
  );
});
