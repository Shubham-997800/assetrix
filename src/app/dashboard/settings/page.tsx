"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Globe,
  Plug,
  SlidersHorizontal,
  Save,
  Key,
  Link2,
  Monitor,
  Sun,
  Moon,
  CheckCircle,
} from "lucide-react";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "language", label: "Language", icon: Globe },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
        className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-2" : "-translate-x-2"}`} aria-hidden="true" />
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20";
const selectCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20";

/* ── General Tab ── */
function GeneralTab() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Organization Settings</h3>
        <p className="text-xs text-muted-foreground">Basic configuration for your workspace</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Organization Name"><input className={inputCls} defaultValue="Nexus Corp" /></Field>
          <Field label="Time Zone"><select className={selectCls} defaultValue="Asia/Kolkata">
            <option>Asia/Kolkata (IST)</option><option>America/New_York (EST)</option><option>Europe/London (GMT)</option><option>Asia/Tokyo (JST)</option>
          </select></Field>
          <Field label="Date Format"><select className={selectCls} defaultValue="dd/mm/yyyy">
            <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
          </select></Field>
          <Field label="Currency"><select className={selectCls} defaultValue="INR">
            <option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
          </select></Field>
          <div className="sm:col-span-2">
            <Field label="Business Hours">
              <div className="flex gap-3">
                <input type="time" className={inputCls} defaultValue="09:00" />
                <span className="flex items-center text-sm text-muted-foreground">to</span>
                <input type="time" className={inputCls} defaultValue="18:00" />
              </div>
            </Field>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-border pt-5">
          <Button size="default" className="btn-enterprise" onClick={handleSave}>
            {saved ? <><CheckCircle className="h-3.5 w-3.5" /> Saved</> : <><Save className="h-3.5 w-3.5" /> Save Changes</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Appearance Tab ── */
function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [compact, setCompact] = useState(false);
  const [density, setDensity] = useState("default");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Theme</h3>
        <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { id: "light", label: "Light", icon: Sun, desc: "Clean and bright" },
            { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
            { id: "system", label: "System", icon: Monitor, desc: "Match your OS" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                theme === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              }`}>
              <t.icon className="h-5 w-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">{t.label}</span>
              <span className="text-[11px] text-muted-foreground">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Display</h3>
        <p className="text-xs text-muted-foreground">Customize the interface density</p>
        <div className="mt-5 space-y-0 divide-y divide-border">
          <Toggle label="Compact Mode" description="Reduce padding and spacing for more content" checked={compact} onChange={setCompact} />
        </div>
        <div className="mt-4">
          <Field label="Table Density">
            <select className={selectCls} value={density} onChange={(e) => setDensity(e.target.value)}>
              <option value="compact">Compact</option><option value="default">Default</option><option value="relaxed">Relaxed</option>
            </select>
          </Field>
        </div>
      </div>
    </div>
  );
}

/* ── Notifications Tab ── */
function NotificationsTab() {
  const [settings, setSettings] = useState({
    email: true, push: true, security: true, weekly: true, mentions: true, product: false,
  });
  const update = (k: keyof typeof settings, v: boolean) => setSettings((p) => ({ ...p, [k]: v }));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">Notification Preferences</h3>
      <p className="text-xs text-muted-foreground">Control what notifications you receive</p>
      <div className="mt-5 space-y-0 divide-y divide-border">
        <Toggle label="Email Notifications" description="Receive notifications via email" checked={settings.email} onChange={(v) => update("email", v)} />
        <Toggle label="Push Notifications" description="Browser push notifications" checked={settings.push} onChange={(v) => update("push", v)} />
        <Toggle label="Security Alerts" description="Suspicious activity and login alerts" checked={settings.security} onChange={(v) => update("security", v)} />
        <Toggle label="Weekly Summary" description="Weekly digest of activity" checked={settings.weekly} onChange={(v) => update("weekly", v)} />
        <Toggle label="Mention Alerts" description="When someone mentions you" checked={settings.mentions} onChange={(v) => update("mentions", v)} />
        <Toggle label="Product Updates" description="New features and improvements" checked={settings.product} onChange={(v) => update("product", v)} />
      </div>
    </div>
  );
}

/* ── Security Tab ── */
function SecurityTab() {
  const [twoFA, setTwoFA] = useState(false);
  const sessions = [
    { device: "Chrome · Windows 11", location: "Ahmedabad", time: "Current", current: true },
    { device: "Safari · macOS", location: "Mumbai", time: "2h ago", current: false },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Authentication</h3>
        <p className="text-xs text-muted-foreground">Secure your account</p>
        <div className="mt-5 space-y-0 divide-y divide-border">
          <Toggle label="Two-Factor Authentication" description="Add an extra layer of security with 2FA" checked={twoFA} onChange={setTwoFA} />
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Session Timeout</p>
                <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <select className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                <option>15 minutes</option><option>30 minutes</option><option>1 hour</option><option>4 hours</option><option>Never</option>
              </select>
            </div>
          </div>
          <Toggle label="Login Alerts" description="Get notified of new login locations" checked={true} onChange={() => {}} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Active Sessions</h3>
            <p className="text-xs text-muted-foreground">{sessions.length} devices signed in</p>
          </div>
          <Button variant="outline" size="sm" className="btn-enterprise text-destructive hover:text-destructive">Logout All</Button>
        </div>
        <div className="mt-4 space-y-2">
          {sessions.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg border p-3 ${s.current ? "border-primary/30 bg-primary/5" : "border-border"}`}>
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{s.device}</span>
                  {s.current && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Current</span>}
                </div>
                <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Security Overview</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: "Last Login", value: "11 Jul 2026, 09:15 AM" },
            { label: "Password Changed", value: "28 Jun 2026" },
            { label: "Failed Logins", value: "0 (last 30 days)" },
            { label: "Trusted Devices", value: "2 devices" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Language Tab ── */
function LanguageTab() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">Language & Region</h3>
      <p className="text-xs text-muted-foreground">Localization preferences</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Language"><select className={selectCls} defaultValue="en">
          <option value="en">English</option><option value="hi">Hindi</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="ja">Japanese</option>
        </select></Field>
        <Field label="Region"><select className={selectCls} defaultValue="IN">
          <option value="IN">India</option><option value="US">United States</option><option value="GB">United Kingdom</option><option value="DE">Germany</option><option value="JP">Japan</option>
        </select></Field>
        <Field label="Number Format"><select className={selectCls} defaultValue="indian">
          <option value="indian">Indian (1,23,456)</option><option value="us">US (123,456)</option><option value="eu">European (123.456)</option>
        </select></Field>
        <Field label="First Day of Week"><select className={selectCls} defaultValue="monday">
          <option value="monday">Monday</option><option value="sunday">Sunday</option><option value="saturday">Saturday</option>
        </select></Field>
      </div>
    </div>
  );
}

