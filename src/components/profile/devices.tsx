"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet, Shield, Trash2, Star } from "lucide-react";

const initialDevices = [
  { type: "Desktop", browser: "Chrome 126", os: "Windows 11", trusted: true, lastSeen: "Now" },
  { type: "Mobile", browser: "Safari 18", os: "iOS 18", trusted: true, lastSeen: "2h ago" },
  { type: "Desktop", browser: "Edge 126", os: "Windows 11", trusted: false, lastSeen: "1d ago" },
];

const deviceIcon = (type: string) => {
  if (type === "Mobile") return Smartphone;
  if (type === "Tablet") return Tablet;
  return Monitor;
};

export function Devices() {
  const [devices, setDevices] = useState(initialDevices);

  const toggleTrust = (idx: number) => {
    setDevices((prev) => prev.map((d, i) => i === idx ? { ...d, trusted: !d.trusted } : d));
  };

  const removeDevice = (idx: number) => {
    setDevices((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Devices</h3>
        <p className="text-xs text-muted-foreground">Manage devices associated with your account</p>
      </div>

      <div className="mt-5 space-y-3">
        {devices.map((d, i) => {
          const Icon = deviceIcon(d.type);
          return (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-muted/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{d.browser}</span>
                  <span className="text-xs text-muted-foreground">· {d.os}</span>
                  {d.trusted && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <Shield className="h-2.5 w-2.5" /> Trusted
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/60 mt-0.5">Last seen: {d.lastSeen}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-11 w-11 btn-enterprise" onClick={() => toggleTrust(i)}
                  aria-label={d.trusted ? "Remove trust" : "Trust device"} title={d.trusted ? "Remove trust" : "Trust device"}>
                  <Star className={`h-3.5 w-3.5 ${d.trusted ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`} />
                </Button>
                <Button variant="ghost" size="icon" className="h-11 w-11 text-destructive hover:text-destructive hover:bg-destructive/5 btn-enterprise"
                  onClick={() => removeDevice(i)} aria-label="Remove device" title="Remove device">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
