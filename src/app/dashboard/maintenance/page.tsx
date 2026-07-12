"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { MaintenanceTabs } from "./_components/maintenance-tabs";
import { RaiseRequestForm } from "./_components/raise-request";
import { MOCK_REQUESTS } from "./_components/data";
import { useState } from "react";

export default function MaintenancePage() {
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => ({
    total: MOCK_REQUESTS.length,
    pending: MOCK_REQUESTS.filter((r) => r.status === "Pending").length,
    inProgress: MOCK_REQUESTS.filter((r) => ["In Progress", "Technician Assigned", "Approved"].includes(r.status)).length,
    resolved: MOCK_REQUESTS.filter((r) => r.status === "Resolved").length,
    critical: MOCK_REQUESTS.filter((r) => r.priority === "Critical" && r.status !== "Resolved").length,
  }), []);

  const cards = [
    { label: "Total Requests", value: stats.total, icon: <Wrench className="h-4 w-4" />, color: "text-primary" },
    { label: "Pending Review", value: stats.pending, icon: <Clock className="h-4 w-4" />, color: "text-amber-500" },
    { label: "In Progress", value: stats.inProgress, icon: <TrendingUp className="h-4 w-4" />, color: "text-blue-500" },
    { label: "Resolved", value: stats.resolved, icon: <CheckCircle className="h-4 w-4" />, color: "text-emerald-500" },
    { label: "Critical Open", value: stats.critical, icon: <AlertCircle className="h-4 w-4" />, color: "text-destructive" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Maintenance Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track, manage, and resolve asset maintenance requests
            </p>
          </div>
          {!showForm && (
            <Button size="default" className="btn-enterprise" onClick={() => setShowForm(true)}>
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

        {showForm ? (
          <RaiseRequestForm onSubmit={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        ) : (
          <MaintenanceTabs />
        )}
      </div>
    </div>
  );
}
