"use client";

import { Button } from "@/components/ui/button";
import { Bell, RefreshCw } from "lucide-react";
import { NotificationTabs } from "./_components/notification-tabs";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications & Activity Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Assetrix ERP — System notifications and operational audit trail</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-enterprise"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          <Button variant="outline" size="sm" className="btn-enterprise"><Bell className="h-3.5 w-3.5" /> Mark all read</Button>
        </div>
      </div>
      <NotificationTabs />
    </div>
  );
}
