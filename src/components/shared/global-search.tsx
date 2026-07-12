"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-context";
import {
  Search, Package, Users, Building2, CalendarClock, Wrench, ClipboardCheck,
  BarChart3, Bell, FileText, LayoutDashboard, ArrowLeftRight, Clock, X,
} from "lucide-react";

interface SearchResult {
  id: string;
  category: string;
  label: string;
  sublabel: string;
  href: string;
  icon: React.ElementType;
}

const ALL_ITEMS: SearchResult[] = [
  { id: "1", category: "Pages", label: "Dashboard", sublabel: "Overview & KPIs", href: "/dashboard", icon: LayoutDashboard },
  { id: "2", category: "Pages", label: "Organization Setup", sublabel: "Departments & Categories", href: "/dashboard/organization", icon: Building2 },
  { id: "3", category: "Pages", label: "Asset Directory", sublabel: "All registered assets", href: "/dashboard/assets", icon: Package },
  { id: "4", category: "Pages", label: "Asset Allocation", sublabel: "Assign & transfer assets", href: "/dashboard/allocations", icon: ArrowLeftRight },
  { id: "5", category: "Pages", label: "Resource Booking", sublabel: "Book resources & rooms", href: "/dashboard/bookings", icon: CalendarClock },
  { id: "6", category: "Pages", label: "Maintenance", sublabel: "Tasks & schedules", href: "/dashboard/maintenance", icon: Wrench },
  { id: "7", category: "Pages", label: "Audit Module", sublabel: "Audit cycles & verifications", href: "/dashboard/audit", icon: ClipboardCheck },
  { id: "8", category: "Pages", label: "Reports & Analytics", sublabel: "Export & insights", href: "/dashboard/reports", icon: BarChart3 },
  { id: "9", category: "Pages", label: "Notifications", sublabel: "Alerts & activity", href: "/dashboard/notifications", icon: Bell },
  { id: "10", category: "Pages", label: "Activity Logs", sublabel: "System audit trail", href: "/dashboard/logs", icon: FileText },
  { id: "11", category: "Pages", label: "Profile", sublabel: "Your account", href: "/dashboard/profile", icon: Users },
  { id: "a1", category: "Assets", label: "AF-0001 MacBook Pro 16\"", sublabel: "Engineering / Available", href: "/dashboard/assets", icon: Package },
  { id: "a2", category: "Assets", label: "AF-0002 Dell Latitude 5540", sublabel: "Marketing / Allocated", href: "/dashboard/assets", icon: Package },
  { id: "a3", category: "Assets", label: "AF-0003 HP LaserJet Pro", sublabel: "Admin / Available", href: "/dashboard/assets", icon: Package },
  { id: "a4", category: "Assets", label: "AF-0010 Conference Room B2", sublabel: "Operations / Available", href: "/dashboard/assets", icon: Package },
  { id: "a5", category: "Assets", label: "AF-0015 Toyota Innova", sublabel: "Logistics / Allocated", href: "/dashboard/assets", icon: Package },
  { id: "e1", category: "Employees", label: "Priya Shah", sublabel: "Engineering Manager", href: "/dashboard/organization", icon: Users },
  { id: "e2", category: "Employees", label: "Rahul Verma", sublabel: "IT Administrator", href: "/dashboard/organization", icon: Users },
  { id: "e3", category: "Employees", label: "Amit Patel", sublabel: "Maintenance Lead", href: "/dashboard/organization", icon: Users },
  { id: "e4", category: "Employees", label: "Sneha Reddy", sublabel: "Finance Analyst", href: "/dashboard/organization", icon: Users },
  { id: "d1", category: "Departments", label: "Engineering", sublabel: "42 employees", href: "/dashboard/organization", icon: Building2 },
  { id: "d2", category: "Departments", label: "Marketing", sublabel: "28 employees", href: "/dashboard/organization", icon: Building2 },
  { id: "d3", category: "Departments", label: "Operations", sublabel: "35 employees", href: "/dashboard/organization", icon: Building2 },
  { id: "d4", category: "Departments", label: "Finance", sublabel: "18 employees", href: "/dashboard/organization", icon: Building2 },
  { id: "b1", category: "Bookings", label: "Meeting Room A — Today 2PM", sublabel: "Product sync / Approved", href: "/dashboard/bookings", icon: CalendarClock },
  { id: "b2", category: "Bookings", label: "Conference Room B2 — Mon 10AM", sublabel: "Sprint planning / Pending", href: "/dashboard/bookings", icon: CalendarClock },
  { id: "m1", category: "Maintenance", label: "MNT-042 Laptop screen repair", sublabel: "AF-0005 / In Progress", href: "/dashboard/maintenance", icon: Wrench },
  { id: "m2", category: "Maintenance", label: "MNT-039 AC unit service", sublabel: "AF-0020 / Scheduled", href: "/dashboard/maintenance", icon: Wrench },
];

function loadRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("assetrix-recent-searches");
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useDashboard();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const prevOpen = useRef(searchOpen);

  useEffect(() => {
    if (prevOpen.current && !searchOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
    prevOpen.current = searchOpen;
  }, [searchOpen]);

  const grouped = useMemo(() => {
    if (!query.trim()) return {};
    const filtered = ALL_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.sublabel.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    const groups: Record<string, SearchResult[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [query]);

  const flatResults = useMemo(() => Object.values(grouped).flat(), [grouped]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const closeSearch = useCallback(() => setSearchOpen(false), [setSearchOpen]);

  const navigateTo = useCallback((href: string, _label: string) => {
    router.push(href);
    closeSearch();
    if (query.trim()) {
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== query);
        const next = [query, ...filtered].slice(0, 5);
        try { localStorage.setItem("assetrix-recent-searches", JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    }
  }, [router, closeSearch, query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((p) => (p + 1) % Math.max(flatResults.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((p) => (p - 1 + flatResults.length) % Math.max(flatResults.length, 1));
    } else if (e.key === "Enter" && flatResults[selectedIndex]) {
      navigateTo(flatResults[selectedIndex].href, flatResults[selectedIndex].label);
    }
  }, [flatResults, selectedIndex, navigateTo]);

  if (!searchOpen) return null;

  let runningIndex = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]" role="dialog" aria-modal="true" aria-label="Global search">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeSearch} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search assets, employees, pages, actions..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {!query.trim() && recentSearches.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Recent Searches</p>
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); setSelectedIndex(0); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  <Clock className="h-3.5 w-3.5" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {query.trim() && Object.keys(grouped).length > 0 && (
            Object.entries(grouped).map(([category, items]) => {
              return (
                <div key={category} className="mb-2">
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{category}</p>
                  {items.map((item) => {
                    runningIndex++;
                    const idx = runningIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.href, item.label)}
                        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors ${
                          idx === selectedIndex ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                          <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-medium truncate">{item.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.sublabel}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 font-medium uppercase">{item.category}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}

          {query.trim() && Object.keys(grouped).length === 0 && (
            <div className="py-8 text-center">
              <Search className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-xs text-muted-foreground/60">Try different keywords or browse pages</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 py-0.5">↑↓</kbd> navigate</span>
            <span className="inline-flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 py-0.5">↵</kbd> select</span>
            <span className="inline-flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 py-0.5">ESC</kbd> close</span>
          </div>
          <span className="text-[10px] text-muted-foreground">{flatResults.length} results</span>
        </div>
      </div>
    </div>
  );
}
