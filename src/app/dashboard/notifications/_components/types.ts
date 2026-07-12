export type NotificationTab = "all" | "unread" | "booking" | "maintenance" | "audit" | "transfer" | "overdue" | "activity";

export type NotificationPriority = "critical" | "high" | "medium" | "low";

export type NotificationCategory = "booking" | "maintenance" | "audit" | "transfer" | "overdue";

export type ActivityCategory = "user" | "asset" | "approval" | "system";

export type ActivityStatus = "Success" | "Failed" | "Warning" | "Info";

export interface Notification {
  id: number;
  title: string;
  message: string;
  entity: string;
  timestamp: string;
  timeAgo: string;
  priority: NotificationPriority;
  unread: boolean;
  category: NotificationCategory;
  icon: string;
  iconBg: string;
  archived: boolean;
}

export interface ActivityLog {
  id: number;
  userName: string;
  userRole: string;
  action: string;
  targetEntity: string;
  targetId: string;
  timestamp: string;
  ipAddress: string;
  status: ActivityStatus;
  category: ActivityCategory;
}

export const PRIORITY_CLASSES: Record<NotificationPriority, string> = {
  critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  high: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-muted text-muted-foreground border-border",
};

export const STATUS_CLASSES: Record<ActivityStatus, string> = {
  Success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Failed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  Warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
};
