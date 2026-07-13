import Link from "next/link";
import {
  Clock, ChevronRight, ArrowLeftRight, Plus, Wrench, ArrowRightLeft,
  CalendarClock, ClipboardCheck, Circle,
} from "lucide-react";
import { activities } from "./dashboard-data";

const typeIcon: Record<string, typeof Plus> = {
  allocation: ArrowLeftRight,
  registration: Plus,
  maintenance: Wrench,
  transfer: ArrowRightLeft,
  booking: CalendarClock,
  audit: ClipboardCheck,
};

export function ActivityTimeline() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Recent Activities
            </h3>
            <p className="text-xs text-muted-foreground">Latest team actions</p>
          </div>
        </div>
        <Link
          href="/dashboard/logs"
          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {activities.map((a, i) => {
          const TypeIcon = typeIcon[a.type] || Circle;
          return (
            <div
              key={i}
              className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-muted/30"
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${a.color}`}
              >
                {a.user}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{a.name}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  <span className="font-medium text-primary">{a.entity}</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <TypeIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {a.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