/* ── Integrations Tab ── */
function IntegrationsTab() {
  const integrations = [
    { name: "Slack", desc: "Team messaging and notifications", status: "connected", lastSync: "2 min ago", icon: "💬" },
    { name: "Google Workspace", desc: "Calendar, Drive, and email sync", status: "connected", lastSync: "5 min ago", icon: "📧" },
    { name: "GitHub", desc: "Code repositories and CI/CD", status: "disconnected", lastSync: "Never", icon: "🐙" },
    { name: "Jira", desc: "Project tracking and issues", status: "connected", lastSync: "12 min ago", icon: "📋" },
    { name: "Zapier", desc: "Workflow automation bridge", status: "error", lastSync: "3 days ago", icon: "⚡" },
  ];

  const statusStyles = {
    connected: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    disconnected: "bg-muted text-muted-foreground",
    error: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Connected Services</h3>
            <p className="text-xs text-muted-foreground">Manage third-party integrations</p>
          </div>
          <Button size="default" className="btn-enterprise"><Link2 className="h-3.5 w-3.5" /> Add Integration</Button>
        </div>
        <div className="mt-5 space-y-3">
          {integrations.map((int) => (
            <div key={int.name} className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-muted/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">{int.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{int.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyles[int.status as keyof typeof statusStyles]}`}>
                    {int.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{int.desc}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5">Last sync: {int.lastSync}</p>
              </div>
              <Button variant="outline" size="default" className="btn-enterprise">
                {int.status === "connected" ? "Manage" : int.status === "error" ? "Reconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">API Keys</h3>
        <p className="text-xs text-muted-foreground">Manage programmatic access</p>
        <div className="mt-4 space-y-2">
          {[
            { name: "Production Key", created: "15 Jan 2025", lastUsed: "2 min ago" },
            { name: "Staging Key", created: "20 Mar 2025", lastUsed: "1 hour ago" },
          ].map((key) => (
            <div key={key.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Key className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">{key.name}</span>
                <p className="text-xs text-muted-foreground">Created {key.created} · Last used {key.lastUsed}</p>
              </div>
              <Button variant="ghost" size="default" className="btn-enterprise">Revoke</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Preferences Tab ── */
function PreferencesTab() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">User Preferences</h3>
      <p className="text-xs text-muted-foreground">Customize your workspace behavior</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Default Dashboard"><select className={selectCls} defaultValue="overview">
          <option value="overview">Overview</option><option value="analytics">Analytics</option><option value="reports">Reports</option>
        </select></Field>
        <Field label="Default Landing Page"><select className={selectCls} defaultValue="dashboard">
          <option value="dashboard">Dashboard</option><option value="analytics">Analytics</option>
        </select></Field>
        <Field label="Sidebar Behavior"><select className={selectCls} defaultValue="expanded">
          <option value="expanded">Always Expanded</option><option value="collapsed">Always Collapsed</option><option value="remember">Remember Last</option>
        </select></Field>
        <Field label="Table Density"><select className={selectCls} defaultValue="default">
          <option value="compact">Compact</option><option value="default">Default</option><option value="relaxed">Relaxed</option>
        </select></Field>
        <Field label="Default Export Format"><select className={selectCls} defaultValue="csv">
          <option value="csv">CSV</option><option value="xlsx">Excel (XLSX)</option><option value="pdf">PDF</option><option value="json">JSON</option>
        </select></Field>
      </div>
      <div className="mt-5 space-y-0 divide-y divide-border">
        <Toggle label="Auto Save" description="Automatically save changes without confirmation" checked={true} onChange={() => {}} />
        <Toggle label="Show Keyboard Shortcuts" description="Display shortcut hints on hover" checked={true} onChange={() => {}} />
      </div>
    </div>
  );
}

/* ── Page ── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your workspace configuration</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Settings tabs">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-3xl">
        {activeTab === "general" && <GeneralTab />}
        {activeTab === "appearance" && <AppearanceTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "language" && <LanguageTab />}
        {activeTab === "integrations" && <IntegrationsTab />}
        {activeTab === "preferences" && <PreferencesTab />}
      </div>
    </div>
  );
}
