import Link from "next/link";
import { useMemo } from "react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { bookings } from "./dashboard-data";

export function BookingPreview() {
  const timeStr = useMemo(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Today&apos;s Bookings
            </h3>
            <p className="text-xs text-muted-foreground">
              {bookings.length} reservations
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View calendar
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-4 space-y-2">
        {bookings.map((b, i) => {
          const isOngoing =
            timeStr >= b.start && timeStr < b.end;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                isOngoing
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-semibold text-foreground">
                  {b.start}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {b.end}
                </span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{b.room}</p>
                <p className="text-xs text-muted-foreground">{b.owner}</p>
              </div>
              {isOngoing ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Ongoing
                </span>
              ) : (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Upcoming
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
