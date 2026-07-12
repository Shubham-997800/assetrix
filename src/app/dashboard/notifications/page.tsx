"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
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
} from "lucide-react";

type TabId = "all" | "unread" | "booking" | "maintenance" | "audit" | "transfer" | "overdue";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "unread", label: "Unread", icon: Bell },
  { id: "booking", label: "Booking Alerts", icon: CalendarCheck },
  { id: "maintenance", label: "Maintenance Alerts", icon: Wrench },
  { id: "audit", label: "Audit Alerts", icon: ClipboardCheck },
  { id: "transfer", label: "Transfer Alerts", icon: ArrowLeftRight },
  { id: "overdue", label: "Overdue Alerts", icon: Clock },
];

const priorityStyles: Record<string, string> = {
  critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  high: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-muted text-muted-foreground border-border",
};

interface Notification {
  id: number;
  title: string;
  message: string;
  entity: string;
  time: string;
  priority: "critical" | "high" | "medium" | "low";
  unread: boolean;
  category: "booking" | "maintenance" | "audit" | "transfer" | "overdue";
  icon: React.ElementType;
  iconBg: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Maintenance request MNT-302 approved",
    message: "Your maintenance request for HVAC unit inspection has been approved by the facility manager.",
    entity: "MNT-302",
    time: "2 min ago",
    priority: "critical",
    unread: true,
    category: "maintenance",
    icon: AlertTriangle,
    iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    id: 2,
    title: "Booking confirmed: Meeting Room A for Jul 14",
    message: "Your reservation for Meeting Room A on Jul 14, 2026 has been confirmed.",
    entity: "BK-1104",
    time: "15 min ago",
    priority: "medium",
    unread: true,
    category: "booking",
    icon: CalendarCheck,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    id: 3,
    title: "Transfer request TRF-201 pending approval",
    message: "Asset transfer request from Warehouse A to Office Floor 3 is awaiting manager approval.",
    entity: "TRF-201",
    time: "1 hour ago",
    priority: "high",
    unread: true,
    category: "transfer",
    icon: ArrowLeftRight,
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: 4,
    title: "Asset AST-045 reported missing during audit",
    message: "Quarterly audit flagged asset AST-045 (Dell Latitude 5540) as missing from its assigned location.",
    entity: "AST-045",
    time: "2 hours ago",
    priority: "critical",
    unread: true,
    category: "audit",
    icon: ClipboardCheck,
    iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    id: 5,
    title: "Scheduled maintenance completed: HVAC System",
    message: "Preventive maintenance for HVAC Unit 3 has been completed and logged.",
    entity: "MNT-298",
    time: "3 hours ago",
    priority: "low",
    unread: false,
    category: "maintenance",
    icon: Wrench,
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: 6,
    title: "Booking cancelled: Conference Room B",
    message: "Conference Room B reservation for Jul 12 has been cancelled by the requestor.",
    entity: "BK-1099",
    time: "5 hours ago",
    priority: "medium",
    unread: false,
    category: "booking",
    icon: CalendarCheck,
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: 7,
    title: "New asset registered: 5 Dell Monitors",
    message: "Five Dell 27\" monitors have been registered and assigned to the design department.",
    entity: "AST-090",
    time: "Yesterday",
    priority: "low",
    unread: false,
    category: "maintenance",
    icon: Info,
    iconBg: "bg-muted text-muted-foreground",
  },
  {
    id: 8,
    title: "Overdue return: MacBook Pro - 3 days overdue",
    message: "MacBook Pro (AST-072) assigned to John Doe is 3 days past the return date.",
    entity: "AST-072",
    time: "Yesterday",
    priority: "high",
    unread: true,
    category: "overdue",
    icon: Clock,
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

function NotificationCard({
  n,
  onArchive,
  onRead,
}: {
  n: Notification;
  onArchive: () => void;
  onRead: () => void;
}) {
  return (
    <div
      className={`flex gap-4 rounded-xl border p-4 transition-all ${
        n.unread
          ? "border-primary/20 bg-primary/5"
          : "border-border hover:bg-muted/30"
      }`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${n.iconBg}`}
      >
        <n.icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                n.unread ? "text-foreground" : "text-foreground/80"
              }`}
            >
              {n.title}
            </span>
            {n.unread && (
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
            )}
          </div>
          <span
            className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${priorityStyles[n.priority]}`}
          >
            {n.priority}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {n.entity}
          </span>
          <span className="text-xs text-muted-foreground/60">{n.time}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {n.unread && (
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 btn-enterprise"
            onClick={onRead}
            aria-label="Mark as read"
            title="Mark as read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 btn-enterprise"
          onClick={onArchive}
          aria-label="Archive"
          title="Archive"
        >
          <Archive className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((p) => p.map((n) => ({ ...n, unread: false })));
  };

  const archiveNotification = (id: number) => {
    setNotifications((p) => p.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    switch (activeTab) {
      case "all":
        return true;
      case "unread":
        return n.unread;
      case "booking":
        return n.category === "booking";
      case "maintenance":
        return n.category === "maintenance";
      case "audit":
        return n.category === "audit";
      case "transfer":
        return n.category === "transfer";
      case "overdue":
        return n.category === "overdue";
      default:
        return true;
    }
  });

  const tabEmptyMessages: Record<TabId, { title: string; description: string; icon: React.ElementType }> = {
    all: { title: "No notifications", description: "Notifications will appear here", icon: Bell },
    unread: { title: "All caught up", description: "No unread notifications", icon: CheckCheck },
    booking: { title: "No booking alerts", description: "Booking notifications will appear here", icon: CalendarCheck },
    maintenance: { title: "No maintenance alerts", description: "Maintenance notifications will appear here", icon: Wrench },
    audit: { title: "No audit alerts", description: "Audit notifications will appear here", icon: ClipboardCheck },
    transfer: { title: "No transfer alerts", description: "Transfer notifications will appear here", icon: ArrowLeftRight },
    overdue: { title: "No overdue alerts", description: "Overdue notifications will appear here", icon: Clock },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="btn-enterprise"
            onClick={markAllRead}
          >
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Notification tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === "unread" && unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-3xl space-y-3">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <NotificationCard
              key={n.id}
              n={n}
              onArchive={() => archiveNotification(n.id)}
              onRead={() => markAsRead(n.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={tabEmptyMessages[activeTab].icon}
            title={tabEmptyMessages[activeTab].title}
            description={tabEmptyMessages[activeTab].description}
          />
        )}
      </div>
    </div>
  );
}
