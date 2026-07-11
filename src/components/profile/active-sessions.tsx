"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, LogOut, Globe } from "lucide-react";

const sessions = [
  { device: "Chrome", os: "Windows 11", location: "Ahmedabad, India", time: "Current session", ip: "103.21.58.xx", current: true },
  { device: "Safari", os: "macOS Sonoma", location: "Mumbai, India", time: "2 hours ago", ip: "49.36.128.xx", current: false },
  { device: "Edge", os: "Windows 11", location: "Ahmedabad, India", time: "1 day ago", ip: "103.21.58.xx", current: false },
];

export function ActiveSessions() {
  const [items, setItems] = useState(sessions);

  const revokeSession = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const revokeAll = () => {
    setItems((prev) => prev.filter((s) => s.current));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Active Sessions</h3>
          <p className="text-xs text-muted-foreground">Devices currently signed in</p>
        </div>
        <Button variant="outline" size="sm" className="btn-enterprise text-destructive hover:text-destructive" onClick={revokeAll}>
          <LogOut className="h-3.5 w-3.5" /> Revoke All
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((s, i) => (
          <div key={i} className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
            s.current ? "border-primary/30 bg-primary/5" : "border-border hover:bg-muted/30"
          }`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              s.current ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {s.os.includes("mac") ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{s.device}</span>
                {s.current && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Current</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{s.os} · {s.location}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">
                <Globe className="inline h-3 w-3 mr-1" />{s.ip} · {s.time}
              </p>
            </div>
            {!s.current && (
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/5 btn-enterprise"
                onClick={() => revokeSession(i)}>
                <LogOut className="h-3.5 w-3.5" /> Revoke
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
