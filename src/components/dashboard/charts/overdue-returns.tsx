import Link from "next/link";
import { AlertTriangle, Send, ChevronRight } from "lucide-react";
import { overdueItems } from "./dashboard-data";

function priorityStyle(p: "warning" | "high" | "critical") {
  if (p === "critical")
    return "border-l-red-500 bg-red-500/5 text-red-600 dark:text-red-400";
  if (p === "high")
    return "border-l-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400";
  return "border-l-yellow-500 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400";
}

export function OverdueReturns() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Overdue Returns
            </h3>
            <p className="text-xs text-muted-foreground">
              {overdueItems.length} items past return date
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/allocations"
          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {overdueItems.map((item) => (
          <div
            key={item.tag}
            className={`flex items-center gap-4 border-l-2 px-5 py-3 transition-colors hover:bg-muted/30 ${priorityStyle(item.priority)}`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-muted-foreground">
                  {item.tag}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.holder} &middot; {item.dept} &middot; Due {item.returnDate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  item.priority === "critical"
                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                    : item.priority === "high"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {item.days}d overdue
              </span>
              <button
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Send reminder"
                aria-label={`Send reminder for ${item.name}`}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
