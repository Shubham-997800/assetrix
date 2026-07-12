"use client";

import { useEffect } from "react";
import { X, QrCode, Eye, Wrench, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetQRModalProps {
  open: boolean;
  onClose: () => void;
  assetTag: string;
  assetName: string;
}

function QRCodePlaceholder({ value }: { value: string }) {
  const size = 180;
  const modules = 21;
  const cellSize = size / modules;

  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const grid: boolean[][] = [];
  for (let r = 0; r < modules; r++) {
    grid[r] = [];
    for (let c = 0; c < modules; c++) {
      const isFinder =
        (r < 7 && c < 7) ||
        (r < 7 && c >= modules - 7) ||
        (r >= modules - 7 && c < 7);
      const isFinderInner =
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= modules - 5 && c <= modules - 3) ||
        (r >= modules - 5 && r <= modules - 3 && c >= 2 && c <= 4);
      if (isFinderInner) {
        grid[r][c] = true;
      } else if (isFinder) {
        const isEdge =
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          c === modules - 1 ||
          c === modules - 7 ||
          r === modules - 1 ||
          r === modules - 7;
        grid[r][c] = isEdge;
      } else {
        grid[r][c] = ((seed * (r * modules + c + 1) * 31) % 100) > 45;
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-lg"
    >
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#0F172A"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function AssetQRModal({ open, onClose, assetTag, assetName }: AssetQRModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const actions = [
    { icon: Eye, label: "View Asset", description: "Open full asset details" },
    { icon: Wrench, label: "Raise Maintenance", description: "Create a maintenance request" },
    { icon: ClipboardCheck, label: "Verify During Audit", description: "Mark as verified in audit" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <QrCode className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{assetTag}</h3>
          <p className="text-xs text-muted-foreground">{assetName}</p>

          <div className="mt-5 rounded-lg border border-border p-4">
            <QRCodePlaceholder value={assetTag} />
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground">
            Scan this QR code to quickly access asset details
          </p>

          <div className="mt-5 w-full space-y-2">
            {actions.map((action) => (
              <button
                key={action.label}
                className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <action.icon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">{action.label}</p>
                  <p className="text-[10px] text-muted-foreground">{action.description}</p>
                </div>
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="btn-enterprise mt-4 w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
