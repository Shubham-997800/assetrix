"use client";

import { useMemo, useEffect, useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { AuditTabs } from "./_components/audit-tabs";
import { auditApi } from "@/lib/api";
import type { ApiError } from "@/lib/api";
import type { AuditCycle } from "./_components/types";

const AUDIT_CARD_CONFIG = [
  { label: "Total Cycles", icon: <ClipboardCheck className="h-4 w-4" />, color: "text-primary" },
  { label: "Active Cycles", icon: <Clock className="h-4 w-4" />, color: "text-blue-500" },
  { label: "Assets to Audit", icon: <TrendingUp className="h-4 w-4" />, color: "text-amber-500" },
  { label: "Verified", icon: <CheckCircle className="h-4 w-4" />, color: "text-emerald-500" },
  { label: "Open Discrepancies", icon: <AlertTriangle className="h-4 w-4" />, color: "text-destructive" },
] as const;

function AuditPage() {
  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCycles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await auditApi.listCycles();
      setCycles((res.data || []) as AuditCycle[]);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to load audit cycles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  const stats = useMemo(() => ({
    totalCycles: cycles.length,
    activeCycles: cycles.filter((c) => c.status === "Active").length,
    totalAssets: cycles.reduce((sum, c) => sum + (c.totalAssets || 0), 0),
    verifiedAssets: cycles.reduce((sum, c) => sum + (c.verifiedCount || 0), 0),
    openDiscrepancies: cycles.reduce((sum, c) => sum + (c.discrepanciesCount || 0), 0),
  }), [cycles]);

  const cards = useMemo(() => [
    { ...AUDIT_CARD_CONFIG[0], value: stats.totalCycles },
    { ...AUDIT_CARD_CONFIG[1], value: stats.activeCycles },
    { ...AUDIT_CARD_CONFIG[2], value: stats.totalAssets },
    { ...AUDIT_CARD_CONFIG[3], value: stats.verifiedAssets },
    { ...AUDIT_CARD_CONFIG[4], value: stats.openDiscrepancies },
  ], [stats]);

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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="btn-enterprise mt-3" onClick={fetchCycles}>Retry</Button>
          </div>
        ) : (
          <AuditTabs initialCycles={cycles} onRefresh={fetchCycles} />
        )}
      </div>
    </div>
  );
}

export default memo(AuditPage);
