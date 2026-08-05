import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import type { UpcomingBooking } from "@/lib/types";

function fmtTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function BookingPreview({ bookings }: { bookings?: UpcomingBooking[] }) {
  const now = new Date();

  const list = (bookings ?? []).map((b) => ({
    id: b.id,
    room: b.asset?.name ?? "Unnamed asset",
    owner: b.user ? `${b.user.firstName} ${b.user.lastName}` : "Unknown",
    start: fmtTime(b.startDate),
    end: fmtTime(b.endDate),
    startDate: b.startDate,
    endDate: b.endDate,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Upcoming Bookings
            </h3>
            <p className="text-xs text-muted-foreground">
              {list.length} reservations
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
        {list.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
            No bookings scheduled.
          </p>
        ) : (
        list.map((b) => {
          const isOngoing = new Date(b.startDate) <= now && now < new Date(b.endDate);
          return (
            <div
              key={b.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-3 transition-colors ${
                isOngoing
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-xs font-semibold text-foreground">
                  {b.start}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {b.end}
                </span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{b.room}</p>
                <p className="text-xs text-muted-foreground">{b.owner}</p>
              </div>
              {isOngoing ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Ongoing
                </span>
              ) : (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Upcoming
                </span>
              )}
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
