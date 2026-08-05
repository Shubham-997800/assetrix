"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ScrollText,
  User,
  Package,
  Server,
  Search,
  Download,
  Clock,
  Loader2,
} from "lucide-react";
import { notificationApi, ApiError } from "@/lib/api";

/* ── Tabs ── */

const tabs = [
  { id: "all", label: "All Activity", icon: ScrollText },
  { id: "user", label: "User Activity", icon: User },
  { id: "asset", label: "Asset Activity", icon: Package },
  { id: "system", label: "System Activity", icon: Server },
] as const;

type TabId = (typeof tabs)[number]["id"];
type ActivityCategory = "user" | "asset" | "system";

interface ActivityEntry {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  entityId?: string | null;
  createdAt: string;
  ipAddress?: string | null;
  category: ActivityCategory;
}

const ICON_BG: Record<ActivityCategory, string> = {
  user: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  asset: "bg-primary/10 text-primary",
  system: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

function categoryOf(a: { action: string; entity: string; userId: string | null }): ActivityCategory {
  if (!a.userId) return "system";
  const t = `${a.action} ${a.entity}`.toLowerCase();
  if (
    t.includes("asset") ||
    t.includes("allocation") ||
    t.includes("booking") ||
    t.includes("maintenance") ||
    t.includes("department") ||
    t.includes("category") ||
    t.includes("audit") ||
    t.includes("transfer")
  ) {
    return "asset";
  }
  return "user";
}

function toEntry(a: {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  description?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  user?: { firstName: string; lastName: string; role: string } | null;
}): ActivityEntry {
  return {
    id: a.id,
    userName: a.user ? `${a.user.firstName} ${a.user.lastName}` : "System",
    userRole: a.user?.role ?? "System",
    action: a.action,
    entity: a.entity,
    entityId: a.entityId,
    createdAt: a.createdAt,
    ipAddress: a.ipAddress,
    category: categoryOf(a),
  };
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Timeline Item ── */

const TimelineItem = React.memo(function TimelineItem({ entry }: { entry: ActivityEntry }) {
  const Icon = entry.category === "user" ? User : entry.category === "asset" ? Package : Server;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${ICON_BG[entry.category]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="mt-2 h-full w-px bg-border" />
      </div>
      <div className="flex-1 pb-8">
        <p className="text-sm font-medium text-foreground">
          <span className="font-semibold">{entry.userName}</span>{" "}
          <span className="text-muted-foreground">{entry.action.toLowerCase()}</span>
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {entry.entity}
            {entry.entityId ? ` (${entry.entityId})` : ""}
          </span>
          <span className="text-xs text-muted-foreground">
            {entry.userRole}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {fmtTime(entry.createdAt)}
          </span>
          {entry.ipAddress && (
            <span className="font-mono">{entry.ipAddress}</span>
          )}
        </div>
      </div>
    </div>
  );
});

/* ── Page ── */

function LogsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationApi.activity({ limit: 100 });
      const items = (res.data ?? []) as Array<Parameters<typeof toEntry>[0]>;
      setEntries(items.map(toEntry));
    } catch (err) {
      if (err instanceof ApiError && err.status !== 401) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const searchLower = useMemo(() => search.toLowerCase(), [search]);

  const filtered = useMemo(() => {
    let items = entries;
    if (activeTab !== "all") {
      items = items.filter((e) => e.category === activeTab);
    }
    if (searchLower) {
      items = items.filter(
        (e) =>
          e.userName.toLowerCase().includes(searchLower) ||
          e.action.toLowerCase().includes(searchLower) ||
          e.entity.toLowerCase().includes(searchLower) ||
          (e.entityId ?? "").toLowerCase().includes(searchLower)
      );
    }
    return items;
  }, [entries, activeTab, searchLower]);

  const exportCsv = useCallback(() => {
    const header = "Time,User,Role,Action,Entity,Entity ID,IP Address";
    const rows = filtered.map((e) =>
      [
        fmtTime(e.createdAt),
        e.userName,
        e.userRole,
        e.action,
        e.entity,
        e.entityId ?? "",
        e.ipAddress ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    setSearch("");
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Activity Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor system activity and audit trails</p>
        </div>
        <Button variant="outline" size="sm" className="btn-enterprise" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download className="h-3.5 w-3.5" /> Export Logs
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Log tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search activity logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-full max-w-md rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Content */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <p className="text-xs text-muted-foreground">{filtered.length} entries found</p>
          </div>
        </div>
        <div className="mt-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" className="mt-4 btn-enterprise" onClick={fetchActivity}>
                Retry
              </Button>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((entry) => <TimelineItem key={entry.id} entry={entry} />)
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No activity found matching your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(LogsPage);
