"use client";

import { useMemo } from "react";
import {
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { AuditTabs } from "./_components/audit-tabs";
import { MOCK_CYCLES, MOCK_AUDIT_ASSETS, MOCK_DISCREPANCIES } from "./_components/data";

export default function AuditPage() {
  const stats = useMemo(() => ({
    totalCycles: MOCK_CYCLES.length,
    activeCycles: MOCK_CYCLES.filter((c) => c.status === "Active").length,
    totalAssets: MOCK_AUDIT_ASSETS.length,
    verifiedAssets: MOCK_AUDIT_ASSETS.filter((a) => a.result === "Verified").length,
    openDiscrepancies: MOCK_DISCREPANCIES.filter((d) => d.status !== "Resolved" && d.status !== "Closed").length,
  }), []);

  const cards = [
    { label: "Total Cycles", value: stats.totalCycles, icon: <ClipboardCheck className="h-4 w-4" />, color: "text-primary" },
    { label: "Active Cycles", value: stats.activeCycles, icon: <Clock className="h-4 w-4" />, color: "text-blue-500" },
    { label: "Assets to Audit", value: stats.totalAssets, icon: <TrendingUp className="h-4 w-4" />, color: "text-amber-500" },
    { label: "Verified", value: stats.verifiedAssets, icon: <CheckCircle className="h-4 w-4" />, color: "text-emerald-500" },
    { label: "Open Discrepancies", value: stats.openDiscrepancies, icon: <AlertTriangle className="h-4 w-4" />, color: "text-destructive" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight sm:text-2xl">
              Asset Audit
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Schedule, track, and manage physical verification audit cycles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
                <span className={c.color}>{c.icon}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{c.value}</p>
            </div>
          ))}
        </div>

        <AuditTabs />
      </div>
    </div>
  );
}
