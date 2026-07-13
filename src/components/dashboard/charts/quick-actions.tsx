import {
  Plus, CalendarClock, Wrench, ClipboardCheck, ArrowLeftRight, BarChart3,
} from "lucide-react";

const quickActions = [
  { icon: Plus, label: "Register Asset", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", hover: "hover:border-blue-500/30" },
  { icon: CalendarClock, label: "Book Resource", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", hover: "hover:border-emerald-500/30" },
  { icon: Wrench, label: "Raise Maintenance", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", hover: "hover:border-amber-500/30" },
  { icon: ClipboardCheck, label: "Start Audit", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400", hover: "hover:border-violet-500/30" },
  { icon: ArrowLeftRight, label: "Transfer Asset", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400", hover: "hover:border-rose-500/30" },
  { icon: BarChart3, label: "View Reports", color: "bg-primary/10 text-primary", hover: "hover:border-primary/30" },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {quickActions.map((a) => (
          <button
            key={a.label}
            className={`flex flex-col items-center gap-2 rounded-xl border border-border p-3 transition-all ${a.hover} hover:bg-muted`}
            aria-label={a.label}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.color}`}>
              <a.icon className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-medium text-foreground leading-tight text-center">
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
