"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, LogOut, Globe, Loader2 } from "lucide-react";
import { authApi, ApiError } from "@/lib/api";
import type { Session } from "@/lib/types";

export function ActiveSessions() {
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authApi.getSessions();
      setItems((res.data ?? []) as Session[]);
    } catch (err) {
      if (err instanceof ApiError && err.status !== 401) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const revokeSession = async (id: string) => {
    try {
      await authApi.deleteSession(id);
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    }
  };

  const revokeAll = async () => {
    const toRevoke = items.filter((s) => s.isActive);
    for (const s of toRevoke) {
      try {
        await authApi.deleteSession(s.id);
      } catch {
        // continue revoking others
      }
    }
    setItems((prev) => prev.filter((s) => !s.isActive));
  };

  const getDeviceIcon = (os?: string | null) => {
    if (os?.toLowerCase().includes("mac") || os?.toLowerCase().includes("ios") || os?.toLowerCase().includes("android")) {
      return Smartphone;
    }
    return Monitor;
  };

  const nowMs = useMemo(() => Date.now(), []);

  const formatTime = (dateStr: string) => {
    const diff = nowMs - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Current session";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return `${Math.floor(hrs / 24)} day ago`;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Active Sessions</h3>
          <p className="text-xs text-muted-foreground">Devices currently signed in</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" className="btn-enterprise text-destructive hover:text-destructive" onClick={revokeAll}>
            <LogOut className="h-3.5 w-3.5" /> Revoke All
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="py-8 text-center text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No active sessions</p>
        ) : (
          items.map((s) => {
            const Icon = getDeviceIcon(s.os);
            return (
              <div key={s.id} className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
                s.isActive ? "border-primary/30 bg-primary/5" : "border-border hover:bg-muted/30"
              }`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  s.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{s.browserName ?? s.deviceInfo ?? "Unknown Device"}</span>
                    {s.isActive && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.os ?? "Unknown OS"} · {s.deviceType ?? "Unknown"}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    <Globe className="inline h-3 w-3 mr-1" />{s.ipAddress ?? "—"} · {formatTime(s.lastActiveAt)}
                  </p>
                </div>
                {s.isActive && (
                  <Button variant="ghost" size="sm" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/5 btn-enterprise"
                    onClick={() => revokeSession(s.id)}>
                    <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Revoke</span>
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
