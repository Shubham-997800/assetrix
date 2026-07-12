"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-context";
import {
  LayoutDashboard, Building2, Package, ArrowLeftRight, CalendarClock,
  Wrench, ClipboardCheck, BarChart3, Bell, FileText, Settings, Star,
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

export function DashboardSidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileDrawerOpen, setMobileDrawerOpen, favorites, addFavorite, removeFavorite, recentPages, setAiPanelOpen, aiPanelOpen, setShortcutsOpen } = useDashboard();
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Main: true, Operations: true, "Compliance & Analytics": true,
  });
  const [expandedFav, setExpandedFav] = useState(true);
  const [expandedRecent, setExpandedRecent] = useState(true);

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileDrawerOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileDrawerOpen, setMobileDrawerOpen]);

  const isCollapsed = sidebarCollapsed;

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isItemActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isFavorited = (href: string) => favorites.some((f) => f.href === href);

  const toggleFavorite = (item: NavItem) => {
    if (isFavorited(item.href)) {
      removeFavorite(item.href);
    } else {
      addFavorite({ label: item.label, href: item.href, icon: "Star" });
    }
  };

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col">
      {/* Header */}
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
            <button onClick={() => isMobile ? setMobileDrawerOpen(false) : toggleSidebar()} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              {isMobile ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </>
        )}
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="mb-3">
            <button onClick={() => setExpandedFav(!expandedFav)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground ${isCollapsed ? "justify-center" : ""}`}>
              {isCollapsed ? <Star className="h-3 w-3" /> : (<><Star className="h-3 w-3" /> Favorites {expandedFav ? <ChevronDown className="ml-auto h-3 w-3" /> : <ChevronRight className="ml-auto h-3 w-3" />}</>)}
            </button>
            {expandedFav && !isCollapsed && favorites.map((fav) => (
              <Link key={fav.href} href={fav.href} onClick={() => isMobile && setMobileDrawerOpen(false)} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${isItemActive(fav.href) ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                {fav.label}
              </Link>
            ))}
          </div>
        )}

        {/* Recent */}
        {recentPages.length > 0 && (
          <div className="mb-3">
            <button onClick={() => setExpandedRecent(!expandedRecent)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground ${isCollapsed ? "justify-center" : ""}`}>
              {isCollapsed ? <FileText className="h-3 w-3" /> : (<><FileText className="h-3 w-3" /> Recent {expandedRecent ? <ChevronDown className="ml-auto h-3 w-3" /> : <ChevronRight className="ml-auto h-3 w-3" />}</>)}
            </button>
            {expandedRecent && !isCollapsed && recentPages.slice(0, 5).map((page) => (
              <Link key={page.href} href={page.href} onClick={() => isMobile && setMobileDrawerOpen(false)} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${isItemActive(page.href) ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                {page.label}
              </Link>
            ))}
          </div>
        )}

        {!isCollapsed && favorites.length > 0 && recentPages.length > 0 && <div className="mx-2 mb-3 border-t border-border" />}

        {/* Main nav groups */}
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-3">
            <button onClick={() => toggleGroup(group.title)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground ${isCollapsed ? "justify-center" : ""}`}>
              {isCollapsed ? null : (<>{group.title} {expandedGroups[group.title] ? <ChevronDown className="ml-auto h-3 w-3" /> : <ChevronRight className="ml-auto h-3 w-3" />}</>)}
            </button>
            {expandedGroups[group.title] && group.items.map((item) => (
              <div key={item.href} className="relative group/fav">
                <Link
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  onClick={() => isMobile && setMobileDrawerOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
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
                        <span className="text-[9px] text-muted-foreground/40 font-mono">{item.shortcut}</span>
                      )}
                    </>
                  )}
                </Link>
                {!isCollapsed && (
                  <button
                    onClick={(e) => { e.preventDefault(); toggleFavorite(item); }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground/0 group-hover/fav:text-muted-foreground hover:text-yellow-500 transition-colors"
                    title={isFavorited(item.href) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star className={`h-3 w-3 ${isFavorited(item.href) ? "fill-yellow-500 text-yellow-500" : ""}`} />
                  </button>
                )}
                {isCollapsed && isFavorited(item.href) && (
                  <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={`border-t border-border py-3 px-2 space-y-1 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
        <button
          onClick={() => { setAiPanelOpen(!aiPanelOpen); if (isMobile) setMobileDrawerOpen(false); }}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${aiPanelOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"} ${isCollapsed ? "justify-center px-2" : ""}`}
          title="AI Assistant"
        >
          <Sparkles className="h-4 w-4" />
          {!isCollapsed && "AI Assistant"}
        </button>
        <button
          onClick={() => { setShortcutsOpen(true); if (isMobile) setMobileDrawerOpen(false); }}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground ${isCollapsed ? "justify-center px-2" : ""}`}
          title="Keyboard shortcuts"
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
        <Link
          href="/login"
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground ${isCollapsed ? "justify-center px-2" : ""}`}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && "Sign Out"}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside aria-label="Main navigation" className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 border-r border-border bg-card transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[280px]"}`}>
        {sidebarContent(false)}
      </aside>

      {/* Mobile sidebar */}
      {mobileDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileDrawerOpen(false)} />
          <aside aria-label="Mobile navigation" className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-card lg:hidden">
            {sidebarContent(true)}
          </aside>
        </>
      )}
    </>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
