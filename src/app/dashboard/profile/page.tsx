"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { PersonalInfo } from "@/components/profile/personal-info";
import { ContactInfo } from "@/components/profile/contact-info";
import { AccountInfo } from "@/components/profile/account-info";
import { ChangePassword } from "@/components/profile/change-password";
import { ActiveSessions } from "@/components/profile/active-sessions";
import { Devices } from "@/components/profile/devices";
import { ActivityLog } from "@/components/profile/activity-log";
import { NotificationSettings } from "@/components/profile/notification-settings";
import {
  User,
  Shield,
  Monitor,
  Bell,
  Clock,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "sessions", label: "Sessions", icon: Monitor },
  { id: "activity", label: "Activity", icon: Clock },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Header */}
      <ProfileHeader
        name="John Smith"
        role="Operations Manager"
        department="Procurement"
        status="online"
        joinDate="January 2025"
        initials="JS"
      />

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Profile tabs">
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
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "profile" && (
            <>
              <PersonalInfo editMode={editMode} />
              <ContactInfo editMode={editMode} />
            </>
          )}
          {activeTab === "security" && (
            <>
              <ChangePassword />
              <AccountInfo />
            </>
          )}
          {activeTab === "sessions" && (
            <>
              <ActiveSessions />
              <Devices />
            </>
          )}
          {activeTab === "activity" && <ActivityLog />}
          {activeTab === "notifications" && <NotificationSettings />}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Summary */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">Account Summary</h3>
            <div className="mt-4 space-y-3">
              {[
                { label: "Role", value: "Operations Manager" },
                { label: "Department", value: "Procurement" },
                { label: "User ID", value: "USR-284719" },
                { label: "Status", value: "Active", color: "text-emerald-600 dark:text-emerald-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className={`text-xs font-medium ${item.color || "text-foreground"}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              {[
                { label: "Download My Data", desc: "Export all your data" },
                { label: "Delete Account", desc: "Permanently delete account", danger: true },
              ].map((action) => (
                <button
                  key={action.label}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    action.danger
                      ? "border-destructive/20 hover:bg-destructive/5 text-destructive"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          <div className="rounded-xl border border-border bg-primary/5 p-6">
            <h3 className="text-sm font-semibold text-primary">Security Tips</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                Enable two-factor authentication
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                Use a unique, strong password
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                Review active sessions regularly
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                Keep your recovery email updated
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
