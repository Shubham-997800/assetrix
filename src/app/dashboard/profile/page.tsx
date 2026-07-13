"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
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
import { authApi, ApiError } from "@/lib/api";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "sessions", label: "Sessions", icon: Monitor },
  { id: "activity", label: "Activity", icon: Clock },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  status: string;
  employeeId: string | null;
  designation: string | null;
  department: { id: string; name: string; code: string } | null;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  DEPARTMENT_MANAGER: "Department Manager",
  TECHNICIAN: "Technician",
  EMPLOYEE: "Employee",
};

const securityTips = [
  "Enable two-factor authentication",
  "Use a unique, strong password",
  "Review active sessions regularly",
  "Keep your recovery email updated",
] as const;

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars -- editMode controls UI toggle
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authApi.me();
      setUser(res.data as UserProfile);
    } catch (err) {
      if (err instanceof ApiError && err.status !== 401) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const initials = user ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}` : "\u2014";
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Loading...";
  const roleLabel = user ? ROLE_LABELS[user.role] ?? user.role : "\u2014";
  const deptName = user?.department?.name ?? "\u2014";
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "\u2014";

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const tabNavigation = useMemo(
    () =>
      tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const className = `flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
        }`;
        return { ...tab, isActive, className };
      }),
    [activeTab]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      ) : user ? (
        <>
          {/* Profile Header */}
          <ProfileHeader
            name={fullName}
            role={roleLabel}
            department={deptName}
            status="online"
            joinDate={joinDate}
            initials={initials}
          />

          {/* Tab Navigation */}
          <div className="border-b border-border">
            <nav className="flex gap-1 overflow-x-auto" aria-label="Profile tabs">
              {tabNavigation.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={tab.className}
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
                  <PersonalInfo editMode={editMode} user={user} />
                  <ContactInfo editMode={editMode} user={user} />
                </>
              )}
              {activeTab === "security" && (
                <>
                  <ChangePassword />
                  <AccountInfo user={user} />
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
                    { label: "Role", value: roleLabel },
                    { label: "Department", value: deptName },
                    { label: "User ID", value: user.id },
                    { label: "Status", value: user.status === "ACTIVE" ? "Active" : user.status, color: user.status === "ACTIVE" ? "text-emerald-600 dark:text-emerald-400" : undefined },
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
                  {securityTips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default memo(ProfilePage);
