"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDashboard } from "@/contexts/dashboard-context";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import {
  Search, Bell, Menu, PanelLeft, Sun, Moon, CheckCircle, AlertTriangle,
  Clock, User, LogOut, Settings, ChevronDown, Zap, HelpCircle, Sparkles,
} from "lucide-react";

const DUMMY_NOTIFICATIONS = [
  { id: "1", title: "Maintenance Overdue", desc: "MNT-042 laptop screen repair is 2 days overdue", time: "2h ago", type: "warning", read: false },
  { id: "2", title: "Booking Approved", desc: "Meeting Room A booking confirmed for today 2PM", time: "3h ago", type: "success", read: false },
  { id: "3", title: "Warranty Expiring", desc: "AF-0008 warranty expires in 30 days", time: "1d ago", type: "warning", read: true },
  { id: "4", title: "Asset Allocated", desc: "MacBook Pro AF-0001 allocated to Priya Shah", time: "2d ago", type: "info", read: true },
  { id: "5", title: "Audit Complete", desc: "Q3 audit cycle completed — 92% verified", time: "3d ago", type: "success", read: true },
];

const TASK_QUEUE = [
  { id: "t1", label: "Approve 3 allocation transfers", href: "/dashboard/allocations", priority: "high" },
  { id: "t2", label: "Review MNT-042 maintenance task", href: "/dashboard/maintenance", priority: "high" },
  { id: "t3", label: "Complete Q3 audit verification (14 assets)", href: "/dashboard/audit", priority: "medium" },
];

const TYPE_COLORS: Record<string, string> = {
  warning: "text-orange-500",
  success: "text-emerald-500",
  info: "text-primary",
};

export function DashboardNavbar() {
  const { setSearchOpen, sidebarCollapsed, toggleSidebar, isLight, toggleTheme, aiPanelOpen, setAiPanelOpen } = useDashboard();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);

  const unreadCount = DUMMY_NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (tasksRef.current && !tasksRef.current.contains(e.target as Node)) setTasksOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header role="banner" className="sticky top-0 z-20 flex h-16 items-center border-b border-border bg-card/80 backdrop-blur-md px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile sidebar toggle */}
        <button onClick={toggleSidebar} className="rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        {/* Desktop sidebar toggle */}
        <button onClick={toggleSidebar} className="hidden lg:flex rounded-lg p-2 min-h-[44px] min-w-[44px] items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground">
          {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </button>
        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 min-h-[44px] text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex ml-2 rounded border border-border bg-background px-1 py-0.5 text-[9px] font-medium">Ctrl K</kbd>
        </button>
        {/* Breadcrumbs */}
        <div className="hidden md:block ml-2">
          <BreadcrumbNav />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* AI Assistant toggle */}
        <button
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
          className={`relative rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${aiPanelOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          title="AI Assistant"
        >
          <Sparkles className="h-4 w-4" />
        </button>

        {/* Task Queue */}
        <div ref={tasksRef} className="relative">
        <button
          onClick={() => setTasksOpen(!tasksOpen)}
          className="relative rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Tasks"
          aria-label={`Pending tasks: ${TASK_QUEUE.length}`}
          aria-expanded={tasksOpen}
        >
            <Zap className="h-4 w-4" />
            {TASK_QUEUE.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
                {TASK_QUEUE.length}
              </span>
            )}
          </button>
          {tasksOpen && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-80 rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-xs font-semibold text-foreground">Pending Tasks</p>
                <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-500">{TASK_QUEUE.length} pending</span>
              </div>
              <div className="max-h-60 overflow-y-auto p-2">
                {TASK_QUEUE.map((task) => (
                  <Link key={task.id} href={task.href} onClick={() => setTasksOpen(false)} className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-xs hover:bg-muted">
                    <span className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${task.priority === "high" ? "bg-orange-500" : "bg-primary"}`} />
                    <span className="text-foreground">{task.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="relative rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Notifications"
          aria-label={`Notifications: ${unreadCount} unread`}
          aria-expanded={notificationsOpen}
        >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-96 rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-xs font-semibold text-foreground">Notifications</p>
                <Link href="/dashboard/notifications" onClick={() => setNotificationsOpen(false)} className="text-[10px] text-primary hover:underline">View all</Link>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {DUMMY_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-muted/50 ${!n.read ? "bg-primary/5" : ""}`}>
                    <span className={`mt-0.5 flex-shrink-0 ${TYPE_COLORS[n.type] || "text-muted-foreground"}`}>
                      {n.type === "warning" ? <AlertTriangle className="h-4 w-4" /> : n.type === "success" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{n.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground truncate">{n.desc}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/60">{n.time}</p>
                    </div>
                    {!n.read && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Toggle theme"
        >
          {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Help/shortcuts */}
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?", ctrlKey: true }))}
          className="hidden sm:flex rounded-lg p-2 min-h-[44px] min-w-[44px] items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Keyboard shortcuts"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative ml-1">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 min-h-[44px] hover:bg-muted"
            aria-label="User menu"
            aria-expanded={profileOpen}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">RS</span>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-foreground leading-tight">Rahul Shah</p>
              <p className="text-[10px] text-muted-foreground leading-tight">IT Administrator</p>
            </div>
            <ChevronDown className="hidden sm:block h-3 w-3 text-muted-foreground" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="border-b border-border px-4 py-3">
                <p className="text-xs font-semibold text-foreground">Rahul Shah</p>
                <p className="text-[10px] text-muted-foreground">rahul@assetrix.com</p>
              </div>
              <div className="p-1.5">
                <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                  <User className="h-3.5 w-3.5" /> Profile
                </Link>
                <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Settings className="h-3.5 w-3.5" /> Settings
                </Link>
                <Link href="/login" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
