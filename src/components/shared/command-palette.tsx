"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-context";
import {
  Search, LayoutDashboard, Package, Users, Building2, CalendarClock,
  Wrench, ClipboardCheck, BarChart3, Bell, FileText, Settings, LogOut,
  ArrowLeftRight, ChevronRight, Plus, Download, RefreshCw, UserPlus,
  Upload,
} from "lucide-react";

interface CommandItem {
  id: string;
  category: string;
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  shortcut?: string;
}

const COMMAND_ITEMS: Omit<CommandItem, "action">[] = [
  { id: "p1", category: "Pages", label: "Dashboard", sublabel: "Overview & KPIs", icon: LayoutDashboard, href: "/dashboard" },
  { id: "p2", category: "Pages", label: "Organization Setup", icon: Building2, href: "/dashboard/organization" },
  { id: "p3", category: "Pages", label: "Asset Directory", icon: Package, href: "/dashboard/assets" },
  { id: "p4", category: "Pages", label: "Asset Allocation", icon: ArrowLeftRight, href: "/dashboard/allocations" },
  { id: "p5", category: "Pages", label: "Resource Booking", icon: CalendarClock, href: "/dashboard/bookings" },
  { id: "p6", category: "Pages", label: "Maintenance", icon: Wrench, href: "/dashboard/maintenance" },
  { id: "p7", category: "Pages", label: "Audit Module", icon: ClipboardCheck, href: "/dashboard/audit" },
  { id: "p8", category: "Pages", label: "Reports & Analytics", icon: BarChart3, href: "/dashboard/reports" },
  { id: "p9", category: "Pages", label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { id: "p10", category: "Pages", label: "Activity Logs", icon: FileText, href: "/dashboard/logs" },
  { id: "p11", category: "Pages", label: "Settings", icon: Settings, href: "/dashboard/settings" },
  { id: "a1", category: "Actions", label: "Register New Asset", icon: Plus, href: "/dashboard/assets", shortcut: "A+R" },
  { id: "a2", category: "Actions", label: "New Maintenance Task", icon: Plus, href: "/dashboard/maintenance", shortcut: "M+N" },
  { id: "a3", category: "Actions", label: "New Booking", icon: Plus, href: "/dashboard/bookings", shortcut: "B+N" },
  { id: "a4", category: "Actions", label: "Transfer Asset", icon: ArrowLeftRight, href: "/dashboard/allocations", shortcut: "A+T" },
  { id: "a5", category: "Actions", label: "Create Audit Cycle", icon: Plus, href: "/dashboard/audit" },
  { id: "a6", category: "Actions", label: "Export Report", icon: Download, href: "/dashboard/reports" },
  { id: "a7", category: "Actions", label: "Add Employee", icon: UserPlus, href: "/dashboard/organization" },
  { id: "a8", category: "Actions", label: "Bulk Import Assets", icon: Upload, href: "/dashboard/assets" },
  { id: "e1", category: "Employees", label: "Priya Shah", sublabel: "Engineering Manager", icon: Users, href: "/dashboard/organization" },
  { id: "e2", category: "Employees", label: "Rahul Verma", sublabel: "IT Administrator", icon: Users, href: "/dashboard/organization" },
  { id: "e3", category: "Employees", label: "Amit Patel", sublabel: "Maintenance Lead", icon: Users, href: "/dashboard/organization" },
  { id: "e4", category: "Employees", label: "Sneha Reddy", sublabel: "Finance Analyst", icon: Users, href: "/dashboard/organization" },
  { id: "e5", category: "Employees", label: "Kavita Nair", sublabel: "Operations Head", icon: Users, href: "/dashboard/organization" },
  { id: "e6", category: "Employees", label: "Devendra Joshi", sublabel: "Audit Manager", icon: Users, href: "/dashboard/organization" },
  { id: "c1", category: "Commands", label: "Toggle Sidebar", icon: LayoutDashboard, shortcut: "Ctrl+B" },
  { id: "c2", category: "Commands", label: "Toggle Theme", icon: RefreshCw, shortcut: "Ctrl+Shift+T" },
  { id: "c3", category: "Commands", label: "View Profile", icon: Users, href: "/dashboard/profile", shortcut: "Ctrl+Shift+P" },
  { id: "c4", category: "Commands", label: "Sign Out", icon: LogOut, href: "/login" },
];

function CommandPaletteInner() {
  const { commandOpen, setCommandOpen } = useDashboard();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const prevOpen = useRef(commandOpen);

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMAND_ITEMS;
    const q = query.toLowerCase();
    return COMMAND_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.sublabel && item.sublabel.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filtered]);

  const categoryOffsets = useMemo(() => {
    const entries = Object.entries(grouped);
    return entries.reduce<Record<string, number>>((acc, [category], i) => {
      if (i === 0) {
        acc[category] = 0;
      } else {
        const [prevCategory] = entries[i - 1];
        acc[category] = acc[prevCategory] + grouped[prevCategory].length;
      }
      return acc;
    }, {});
  }, [grouped]);

  useEffect(() => {
    if (prevOpen.current && !commandOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
    prevOpen.current = commandOpen;
  }, [commandOpen]);

  useEffect(() => {
    if (commandOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [commandOpen]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  useEffect(() => {
    if (!commandOpen) return;
    const container = document.querySelector<HTMLElement>("[aria-label='Command palette'] .relative.z-10");
    if (!container) return;
    const focusable = container.querySelectorAll<HTMLElement>("input, button, [href], [tabindex]:not([tabindex='-1'])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [commandOpen]);

  const executeItem = useCallback((item: (typeof COMMAND_ITEMS)[number]) => {
    if (item.href) router.push(item.href);
    setCommandOpen(false);
  }, [router, setCommandOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((p) => (p + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((p) => (p - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      executeItem(filtered[selectedIndex]);
    }
  }, [filtered, selectedIndex, executeItem]);

  if (!commandOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[18vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setCommandOpen(false)} />
      <div className="relative z-10 w-full max-w-xl mx-4 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, page, or action..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {Object.entries(grouped).map(([category, items]) => {
            const offset = categoryOffsets[category];
            return (
              <div key={category} className="mb-2">
                <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{category}</p>
                {items.map((item, localIdx) => {
                  const idx = offset + localIdx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => executeItem(item)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        idx === selectedIndex ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                        <item.icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium truncate text-xs">{item.label}</p>
                        {item.sublabel && <p className="text-[10px] text-muted-foreground truncate">{item.sublabel}</p>}
                      </div>
                      {item.shortcut && (
                        <span className="text-[9px] text-muted-foreground/40 font-mono">{item.shortcut}</span>
                      )}
                      <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-30" />
                    </button>
                  );
                })}
              </div>
            );
          })}
          {query.trim() && filtered.length === 0 && (
            <div className="py-8 text-center">
              <Search className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 py-0.5">↑↓</kbd> navigate</span>
            <span className="inline-flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 py-0.5">↵</kbd> execute</span>
            <span className="inline-flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 py-0.5">ESC</kbd> close</span>
          </div>
          <span className="text-[10px] text-muted-foreground">{filtered.length} items</span>
        </div>
      </div>
    </div>
  );
}

export const CommandPalette = React.memo(CommandPaletteInner);
