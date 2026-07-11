"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  Bell,
  Shield,
  LogOut,
  Command,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const commands = [
  { icon: LayoutDashboard, label: "Go to Dashboard", path: "/dashboard" },
  { icon: Users, label: "Go to Users", path: "/dashboard/admin" },
  { icon: FileText, label: "Go to Reports", path: "/dashboard/reports" },
  { icon: BarChart3, label: "Go to Analytics", path: "/dashboard" },
  { icon: Bell, label: "View Notifications", path: "/dashboard/notifications" },
  { icon: Shield, label: "Security Settings", path: "/dashboard/settings" },
  { icon: Settings, label: "Account Settings", path: "/dashboard/settings" },
  { icon: LogOut, label: "Log Out", path: "/login" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        router.push(filtered[selectedIndex].path);
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIndex, router]);

  useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.children[selectedIndex] as HTMLElement;
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Palette */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            aria-label="Search commands"
            aria-controls="command-list"
            aria-activedescendant={filtered[selectedIndex] ? `command-${selectedIndex}` : undefined}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>
        <div id="command-list" ref={listRef} role="listbox" aria-label="Commands" className="max-h-72 overflow-y-auto p-2">
          {filtered.map((cmd, i) => (
            <button
              key={cmd.label}
              id={`command-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              onClick={() => {
                router.push(cmd.path);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                i === selectedIndex
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <cmd.icon className="h-4 w-4" aria-hidden="true" />
              {cmd.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <p role="status" className="py-6 text-center text-sm text-muted-foreground">
              No commands found
            </p>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <ChevronUp className="h-3 w-3" /><ChevronDown className="h-3 w-3" />
            </span>
            <span>navigate</span>
            <span className="ml-1 rounded border border-border bg-muted px-1 py-0.5">↵</span>
            <span>select</span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {filtered.length} commands
          </span>
        </div>
      </div>
    </div>
  );
}
