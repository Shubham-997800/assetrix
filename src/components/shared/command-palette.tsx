"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

const commands = [
  { icon: LayoutDashboard, label: "Go to Dashboard", path: "/dashboard" },
  { icon: Users, label: "Go to Users", path: "/dashboard" },
  { icon: FileText, label: "Go to Reports", path: "/dashboard" },
  { icon: BarChart3, label: "Go to Analytics", path: "/dashboard" },
  { icon: Bell, label: "View Notifications", path: "/dashboard" },
  { icon: Shield, label: "Security Settings", path: "/dashboard" },
  { icon: Settings, label: "Account Settings", path: "/dashboard" },
  { icon: LogOut, label: "Log Out", path: "/login" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.map((cmd) => (
            <button
              key={cmd.label}
              onClick={() => {
                router.push(cmd.path);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <cmd.icon className="h-4 w-4" />
              {cmd.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No commands found
            </p>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Command className="h-3 w-3" /> K to toggle
          </div>
          <span className="text-[10px] text-muted-foreground">
            {filtered.length} commands
          </span>
        </div>
      </div>
    </div>
  );
}
