import { useState, useMemo, useCallback } from "react";
import {
  Bell, AlertTriangle, CheckCircle2, ArrowRightLeft, X,
} from "lucide-react";
import { notifications } from "./dashboard-data";

function typeColor(t: string) {
  if (t === "alert") return "bg-red-500/10 text-red-600 dark:text-red-400";
  if (t === "success")
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (t === "warning")
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return "bg-primary/10 text-primary";
}

type NotifFilter = "all" | "unread" | "alerts";

export function NotificationsWidget() {
  const [filter, setFilter] = useState<NotifFilter>("all");
  const [items, setItems] = useState(notifications);

  const filtered = useMemo(
    () =>
      filter === "unread"
        ? items.filter((n) => !n.read)
        : filter === "alerts"
          ? items.filter((n) => n.type === "alert")
          : items,
    [items, filter],
  );

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  );

  const markRead = useCallback(
    (id: number) =>
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      ),
    [],
  );

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-4 w-4 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Notifications
            </h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(["all", "unread", "alerts"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-label={`Filter: ${f}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-5 py-3 transition-colors hover:bg-muted/30 ${
                !n.read ? "bg-primary/[0.02]" : ""
              }`}
            >
              <div
                className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${typeColor(n.type)}`}
              >
                {n.type === "alert" ? (
                  <AlertTriangle className="h-3.5 w-3.5" />
                ) : n.type === "success" ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : n.type === "warning" ? (
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                ) : (
                  <Bell className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {n.title}
                  </p>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="flex-shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                      title="Mark as read"
                      aria-label={`Mark "${n.title}" as read`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.desc}</p>
                <p className="mt-1 text-[10px] text-muted-foreground/60">
                  {n.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
