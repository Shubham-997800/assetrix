"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCheck,
  Archive,
  AtSign,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  RotateCcw,
  Filter,
} from "lucide-react";

const tabs = [
  { id: "all", label: "All", icon: Bell },
  { id: "unread", label: "Unread", icon: Bell },
  { id: "mentioned", label: "Mentioned", icon: AtSign },
  { id: "archived", label: "Archived", icon: Archive },
  { id: "preferences", label: "Preferences", icon: Settings },
];

const priorityStyles = {
  critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  high: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-muted text-muted-foreground border-border",
};

const priorityIcons = {
  critical: AlertTriangle,
  high: AlertTriangle,
  medium: Info,
  low: Info,
};

interface Notification {
  id: number;
  title: string;
  message: string;
  entity?: string;
  time: string;
  priority: "critical" | "high" | "medium" | "low";
  unread: boolean;
  archived: boolean;
  mentioned: boolean;
  icon: React.ElementType;
  iconBg: string;
}

const initialNotifications: Notification[] = [
  { id: 1, title: "AI Recommendation Generated", message: "Vendor C recommended with 93% confidence score for Q3 procurement.", entity: "RFQ-102", time: "2 min ago", priority: "high", unread: true, archived: false, mentioned: false, icon: AlertTriangle, iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: 2, title: "Sarah Chen mentioned you", message: "Assigned you to review procurement order ORD-8241.", entity: "ORD-8241", time: "8 min ago", priority: "medium", unread: true, archived: false, mentioned: true, icon: AtSign, iconBg: "bg-primary/10 text-primary" },
  { id: 3, title: "Budget Approved", message: "Q3 department budget of ₹45,00,000 has been approved by finance.", entity: "Budget-Q3", time: "15 min ago", priority: "high", unread: true, archived: false, mentioned: false, icon: CheckCircle, iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: 4, title: "Security Alert", message: "New login detected from Chrome on Windows 11, Ahmedabad.", entity: "Session", time: "1 hour ago", priority: "critical", unread: true, archived: false, mentioned: false, icon: AlertTriangle, iconBg: "bg-red-500/10 text-red-600 dark:text-red-400" },
  { id: 5, title: "Marcus Webb assigned you", message: "You have been assigned to workflow deployment v2.4.", entity: "WF-204", time: "2 hours ago", priority: "medium", unread: false, archived: false, mentioned: true, icon: AtSign, iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { id: 6, title: "Report Generated", message: "Q2 financial summary report is ready for download.", entity: "RPT-89", time: "3 hours ago", priority: "low", unread: false, archived: false, mentioned: false, icon: CheckCircle, iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: 7, title: "Workflow Completed", message: "Vendor onboarding workflow completed successfully for TechCorp.", entity: "WF-198", time: "5 hours ago", priority: "low", unread: false, archived: false, mentioned: false, icon: CheckCircle, iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: 8, title: "System Maintenance", message: "Scheduled maintenance window: 12 Jul 2026, 02:00 AM IST.", entity: "System", time: "Yesterday", priority: "medium", unread: false, archived: false, mentioned: false, icon: Info, iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
];

const archivedNotifications: Notification[] = [
  { id: 101, title: "Order ORD-8100 approved", message: "Procurement order has been completed.", entity: "ORD-8100", time: "3 days ago", priority: "low", unread: false, archived: true, mentioned: false, icon: CheckCircle, iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: 102, title: "Weekly report sent", message: "Your weekly activity digest was emailed.", entity: "Report", time: "5 days ago", priority: "low", unread: false, archived: true, mentioned: false, icon: CheckCircle, iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
];

function NotificationCard({ n, onArchive, onRead, onRestore }: {
  n: Notification;
  onArchive: () => void;
  onRead: () => void;
  onRestore?: () => void;
}) {
  const PIcon = priorityIcons[n.priority];

  return (
    <div className={`flex gap-4 rounded-xl border p-4 transition-all ${
      n.unread ? "border-primary/20 bg-primary/5" : "border-border hover:bg-muted/30"
    }`}>
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${n.iconBg}`}>
        <n.icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${n.unread ? "text-foreground" : "text-foreground/80"}`}>{n.title}</span>
            {n.unread && <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
          </div>
          <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${priorityStyles[n.priority]}`}>
            <PIcon className="inline h-2.5 w-2.5 mr-0.5" />{n.priority}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
        <div className="mt-2 flex items-center gap-3">
          {n.entity && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{n.entity}</span>
          )}
          <span className="text-xs text-muted-foreground/60">{n.time}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {!n.archived && (
          <>
            {n.unread && (
              <Button variant="ghost" size="icon" className="h-7 w-7 btn-enterprise" onClick={onRead} title="Mark as read">
                <CheckCheck className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 btn-enterprise" onClick={onArchive} title="Archive">
              <Archive className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
        {n.archived && onRestore && (
          <Button variant="ghost" size="icon" className="h-7 w-7 btn-enterprise" onClick={onRestore} title="Restore">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

function PreferencesTab() {
  const [settings, setSettings] = useState({
    email: true, push: true, security: true, mentions: true, weekly: true, product: false,
  });
  const update = (k: keyof typeof settings, v: boolean) => setSettings((p) => ({ ...p, [k]: v }));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">Notification Preferences</h3>
      <p className="text-xs text-muted-foreground">Control what you receive</p>
      <div className="mt-5 space-y-0 divide-y divide-border">
        {[
          { key: "email" as const, label: "Email Alerts", desc: "Receive notifications via email" },
          { key: "push" as const, label: "Push Notifications", desc: "Browser push notifications" },
          { key: "security" as const, label: "Security Alerts", desc: "Login and suspicious activity" },
          { key: "mentions" as const, label: "Mentions", desc: "When someone @mentions you" },
          { key: "weekly" as const, label: "Weekly Reports", desc: "Weekly activity digest" },
          { key: "product" as const, label: "Product Updates", desc: "New features and changes" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <button role="switch" aria-checked={settings[item.key]} onClick={() => update(item.key, !settings[item.key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[item.key] ? "bg-primary" : "bg-muted"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[item.key] ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [archived, setArchived] = useState(archivedNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const archiveNotification = (id: number) => {
    const n = notifications.find((n) => n.id === id);
    if (n) {
      setNotifications((p) => p.filter((n) => n.id !== id));
      setArchived((p) => [{ ...n, archived: true, unread: false }, ...p]);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((p) => p.map((n) => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllRead = () => {
    setNotifications((p) => p.map((n) => ({ ...n, unread: false })));
  };

  const restoreNotification = (id: number) => {
    const n = archived.find((n) => n.id === id);
    if (n) {
      setArchived((p) => p.filter((n) => n.id !== id));
      setNotifications((p) => [{ ...n, archived: false }, ...p]);
    }
  };

  const filtered = activeTab === "all"
    ? notifications
    : activeTab === "unread"
    ? notifications.filter((n) => n.unread)
    : activeTab === "mentioned"
    ? notifications.filter((n) => n.mentioned)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="btn-enterprise" onClick={markAllRead}>
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Notification tabs">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === "unread" && unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-3xl space-y-3">
        {activeTab === "archived" ? (
          archived.length > 0 ? (
            archived.map((n) => (
              <NotificationCard key={n.id} n={n} onArchive={() => {}} onRead={() => {}} onRestore={() => restoreNotification(n.id)} />
            ))
          ) : (
            <EmptyState icon={Archive} title="No archived notifications" description="Archived notifications will appear here" />
          )
        ) : activeTab === "preferences" ? (
          <PreferencesTab />
        ) : filtered.length > 0 ? (
          filtered.map((n) => (
            <NotificationCard key={n.id} n={n} onArchive={() => archiveNotification(n.id)} onRead={() => markAsRead(n.id)} />
          ))
        ) : (
          <EmptyState
            icon={activeTab === "unread" ? CheckCircle : activeTab === "mentioned" ? AtSign : Bell}
            title={activeTab === "unread" ? "All caught up" : activeTab === "mentioned" ? "No mentions" : "No notifications"}
            description={activeTab === "unread" ? "No unread notifications" : activeTab === "mentioned" ? "No one has mentioned you yet" : "Notifications will appear here"}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
