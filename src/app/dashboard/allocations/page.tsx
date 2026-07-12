"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState, useCallback, memo } from "react";
>>>>>>> 95ccf54 (perf: optimize assets, allocations, bookings, maintenance, audit pages)
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  Clock,
  AlertTriangle,
  History,
  Plus,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { allocationApi } from "@/lib/api";
import type { Allocation as ApiAllocation } from "@/lib/types";
import type { Allocation } from "./_components/types";
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

<<<<<<< HEAD
export default function AllocationsPage() {
=======
const ALLOCATION_TABS: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
  { id: "active", label: "Active Allocations", icon: ArrowLeftRight },
  { id: "transfers", label: "Transfer Requests", icon: ArrowRight },
  { id: "approvals", label: "Pending Approvals", icon: Clock, count: 3 },
  { id: "overdue", label: "Overdue Returns", icon: AlertTriangle },
  { id: "returned", label: "Returned Assets", icon: RotateCcw },
  { id: "history", label: "Allocation History", icon: History },
];

const TAB_CONTENT: Record<Tab, React.ElementType | null> = {
  active: ActiveAllocationsTab,
  transfers: TransferRequestsTab,
  approvals: PendingApprovalsTab,
  overdue: OverdueReturnsTab,
  returned: ReturnedAssetsTab,
  history: AllocationHistoryTab,
  allocate: null,
};

function AllocationsPage() {
>>>>>>> 95ccf54 (perf: optimize assets, allocations, bookings, maintenance, audit pages)
  const [view, setView] = useState<View>("tabs");
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    allocationApi
      .list()
      .then((res) => {
        const items = ((res.data ?? []) as ApiAllocation[]);
        setAllocations(
          items.map((a) => ({
            id: a.id,
            assetTag: a.asset?.assetTag ?? "",
            assetName: a.asset?.name ?? "",
            employee: a.user ? `${a.user.firstName} ${a.user.lastName}` : "",
            department: a.asset?.department?.name ?? "",
            allocatedDate: a.allocatedAt,
            expectedReturn: a.expectedReturn ?? "",
            actualReturnDate: a.returnedAt ?? null,
            status: (a.status === "RETURNED"
              ? "Returned"
              : a.status === "OVERDUE"
                ? "Overdue"
                : "Active") as "Active" | "Returned" | "Overdue" | "Due Soon",
            condition: null,
            returnNotes: a.notes ?? null,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "active", label: "Active Allocations", icon: ArrowLeftRight },
    { id: "transfers", label: "Transfer Requests", icon: ArrowRight },
    { id: "approvals", label: "Pending Approvals", icon: Clock },
    { id: "overdue", label: "Overdue Returns", icon: AlertTriangle },
    { id: "returned", label: "Returned Assets", icon: RotateCcw },
    { id: "history", label: "Allocation History", icon: History },
  ];

  const handleAllocate = useCallback(() => {
    setView("form");
  }, []);

  const handleViewTabs = useCallback(() => {
    setView("tabs");
  }, []);

  const handleSetActiveTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  const ActiveContent = view === "tabs" ? TAB_CONTENT[activeTab] : null;

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
          <Button size="sm" className="btn-enterprise" onClick={handleAllocate}>
            <Plus className="h-3.5 w-3.5" /> Allocate Asset
          </Button>
        )}
      </div>

      {/* Tabs */}
      {view === "tabs" && (
        <div className="border-b border-border">
          <nav className="flex gap-1 overflow-x-auto">
            {ALLOCATION_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSetActiveTab(t.id)}
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
      {ActiveContent && <ActiveContent />}

      {view === "form" && (
        <AllocateAssetForm
<<<<<<< HEAD
          existingAllocations={allocations}
          onSubmit={() => setView("tabs")}
          onCancel={() => setView("tabs")}
=======
          existingAllocations={MOCK_ALLOCATIONS}
          onSubmit={handleViewTabs}
          onCancel={handleViewTabs}
>>>>>>> 95ccf54 (perf: optimize assets, allocations, bookings, maintenance, audit pages)
        />
      )}
    </div>
  );
}

export default memo(AllocationsPage);
