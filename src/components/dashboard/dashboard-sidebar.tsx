"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDashboard } from "@/contexts/dashboard-context";
import {
  LayoutDashboard,
  Building2,
  Package,
  ArrowLeftRight,
  CalendarClock,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  ScrollText,
  User,
  Settings,
  ChevronLeft,
  Zap,
} from "lucide-react";

const navGroups = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "Organization",
    items: [
      { icon: Building2, label: "Organization Setup", href: "/dashboard/organization" },
    ],
  },
  {
    label: "Asset Management",
    items: [
      { icon: Package, label: "Asset Directory", href: "/dashboard/assets" },
      { icon: ArrowLeftRight, label: "Asset Allocation", href: "/dashboard/allocations" },
      { icon: CalendarClock, label: "Resource Booking", href: "/dashboard/bookings" },
      { icon: Wrench, label: "Maintenance", href: "/dashboard/maintenance" },
    ],
  },
  {
    label: "Compliance",
    items: [
      { icon: ClipboardCheck, label: "Audit Module", href: "/dashboard/audit" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { icon: BarChart3, label: "Reports & Analytics", href: "/dashboard/reports" },
      { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
      { icon: ScrollText, label: "Activity Logs", href: "/dashboard/logs" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
      { icon: User, label: "Profile", href: "/dashboard/profile" },
      { icon: ScrollText, label: "Admin", href: "/dashboard/admin" },
    ],
  },
];

export function DashboardSidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileDrawerOpen, setMobileDrawerOpen } = useDashboard();
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileDrawerOpen, setMobileDrawerOpen]);

  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileDrawerOpen]);

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024 && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [mobileDrawerOpen, setMobileDrawerOpen]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className={`flex h-16 items-center border-b border-border ${sidebarCollapsed ? "justify-center px-2" : "gap-2.5 px-5"}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileDrawerOpen(false)}>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold tracking-tight text-foreground">AssetFlow</span>
          )}
        </Link>
      </div>

      <button
        onClick={toggleSidebar}
        className="hidden lg:flex absolute -right-3 top-20 z-50 h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!sidebarCollapsed}
      >
        <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-200 ${sidebarCollapsed ? "rotate-180" : ""}`} />
      </button>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6" aria-label="Main navigation">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center rounded-lg transition-all duration-150 ${
                      sidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {isActive && !sidebarCollapsed && (
                      <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={`border-t border-border p-3 ${sidebarCollapsed ? "px-2" : ""}`}>
        <div className={`flex items-center rounded-lg px-3 py-2.5 transition-colors hover:bg-muted ${sidebarCollapsed ? "justify-center px-2" : "gap-3"}`}>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary" aria-hidden="true">
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
      <aside
        aria-label="Sidebar"
        className={`hidden border-r border-border bg-sidebar transition-all duration-200 lg:relative lg:flex lg:flex-col ${
          sidebarCollapsed ? "w-[72px]" : "w-[280px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-[85vw] max-w-[280px] flex-col border-r border-border bg-sidebar animate-slide-in-left">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
