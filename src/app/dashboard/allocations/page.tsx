"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  Clock,
  AlertTriangle,
  Search,
  CheckCircle,
  History,
  Plus,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { MOCK_ALLOCATIONS } from "./_components/data";
import { AllocateAssetForm } from "./_components/allocate-form";
import {
  ActiveAllocationsTab,
  TransferRequestsTab,
  PendingApprovalsTab,
  OverdueReturnsTab,
  ReturnedAssetsTab,
  AllocationHistoryTab,
} from "./_components/allocation-tabs";

type Tab = "active" | "allocate" | "transfers" | "approvals" | "overdue" | "returned" | "history";
type View = "tabs" | "form";

const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
  { id: "active", label: "Active Allocations", icon: ArrowLeftRight },
  { id: "transfers", label: "Transfer Requests", icon: ArrowRight },
  { id: "approvals", label: "Pending Approvals", icon: Clock, count: 3 },
  { id: "overdue", label: "Overdue Returns", icon: AlertTriangle },
  { id: "returned", label: "Returned Assets", icon: RotateCcw },
  { id: "history", label: "Allocation History", icon: History },
];

export default function AllocationsPage() {
  const [view, setView] = useState<View>("tabs");
  const [activeTab, setActiveTab] = useState<Tab>("active");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Asset Allocation
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage asset assignments, transfers, and returns
          </p>
        </div>
        {view === "tabs" && (
          <Button size="sm" className="btn-enterprise" onClick={() => setView("form")}>
            <Plus className="h-3.5 w-3.5" /> Allocate Asset
          </Button>
        )}
      </div>

      {/* Tabs */}
      {view === "tabs" && (
        <div className="border-b border-border">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.count !== undefined && (
                  <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Content */}
      {view === "tabs" && activeTab === "active" && <ActiveAllocationsTab />}
      {view === "tabs" && activeTab === "transfers" && <TransferRequestsTab />}
      {view === "tabs" && activeTab === "approvals" && <PendingApprovalsTab />}
      {view === "tabs" && activeTab === "overdue" && <OverdueReturnsTab />}
      {view === "tabs" && activeTab === "returned" && <ReturnedAssetsTab />}
      {view === "tabs" && activeTab === "history" && <AllocationHistoryTab />}

      {view === "form" && (
        <AllocateAssetForm
          existingAllocations={MOCK_ALLOCATIONS}
          onSubmit={() => setView("tabs")}
          onCancel={() => setView("tabs")}
        />
      )}
    </div>
  );
}
