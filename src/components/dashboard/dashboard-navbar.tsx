"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-context";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  LogOut,
  Settings,
  User,
  Shield,
  Clock,
  HelpCircle,
  Command,
} from "lucide-react";

const searchSuggestions = [
  { type: "page", label: "Dashboard", href: "/dashboard" },
  { type: "page", label: "Analytics", href: "/dashboard" },
  { type: "record", label: "Order #8241", href: "/dashboard" },
  { type: "user", label: "Sarah Chen", href: "/dashboard" },
  { type: "workflow", label: "Procurement Approval", href: "/dashboard" },
  { type: "report", label: "Q2 Financial Report", href: "/dashboard" },
];

const notifications = [
  { id: 1, text: "Budget approved for Q3", time: "2m ago", unread: true, priority: "high" },
  { id: 2, text: "New vendor onboarded", time: "15m ago", unread: true, priority: "normal" },
  { id: 3, text: "Security audit passed", time: "1h ago", unread: false, priority: "normal" },
  { id: 4, text: "Report generated", time: "2h ago", unread: false, priority: "low" },
  { id: 5, text: "User onboarded", time: "3h ago", unread: false, priority: "low" },
];

const unreadCount = notifications.filter((n) => n.unread).length;

export function DashboardNavbar() {
  const { toggleSidebar, setMobileDrawerOpen, commandOpen, setCommandOpen } = useDashboard();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ctrl+K handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setCommandOpen]);

  const breadcrumb = pathname === "/dashboard" ? "Overview" : pathname.split("/").pop()?.replace(/-/g, " ");

  const filtered = searchQuery
    ? searchSuggestions.filter((s) => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchSuggestions;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Breadcrumb */}
          <nav className="hidden items-center gap-1.5 text-sm md:flex" aria-label="Breadcrumb">
            <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
              Nexus
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-medium text-foreground capitalize">{breadcrumb}</span>
          </nav>
        </div>

        {/* Center - Search */}
        <div ref={searchRef} className="relative hidden max-w-md flex-1 px-4 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="input-focus-glow h-9 w-full rounded-lg border border-border bg-muted/40 pl-9 pr-20 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <kbd className="hidden h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </div>
          </div>

          {/* Search Dropdown */}
          {searchFocused && (
            <div className="absolute left-4 right-4 top-full mt-1 rounded-xl border border-border bg-card p-2 shadow-lg animate-slide-down">
              {filtered.length > 0 ? (
                <>
                  <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Suggestions</p>
                  {filtered.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        router.push(item.href);
                        setSearchFocused(false);
                        setSearchQuery("");
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[10px] font-medium text-muted-foreground uppercase">
                        {item.type[0]}
                      </span>
                      {item.label}
                      <span className="ml-auto text-xs text-muted-foreground/60 capitalize">{item.type}</span>
                    </button>
                  ))}
                </>
              ) : (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">No results found</p>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          {/* Command Palette Button */}
          <button
            onClick={() => setCommandOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Command palette"
          >
            <Command className="h-4 w-4" />
          </button>

          {/* Help */}
          <button
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
            aria-label="Help center"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 rounded-xl border border-border bg-card shadow-lg animate-slide-down">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  <span className="text-xs text-primary cursor-pointer">Mark all read</span>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                    >
                      <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-border"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${n.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                          {n.text}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-border p-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center rounded-lg py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
                    onClick={() => setNotifOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                JD
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-foreground leading-tight">John Doe</p>
                <p className="text-xs text-muted-foreground leading-tight">john@company.com</p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-card shadow-lg animate-slide-down">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@company.com</p>
                </div>
                <div className="p-1.5">
                  {[
                    { icon: User, label: "Profile", href: "/dashboard" },
                    { icon: Settings, label: "Settings", href: "/dashboard" },
                    { icon: Shield, label: "Security", href: "/dashboard" },
                    { icon: Clock, label: "Activity Log", href: "/dashboard" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border p-1.5">
                  <Link
                    href="/login"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/5"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
