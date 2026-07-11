"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`} />
      </button>
    </div>
  );
}

export function NotificationSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    security: true,
    product: false,
    weekly: true,
  });

  const update = (key: keyof typeof settings, val: boolean) => {
    setSettings((p) => ({ ...p, [key]: val }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Notification Settings</h3>
          <p className="text-xs text-muted-foreground">Choose what notifications you receive</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-fade-in">
            <Save className="h-3 w-3" /> Saved
          </span>
        )}
      </div>

      <div className="mt-5 divide-y divide-border">
        <Toggle label="Email Notifications" description="Receive notifications via email"
          checked={settings.email} onChange={(v) => update("email", v)} />
        <Toggle label="Push Notifications" description="Receive push notifications in browser"
          checked={settings.push} onChange={(v) => update("push", v)} />
        <Toggle label="Security Alerts" description="Get notified about suspicious activity"
          checked={settings.security} onChange={(v) => update("security", v)} />
        <Toggle label="Product Updates" description="Learn about new features and improvements"
          checked={settings.product} onChange={(v) => update("product", v)} />
        <Toggle label="Weekly Summary" description="Receive a weekly activity digest"
          checked={settings.weekly} onChange={(v) => update("weekly", v)} />
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <Button size="sm" className="btn-enterprise" onClick={handleSave}>
          <Save className="h-3.5 w-3.5" /> Save Preferences
        </Button>
      </div>
    </div>
  );
}
