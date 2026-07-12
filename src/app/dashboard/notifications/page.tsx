"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Bell, RefreshCw } from "lucide-react";
import { NotificationTabs } from "./_components/notification-tabs";
import { notificationApi } from "@/lib/api";

export default function NotificationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

  const handleMarkAllRead = useCallback(async () => {
    setMarkingAll(true);
    try {
      await notificationApi.markAllRead();
    } catch {
      // child will handle errors on refresh
    } finally {
      setMarkingAll(false);
      setRefreshKey((k) => k + 1);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications & Activity Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Assetrix ERP — System notifications and operational audit trail</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-enterprise" onClick={() => setRefreshKey((k) => k + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          <Button variant="outline" size="sm" className="btn-enterprise" onClick={handleMarkAllRead} disabled={markingAll}><Bell className="h-3.5 w-3.5" /> Mark all read</Button>
        </div>
      </div>
      <NotificationTabs refreshKey={refreshKey} />
    </div>
  );
}
