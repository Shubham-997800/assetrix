"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  CheckCheck,
  Archive,
  AlertTriangle,
  Info,
  Wrench,
  CalendarCheck,
  ClipboardCheck,
  ArrowLeftRight,
  Clock,
  Shield,
  User,
  Settings,
  Trash2,
  Filter,
  Loader2,
} from "lucide-react";
import { TableDropdown } from "@/app/dashboard/assets/_components/table-dropdown";
import { PRIORITY_CLASSES, STATUS_CLASSES, type NotificationTab, type ActivityStatus, type NotificationCategory } from "./types";
import { MOCK_ACTIVITY_LOGS } from "./data";
import { notificationApi, ApiError } from "@/lib/api";
import type { Notification as ApiNotification } from "@/lib/types";

const ITEMS_PER_PAGE = 10;
const inputCls = "h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

const ICON_MAP: Record<string, React.ElementType> = {
  wrench: Wrench,
  calendar: CalendarCheck,
  "arrow-left-right": ArrowLeftRight,
  "clipboard-check": ClipboardCheck,
  clock: Clock,
  info: Info,
};

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  user: User,
  asset: Settings,
  approval: Shield,
  system: Settings,
};

function computeTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function mapNotificationType(type: string): { category: NotificationCategory; icon: string; iconBg: string } {
  const t = type?.toLowerCase() || "";
  if (t.includes("booking")) return { category: "booking", icon: "calendar", iconBg: "bg-primary/10 text-primary" };
  if (t.includes("maintenance")) return { category: "maintenance", icon: "wrench", iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
  if (t.includes("audit")) return { category: "audit", icon: "clipboard-check", iconBg: "bg-red-500/10 text-red-600 dark:text-red-400" };
  if (t.includes("transfer")) return { category: "transfer", icon: "arrow-left-right", iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
  if (t.includes("overdue")) return { category: "overdue", icon: "clock", iconBg: "bg-red-500/10 text-red-600 dark:text-red-400" };
  return { category: "maintenance", icon: "info", iconBg: "bg-primary/10 text-primary" };
}

function mapApiNotification(n: ApiNotification) {
  const mapped = mapNotificationType(n.type);
  return {
    id: n.id,
    title: n.title,
    message: n.message,
    entity: n.link || "",
    timestamp: n.createdAt,
    timeAgo: computeTimeAgo(n.createdAt),
    priority: "medium" as const,
    unread: !n.isRead,
    category: mapped.category,
    icon: mapped.icon,
    iconBg: mapped.iconBg,
    archived: false,
  };
}

export function NotificationTabs({ refreshKey = 0 }: { refreshKey?: number }) {
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<ReturnType<typeof mapApiNotification>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activitySearch, setActivitySearch] = useState("");
  const [activityUserFilter, setActivityUserFilter] = useState("All");
  const [activityCategoryFilter, setActivityCategoryFilter] = useState("All");
  const [activityPage, setActivityPage] = useState(1);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationApi.list();
      const items = (res.data ?? []) as ApiNotification[];
      setNotifications(items.map(mapApiNotification));
    } catch (err) {
      if (err instanceof ApiError && err.status !== 401) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, refreshKey]);

  const unreadCount = notifications.filter((n) => !n.archived && n.unread).length;

  const tabs: { key: NotificationTab; label: string; icon: React.ElementType }[] = [
    { key: "all", label: "All Notifications", icon: Bell },
    { key: "unread", label: "Unread", icon: Bell },
    { key: "booking", label: "Booking", icon: CalendarCheck },
    { key: "maintenance", label: "Maintenance", icon: Wrench },
    { key: "audit", label: "Audit", icon: ClipboardCheck },
    { key: "transfer", label: "Transfer", icon: ArrowLeftRight },
    { key: "overdue", label: "Overdue", icon: Clock },
    { key: "activity", label: "Activity Logs", icon: Shield },
  ];

  const markAsRead = async (id: string) => {
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    try {
      await notificationApi.markRead(id);
    } catch {
      setNotifications((p) => p.map((n) => (n.id === id ? { ...n, unread: true } : n)));
    }
  };

  const markAllRead = async () => {
    setNotifications((p) => p.map((n) => ({ ...n, unread: false })));
    try {
      await notificationApi.markAllRead();
    } catch {
      fetchNotifications();
    }
  };

  const archiveNotification = (id: string) => {
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, archived: true } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications((p) => p.filter((n) => n.id !== id));
  };

  const filteredNotifications = useMemo(() => {
    let items = notifications.filter((n) => !n.archived);
    if (activeTab === "unread") items = items.filter((n) => n.unread);
    else if (activeTab !== "all" && activeTab !== "activity") items = items.filter((n) => n.category === activeTab);
    if (priorityFilter !== "All") items = items.filter((n) => n.priority === priorityFilter.toLowerCase());
    if (search.trim()) { const s = search.toLowerCase(); items = items.filter((n) => n.title.toLowerCase().includes(s) || n.message.toLowerCase().includes(s) || n.entity.toLowerCase().includes(s)); }
    return items;
  }, [notifications, activeTab, priorityFilter, search]);

  const filteredActivities = useMemo(() => {
    let items = [...MOCK_ACTIVITY_LOGS];
    if (activityUserFilter !== "All") items = items.filter((l) => l.userRole === activityUserFilter);
    if (activityCategoryFilter !== "All") items = items.filter((l) => l.category === activityCategoryFilter);
    if (activitySearch.trim()) { const s = activitySearch.toLowerCase(); items = items.filter((l) => l.userName.toLowerCase().includes(s) || l.action.toLowerCase().includes(s) || l.targetEntity.toLowerCase().includes(s) || l.targetId.toLowerCase().includes(s)); }
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activitySearch, activityUserFilter, activityCategoryFilter]);

  const notifTotal = filteredNotifications.length;
  const notifTotalPages = Math.max(1, Math.ceil(notifTotal / ITEMS_PER_PAGE));
  const notifPaged = filteredNotifications.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const actTotal = filteredActivities.length;
  const actTotalPages = Math.max(1, Math.ceil(actTotal / ITEMS_PER_PAGE));
  const actPaged = filteredActivities.slice((activityPage - 1) * ITEMS_PER_PAGE, activityPage * ITEMS_PER_PAGE);

  const uniqueRoles = [...new Set(MOCK_ACTIVITY_LOGS.map((l) => l.userRole))];

  if (activeTab === "activity") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <Input placeholder="Search activity logs..." value={activitySearch} onChange={(e) => { setActivitySearch(e.target.value); setActivityPage(1); }} className={`${inputCls} pl-9`} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <TableDropdown label="" options={["All", ...uniqueRoles].map((r) => ({ label: r, value: r }))} value={activityUserFilter} onChange={(v) => { setActivityUserFilter(v); setActivityPage(1); }} placeholder="All Roles" />
            <TableDropdown label="" options={["All", "user", "asset", "approval", "system"].map((c) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c }))} value={activityCategoryFilter} onChange={(v) => { setActivityCategoryFilter(v); setActivityPage(1); }} placeholder="All Types" />
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">User</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Action</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Target</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Timestamp</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">IP Address</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actPaged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">No activity logs found</TableCell>
                </TableRow>
              ) : (
                actPaged.map((log) => {
                  const IconComp = ACTIVITY_ICONS[log.category] || Settings;
                  return (
                    <TableRow key={log.id} className="border-border hover:bg-muted/20">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                            <IconComp className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{log.userName}</p>
                            <p className="text-[11px] text-muted-foreground">{log.userRole}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-xs text-foreground">{log.action}</span></TableCell>
                      <TableCell>
                        <div>
                          <p className="text-xs text-foreground">{log.targetEntity}</p>
                          <p className="text-[11px] text-muted-foreground">{log.targetId}</p>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-xs text-muted-foreground">{log.timestamp.replace("T", " ").slice(0, 16)}</span></TableCell>
                      <TableCell><span className="text-xs text-muted-foreground font-mono">{log.ipAddress}</span></TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLASSES[log.status as ActivityStatus]}`}>
                          {log.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {actTotalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Showing {(activityPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(activityPage * ITEMS_PER_PAGE, actTotal)} of {actTotal}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setActivityPage((p) => Math.max(1, p - 1))} disabled={activityPage === 1}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-foreground">{activityPage} / {actTotalPages}</span>
              <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setActivityPage((p) => Math.min(actTotalPages, p + 1))} disabled={activityPage === actTotalPages}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <Input placeholder="Search notifications..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${inputCls} pl-9`} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <TableDropdown label="" options={["All", "Critical", "High", "Medium", "Low"].map((p) => ({ label: p, value: p }))} value={priorityFilter} onChange={(v) => { setPriorityFilter(v); setPage(1); }} placeholder="All Priorities" />
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="btn-enterprise" onClick={markAllRead}>
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-1 flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); setSearch(""); }}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${activeTab === tab.key ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}>
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            {tab.key === "unread" && unreadCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="max-w-4xl space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="mt-5 text-base font-semibold text-foreground">Failed to load notifications</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" className="mt-4 btn-enterprise" onClick={fetchNotifications}>Retry</Button>
          </div>
        ) : notifPaged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="mt-5 text-base font-semibold text-foreground">No notifications</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">Notifications will appear here</p>
          </div>
        ) : (
          notifPaged.map((n) => {
            const IconComp = ICON_MAP[n.icon] || Info;
            return (
              <div key={n.id} className={`flex gap-4 rounded-xl border p-4 transition-all ${n.unread ? "border-primary/20 bg-primary/5" : "border-border hover:bg-muted/30"}`}>
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${n.iconBg}`}>
                  <IconComp className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${n.unread ? "text-foreground" : "text-foreground/80"}`}>{n.title}</span>
                      {n.unread && <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                    </div>
                    <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_CLASSES[n.priority]}`}>{n.priority}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{n.entity}</span>
                    <span className="text-xs text-muted-foreground/60">{n.timeAgo}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {n.unread && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markAsRead(n.id)} title="Mark as read">
                      <CheckCheck className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => archiveNotification(n.id)} title="Archive">
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteNotification(n.id)} title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {notifTotalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, notifTotal)} of {notifTotal}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-foreground">{page} / {notifTotalPages}</span>
            <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setPage((p) => Math.min(notifTotalPages, p + 1))} disabled={page === notifTotalPages}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
