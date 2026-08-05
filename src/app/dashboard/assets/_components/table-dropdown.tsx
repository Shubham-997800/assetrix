"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownOption {
  label: string;
  value: string;
}

interface TableDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TableDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}: TableDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;

  const selected = options.find((o) => o.value === value);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [close]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (!open) {
      setOpen(true);
      return;
    }
    const opts = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    if (opts.length === 0) return;
    const currentIdx = opts.indexOf(document.activeElement as HTMLElement);
    const next = e.key === "ArrowDown" ? (currentIdx + 1) % opts.length : (currentIdx - 1 + opts.length) % opts.length;
    opts[next]?.focus();
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && (
        <label id={labelId} htmlFor={id} className="mb-1 block text-[11px] font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={label ? labelId : undefined}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <span className={`min-w-0 truncate ${selected ? "text-foreground" : "text-muted-foreground"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-md animate-in fade-in slide-in-from-top-1">
          <div ref={listRef} id={listboxId} role="listbox" aria-labelledby={label ? labelId : undefined} className="max-h-60 overflow-y-auto p-1">
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => {
                onChange("");
                close();
              }}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                !value ? "bg-muted text-foreground" : "text-muted-foreground"
              }`}
            >
              <span className="w-4" />
              <span>{placeholder}</span>
            </button>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                onClick={() => {
                  onChange(opt.value);
                  close();
                }}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                  value === opt.value
                    ? "bg-primary/10 text-primary"
                    : "text-foreground"
                }`}
              >
                <span className="w-4">
                  {value === opt.value && <Check className="h-3.5 w-3.5 text-primary" />}
                </span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MultiDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}: MultiDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [close]);

  const toggle = (v: string) => {
    onChange(
      value.includes(v) ? value.filter((x) => x !== v) : [...value, v]
    );
  };

  const displayText = value.length
    ? `${value.length} selected`
    : placeholder;

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (!open) {
      setOpen(true);
      return;
    }
    const opts = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    if (opts.length === 0) return;
    const currentIdx = opts.indexOf(document.activeElement as HTMLElement);
    const next = e.key === "ArrowDown" ? (currentIdx + 1) % opts.length : (currentIdx - 1 + opts.length) % opts.length;
    opts[next]?.focus();
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && (
        <label id={labelId} htmlFor={id} className="mb-1 block text-[11px] font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={label ? labelId : undefined}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <span className={`min-w-0 truncate ${value.length ? "text-foreground" : "text-muted-foreground"}`}>
          {displayText}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-md animate-in fade-in slide-in-from-top-1">
          <div ref={listRef} id={listboxId} role="listbox" aria-labelledby={label ? labelId : undefined} className="max-h-60 overflow-y-auto p-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value.includes(opt.value)}
                onClick={() => toggle(opt.value)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                  value.includes(opt.value)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground"
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded border border-border">
                  {value.includes(opt.value) && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                </span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
          {value.length > 0 && (
            <div className="border-t border-border p-1">
              <button
                type="button"
                onClick={() => {
                  onChange([]);
                  close();
                }}
                className="w-full rounded-md px-3 py-1.5 text-center text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
