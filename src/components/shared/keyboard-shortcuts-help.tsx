"use client";

import { useDashboard } from "@/contexts/dashboard-context";
import { X, Keyboard } from "lucide-react";
import { useEffect } from "react";

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string[]; label: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "Global",
    shortcuts: [
      { keys: ["Ctrl", "K"], label: "Open search" },
      { keys: ["Ctrl", "/"], label: "Command palette" },
      { keys: ["Ctrl", "B"], label: "Toggle sidebar" },
      { keys: ["Ctrl", "Shift", "T"], label: "Toggle theme" },
      { keys: ["Ctrl", "Shift", "P"], label: "Go to profile" },
      { keys: ["Ctrl", "Shift", "S"], label: "Go to settings" },
      { keys: ["Esc"], label: "Close panel / modal" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["A", "R"], label: "Register new asset" },
      { keys: ["M", "N"], label: "New maintenance task" },
      { keys: ["B", "N"], label: "New booking" },
      { keys: ["A", "T"], label: "Transfer asset" },
    ],
  },
  {
    title: "Table Navigation",
    shortcuts: [
      { keys: ["↑", "↓"], label: "Navigate rows" },
      { keys: ["Enter"], label: "Open selected" },
      { keys: ["Space"], label: "Toggle selection" },
      { keys: ["Shift", "Click"], label: "Range select" },
      { keys: ["Ctrl", "A"], label: "Select all" },
      { keys: ["Delete"], label: "Delete selected" },
    ],
  },
];

export function KeyboardShortcutsHelp() {
  const { shortcutsOpen, setShortcutsOpen } = useDashboard();

  useEffect(() => {
    if (!shortcutsOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShortcutsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [shortcutsOpen, setShortcutsOpen]);

  if (!shortcutsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShortcutsOpen(false)} />
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Keyboard className="h-4 w-4 text-primary" />
            </span>
            <h2 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setShortcutsOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-5">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{group.title}</h3>
              <div className="space-y-1.5">
                {group.shortcuts.map((shortcut) => (
                  <div key={shortcut.label} className="flex items-center justify-between rounded-lg px-2 py-1.5">
                    <span className="text-xs text-foreground">{shortcut.label}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-5 py-3 text-center">
          <p className="text-[10px] text-muted-foreground">Press <kbd className="rounded border border-border bg-muted px-1 py-0.5">?</kbd> anytime to view shortcuts</p>
        </div>
      </div>
    </div>
  );
}
