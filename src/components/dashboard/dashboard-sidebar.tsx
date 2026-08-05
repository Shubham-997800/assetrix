"use client";

import React, { useState, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-context";
import { useAuth } from "@/contexts/auth-context";
import { useDialogA11y } from "@/hooks/use-dialog-a11y";
import {
  LayoutDashboard, Building2, Package, ArrowLeftRight, CalendarClock,
  Wrench, ClipboardCheck, BarChart3, Bell, FileText, Settings,
  ChevronDown, ChevronRight, PanelLeftClose, Sparkles,
  HelpCircle, LogOut,
} from "lucide-react";

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  shortcut?: string;
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Organization Setup", href: "/dashboard/organization", icon: Building2 },
      { label: "Asset Directory", href: "/dashboard/assets", icon: Package, shortcut: "A+R" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Asset Allocation", href: "/dashboard/allocations", icon: ArrowLeftRight, shortcut: "A+T" },
      { label: "Resource Booking", href: "/dashboard/bookings", icon: CalendarClock, shortcut: "B+N" },
      { label: "Maintenance", href: "/dashboard/maintenance", icon: Wrench, shortcut: "M+N" },
    ],
  },
  {
    title: "Compliance & Analytics",
    items: [
      { label: "Audit Module", href: "/dashboard/audit", icon: ClipboardCheck },
      { label: "Reports & Analytics", href: "/dashboard/reports", icon: BarChart3 },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { label: "Activity Logs", href: "/dashboard/logs", icon: FileText },
    ],
  },
];

const DashboardSidebar = memo(function DashboardSidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileDrawerOpen, setMobileDrawerOpen, setAiPanelOpen, aiPanelOpen, setShortcutsOpen } = useDashboard();
  const { logout } = useAuth();
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Main: true, Operations: true, "Compliance & Analytics": true,
  });

  const { containerRef: drawerRef } = useDialogA11y(mobileDrawerOpen, () => setMobileDrawerOpen(false));

  const isCollapsed = sidebarCollapsed;

  const isItemActive = useCallback((href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }, [pathname]);

  const toggleGroup = useCallback((title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const handleAiToggle = useCallback((isMobile: boolean) => {
    setAiPanelOpen(!aiPanelOpen);
    if (isMobile) setMobileDrawerOpen(false);
  }, [aiPanelOpen, setAiPanelOpen, setMobileDrawerOpen]);

  const handleShortcuts = useCallback((isMobile: boolean) => {
    setShortcutsOpen(true);
    if (isMobile) setMobileDrawerOpen(false);
  }, [setShortcutsOpen, setMobileDrawerOpen]);

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col">
      <div className={`flex h-16 items-center border-b border-border ${isCollapsed && !isMobile ? "justify-center px-2" : "justify-between px-4"}`}>
        {(isCollapsed && !isMobile) ? (
          <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm" onClick={() => isMobile && setMobileDrawerOpen(false)}>
            AX
          </Link>
        ) : (
          <>
            <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => isMobile && setMobileDrawerOpen(false)}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">AX</span>
              <div>
                <p className="text-sm font-bold text-foreground tracking-tight">Assetrix</p>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Enterprise ERP</p>
              </div>
            </Link>
            <button onClick={() => isMobile ? setMobileDrawerOpen(false) : toggleSidebar()} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={isMobile ? "Close navigation" : "Toggle sidebar"}>
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-3">
            <button onClick={() => toggleGroup(group.title)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-muted-foreground hover:bg-muted ${isCollapsed ? "justify-center" : ""}`} aria-expanded={expandedGroups[group.title]} aria-label={`Toggle ${group.title} section`}>
              {isCollapsed ? (
                expandedGroups[group.title] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <>{group.title} {expandedGroups[group.title] ? <ChevronDown className="ml-auto h-3 w-3" /> : <ChevronRight className="ml-auto h-3 w-3" />}</>
              )}
            </button>
            {expandedGroups[group.title] && group.items.map((item) => (
              <div key={item.href} className="relative">
                <Link
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  onClick={() => isMobile && setMobileDrawerOpen(false)}
                  aria-current={isItemActive(item.href) ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isCollapsed ? "justify-center" : ""
                  } ${
                    isItemActive(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[10px] text-muted-foreground font-mono">{item.shortcut}</span>
                      )}
                    </>
                  )}
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={`border-t border-border py-3 px-2 space-y-1 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
        <button
          onClick={() => handleAiToggle(isMobile)}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${aiPanelOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"} ${isCollapsed ? "justify-center px-2" : ""}`}
          title="AI Assistant"
          aria-label="Toggle AI Assistant panel"
          aria-expanded={aiPanelOpen}
        >
          <Sparkles className="h-4 w-4" />
          {!isCollapsed && "AI Assistant"}
        </button>
        <button
          onClick={() => handleShortcuts(isMobile)}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground ${isCollapsed ? "justify-center px-2" : ""}`}
          title="Keyboard shortcuts"
          aria-label="Open keyboard shortcuts"
        >
          <HelpCircle className="h-4 w-4" />
          {!isCollapsed && "Shortcuts"}
        </button>
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground ${isCollapsed ? "justify-center px-2" : ""}`}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && "Settings"}
        </Link>
        <button
          onClick={() => logout()}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground ${isCollapsed ? "justify-center px-2" : ""}`}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside aria-label="Main navigation" className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 border-r border-border bg-card transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[280px]"}`}>
        {sidebarContent(false)}
      </aside>

      {mobileDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileDrawerOpen(false)} />
          <aside ref={drawerRef} role="dialog" aria-modal="true" aria-label="Mobile navigation" className="fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto border-r border-border bg-card lg:hidden">
            {sidebarContent(true)}
          </aside>
        </>
      )}
    </>
  );
});

export { DashboardSidebar };
