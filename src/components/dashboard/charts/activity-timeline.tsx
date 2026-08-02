import Link from "next/link";
import {
  Clock, ChevronRight, ArrowLeftRight, Plus, Wrench, ArrowRightLeft,
  CalendarClock, ClipboardCheck, Circle,
} from "lucide-react";
import type { ActivityLogItem } from "@/lib/types";

const typeIcon: Record<string, typeof Plus> = {
  allocation: ArrowLeftRight,
  registration: Plus,
  maintenance: Wrench,
  transfer: ArrowRightLeft,
  booking: CalendarClock,
  audit: ClipboardCheck,
};

const typeByAction: Record<string, string> = {
  ALLOCATED: "allocation",
  ALLOCATION: "allocation",
  REGISTERED: "registration",
  CREATED: "registration",
  MAINTAINED: "maintenance",
  MAINTENANCE: "maintenance",
  TRANSFERRED: "transfer",
  TRANSFER: "transfer",
  BOOKED: "booking",
  BOOKING: "booking",
  AUDITED: "audit",
  AUDIT: "audit",
};

function colorForIndex(i: number) {
  const colors = [
    "bg-emerald-500", "bg-primary", "bg-amber-500", "bg-violet-500",
    "bg-rose-500", "bg-blue-500", "bg-emerald-500", "bg-primary",
  ];
  return colors[i % colors.length];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.floor(diff / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function initials(f?: { firstName: string; lastName: string } | null) {
  if (!f) return "?";
  return `${f.firstName.charAt(0)}${f.lastName.charAt(0)}`.toUpperCase();
}

export function ActivityTimeline({ items }: { items?: ActivityLogItem[] }) {
  const list = items ?? [];
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
      {list.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
          No recent activity yet.
        </div>
      ) : (
      <div className="divide-y divide-border">
        {list.map((a, i) => {
          const TypeIcon = typeIcon[typeByAction[a.action] || "registration"] || Circle;
          return (
            <div
              key={a.id}
              className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-muted/30"
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${colorForIndex(i)}`}
              >
                {initials(a.user)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">
                    {a.user ? `${a.user.firstName} ${a.user.lastName}` : "System"}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {a.action.toLowerCase()}
                  </span>{" "}
                  <span className="font-medium text-primary">{a.entity}</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <TypeIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(a.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
