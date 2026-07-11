"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-context";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Bell,
  GitBranch,
  ScrollText,
  Plug,
  Settings,
  User,
  Shield,
  ChevronLeft,
  Zap,
} from "lucide-react";

const navGroups = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: BarChart3, label: "Analytics", href: "/dashboard" },
      { icon: FileText, label: "Reports", href: "/dashboard/reports" },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
      { icon: GitBranch, label: "Workflows", href: "/dashboard" },
      { icon: ScrollText, label: "Audit Logs", href: "/dashboard/admin" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Plug, label: "Integrations", href: "/dashboard" },
      { icon: Shield, label: "Admin", href: "/dashboard/admin" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
      { icon: User, label: "Profile", href: "/dashboard/profile" },
    ],
  },
];

export function DashboardSidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileDrawerOpen, setMobileDrawerOpen } = useDashboard();
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`flex h-16 items-center border-b border-border ${sidebarCollapsed ? "justify-center px-2" : "gap-2.5 px-5"}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileDrawerOpen(false)}>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold tracking-tight text-foreground">Nexus</span>
          )}
        </Link>
      </div>

      {/* Collapse Toggle - Desktop only */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex absolute -right-3 top-20 z-50 h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft className={`h-3 w-3 transition-transform duration-200 ${sidebarCollapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6" role="navigation">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href && item.label === "Dashboard";
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`group relative flex items-center rounded-lg transition-all duration-150 ${
                      sidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {/* Active indicator */}
                    {isActive && !sidebarCollapsed && (
                      <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className={`border-t border-border p-3 ${sidebarCollapsed ? "px-2" : ""}`}>
        <div className={`flex items-center rounded-lg px-3 py-2.5 transition-colors hover:bg-muted ${sidebarCollapsed ? "justify-center px-2" : "gap-3"}`}>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            JD
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@company.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden border-r border-border bg-sidebar transition-all duration-200 lg:relative lg:flex lg:flex-col ${
          sidebarCollapsed ? "w-[72px]" : "w-[280px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative flex h-full w-[280px] flex-col border-r border-border bg-sidebar animate-slide-in-left">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
