"use client";

import { useState } from "react";
import { useDashboard } from "@/contexts/dashboard-context";
import {
  Settings, Shield, Bell, Palette, Database, Save, CheckCircle,
  Lock, Eye, EyeOff, Monitor, Sun, Moon, Download, Trash2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SettingsTab = "general" | "security" | "notifications" | "appearance" | "data";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "data", label: "Data & Privacy", icon: Database },
];

function GeneralSettings() {
  const [companyName, setCompanyName] = useState("Assetrix Corp");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("INR");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Organization</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="company-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">Company Name</label>
            <input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20" />
          </div>
          <div>
            <label htmlFor="timezone" className="mb-1.5 block text-xs font-medium text-muted-foreground">Timezone</label>
            <select id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50">
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="mb-1.5 block text-xs font-medium text-muted-foreground">Language</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <div>
            <label htmlFor="currency" className="mb-1.5 block text-xs font-medium text-muted-foreground">Currency</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50">
              <option value="INR">INR (&#8377;)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-4">
        <Button size="sm" onClick={handleSave} className="btn-enterprise">
          {saved ? <><CheckCircle className="h-3.5 w-3.5" /> Saved</> : <><Save className="h-3.5 w-3.5" /> Save Changes</>}
        </Button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
        <div className="space-y-3 max-w-sm">
          <div>
            <label htmlFor="current-pw" className="mb-1.5 block text-xs font-medium text-muted-foreground">Current Password</label>
            <div className="relative">
              <input id="current-pw" type={showCurrent ? "text" : "password"} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 pr-10 text-sm text-foreground outline-none focus:border-primary/50" />
              <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                {showCurrent ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="new-pw" className="mb-1.5 block text-xs font-medium text-muted-foreground">New Password</label>
            <div className="relative">
              <input id="new-pw" type={showNew ? "text" : "password"} className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 pr-10 text-sm text-foreground outline-none focus:border-primary/50" />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <Button size="sm" onClick={handleSave} className="btn-enterprise">
            {saved ? <><CheckCircle className="h-3.5 w-3.5" /> Updated</> : <><Lock className="h-3.5 w-3.5" /> Update Password</>}
          </Button>
        </div>
      </div>
      <div className="border-t border-border pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">2FA via Authenticator App</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
          </div>
          <button onClick={() => setTwoFactor(!twoFactor)} className={`relative h-6 w-11 rounded-full transition-colors ${twoFactor ? "bg-primary" : "bg-muted"}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${twoFactor ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </div>
      <div className="border-t border-border pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Active Sessions</h3>
        <div className="space-y-2">
          {[
            { device: "Chrome on Windows", ip: "192.168.1.100", time: "Current session", current: true },
            { device: "Safari on macOS", ip: "10.0.0.45", time: "2 hours ago", current: false },
            { device: "Firefox on Linux", ip: "172.16.0.12", time: "1 day ago", current: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-foreground">{s.device}</p>
                  <p className="text-[10px] text-muted-foreground">{s.ip} &middot; {s.time}</p>
                </div>
              </div>
              {s.current ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">Active</span>
              ) : (
                <button className="rounded-md px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    emailMaintenance: true,
    emailBooking: true,
    emailAllocation: true,
    emailWarranty: true,
    pushMaintenance: true,
    pushBooking: false,
    pushAllocation: true,
    digest: "daily",
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const rows: { key: keyof typeof prefs; label: string; desc: string; type: "toggle" | "select" }[] = [
    { key: "emailMaintenance", label: "Maintenance Alerts", desc: "Email when tasks are assigned or overdue", type: "toggle" },
    { key: "emailBooking", label: "Booking Updates", desc: "Email on booking approval or rejection", type: "toggle" },
    { key: "emailAllocation", label: "Allocation Changes", desc: "Email when assets are allocated or returned", type: "toggle" },
    { key: "emailWarranty", label: "Warranty Expiry", desc: "Email 30/60/90 days before warranty expires", type: "toggle" },
    { key: "pushMaintenance", label: "Push: Maintenance", desc: "Browser push for maintenance events", type: "toggle" },
    { key: "pushBooking", label: "Push: Bookings", desc: "Browser push for booking events", type: "toggle" },
    { key: "pushAllocation", label: "Push: Allocations", desc: "Browser push for allocation events", type: "toggle" },
    { key: "digest", label: "Email Digest", desc: "Frequency of summary emails", type: "select" },
  ];

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.key} className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">{r.label}</p>
            <p className="text-xs text-muted-foreground">{r.desc}</p>
          </div>
          {r.type === "toggle" ? (
            <button onClick={() => toggle(r.key)} className={`relative h-6 w-11 rounded-full transition-colors ${prefs[r.key] ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs[r.key] ? "left-[22px]" : "left-0.5"}`} />
            </button>
          ) : (
            <select value={prefs[r.key] as string} onChange={(e) => setPrefs((p) => ({ ...p, [r.key]: e.target.value }))} className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-foreground outline-none">
              <option value="realtime">Real-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="never">Never</option>
            </select>
          )}
        </div>
      ))}
      <Button size="sm" onClick={handleSave} className="btn-enterprise">
        {saved ? <><CheckCircle className="h-3.5 w-3.5" /> Saved</> : <><Save className="h-3.5 w-3.5" /> Save Preferences</>}
      </Button>
    </div>
  );
}

function AppearanceSettings() {
  const { isLight, toggleTheme } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Theme</h3>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button onClick={() => { if (!isLight) toggleTheme(); }} className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${!isLight ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
            <Moon className="h-6 w-6 text-foreground" />
            <span className="text-xs font-medium text-foreground">Dark</span>
            {!isLight && <CheckCircle className="h-4 w-4 text-primary" />}
          </button>
          <button onClick={() => { if (isLight) toggleTheme(); }} className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${isLight ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
            <Sun className="h-6 w-6 text-foreground" />
            <span className="text-xs font-medium text-foreground">Light</span>
            {isLight && <CheckCircle className="h-4 w-4 text-primary" />}
          </button>
        </div>
      </div>
      <div className="border-t border-border pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Accent Color</h3>
        <div className="flex items-center gap-3">
          {["#0891B2", "#7C3AED", "#059669", "#D97706", "#DC2626"].map((c) => (
            <button key={c} className="h-8 w-8 rounded-full border-2 border-transparent transition-all hover:scale-110" style={{ backgroundColor: c }} aria-label={`Theme color ${c}`} />
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Sidebar</h3>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Compact Sidebar</p>
            <p className="text-xs text-muted-foreground">Show icons only in the sidebar</p>
          </div>
          <button onClick={() => {}} className="relative h-6 w-11 rounded-full bg-muted">
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DataSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Export Data</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Export as CSV", desc: "All asset data", icon: Download },
            { label: "Export as PDF", desc: "Full report", icon: Download },
            { label: "Export as Excel", desc: "Spreadsheet format", icon: Download },
          ].map((e) => (
            <button key={e.label} className="flex items-center gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted">
              <e.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">{e.label}</p>
                <p className="text-[10px] text-muted-foreground">{e.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data</p>
            </div>
            <Button variant="outline" size="sm" className="border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-600">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TAB_CONTENT: Record<SettingsTab, React.ReactNode> = {
  general: <GeneralSettings />,
  security: <SecuritySettings />,
  notifications: <NotificationSettings />,
  appearance: <AppearanceSettings />,
  data: <DataSettings />,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and application preferences</p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:w-56 flex-shrink-0" aria-label="Settings sections">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {activeTab !== tab.id && <ChevronRight className="ml-auto hidden h-3 w-3 lg:block" />}
              </button>
            );
          })}
        </nav>
        <div className="flex-1 min-w-0 rounded-xl border border-border bg-card p-6">
          {TAB_CONTENT[activeTab]}
        </div>
      </div>
    </div>
  );
}
