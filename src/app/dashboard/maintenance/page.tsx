"use client";

<<<<<<< HEAD
import { useMemo, useEffect, useState, useCallback } from "react";
=======
import { useMemo, useCallback, memo } from "react";
>>>>>>> 95ccf54 (perf: optimize assets, allocations, bookings, maintenance, audit pages)
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { MaintenanceTabs } from "./_components/maintenance-tabs";
import { RaiseRequestForm } from "./_components/raise-request";
import { maintenanceApi } from "@/lib/api";
import type { ApiError } from "@/lib/api";
import type { MaintenanceRequest } from "./_components/types";

const STAT_CARDS = [
  { label: "Total Requests", icon: <Wrench className="h-4 w-4" />, color: "text-primary" },
  { label: "Pending Review", icon: <Clock className="h-4 w-4" />, color: "text-amber-500" },
  { label: "In Progress", icon: <TrendingUp className="h-4 w-4" />, color: "text-blue-500" },
  { label: "Resolved", icon: <CheckCircle className="h-4 w-4" />, color: "text-emerald-500" },
  { label: "Critical Open", icon: <AlertCircle className="h-4 w-4" />, color: "text-destructive" },
] as const;

function MaintenancePage() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await maintenanceApi.list();
      setRequests((res.data || []) as MaintenanceRequest[]);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    inProgress: requests.filter((r) => ["In Progress", "Technician Assigned", "Approved"].includes(r.status)).length,
    resolved: requests.filter((r) => r.status === "Resolved").length,
    critical: requests.filter((r) => r.priority === "Critical" && r.status !== "Resolved").length,
  }), [requests]);

  const cards = useMemo(() => [
    { ...STAT_CARDS[0], value: stats.total },
    { ...STAT_CARDS[1], value: stats.pending },
    { ...STAT_CARDS[2], value: stats.inProgress },
    { ...STAT_CARDS[3], value: stats.resolved },
    { ...STAT_CARDS[4], value: stats.critical },
  ], [stats]);

  const handleShowForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleHideForm = useCallback(() => {
    setShowForm(false);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight sm:text-2xl">
              Maintenance Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track, manage, and resolve asset maintenance requests
            </p>
          </div>
          {!showForm && (
            <Button size="default" className="btn-enterprise" onClick={handleShowForm}>
              <Plus className="h-3.5 w-3.5" /> Raise Request
            </Button>
          )}
        </div>

        {!showForm && (
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
        )}

<<<<<<< HEAD
        {loading && !showForm ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error && !showForm ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="btn-enterprise mt-3" onClick={fetchRequests}>Retry</Button>
          </div>
        ) : showForm ? (
          <RaiseRequestForm onSubmit={() => { setShowForm(false); fetchRequests(); }} onCancel={() => setShowForm(false)} />
=======
        {showForm ? (
          <RaiseRequestForm onSubmit={handleHideForm} onCancel={handleHideForm} />
>>>>>>> 95ccf54 (perf: optimize assets, allocations, bookings, maintenance, audit pages)
        ) : (
          <MaintenanceTabs initialRequests={requests} onRefresh={fetchRequests} />
        )}
      </div>
    </div>
  );
}

export default memo(MaintenancePage);
