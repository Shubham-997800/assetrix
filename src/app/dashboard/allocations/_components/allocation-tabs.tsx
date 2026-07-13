"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Send,
  Eye,
  RotateCcw,
  CalendarPlus,
  ArrowRight,
  FileText,
  User,
  Building2,
  MessageSquare,
  Loader2,
} from "lucide-react";
import type {
  Allocation,
} from "./types";
import { allocationApi, ApiError } from "@/lib/api";
import type { Allocation as ApiAllocation } from "@/lib/types";
import {
  PRIORITY_CLASSES,
  STATUS_CLASSES,
} from "./types";

function mapApiAllocation(a: ApiAllocation): Allocation {
  const statusMap: Record<string, Allocation["status"]> = {
    ACTIVE: "Active",
    RETURNED: "Returned",
    TRANSFERRED: "Returned",
    OVERDUE: "Overdue",
  };
  let status = statusMap[a.status] ?? "Active";
  if (a.status === "ACTIVE" && a.expectedReturn) {
    const days = Math.ceil(
      (new Date(a.expectedReturn).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (days <= 14 && days > 0) status = "Due Soon";
  }
  return {
    id: a.id,
    assetTag: a.asset?.assetTag ?? "",
    assetName: a.asset?.name ?? "",
    employee: a.user ? `${a.user.firstName} ${a.user.lastName}` : "",
    department: a.asset?.department?.name ?? "",
    allocatedDate: a.allocatedAt,
    expectedReturn: a.expectedReturn ?? "",
    actualReturnDate: a.returnedAt ?? null,
    status,
    condition: null,
    returnNotes: a.notes ?? null,
  };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <span className="ml-2 text-sm text-destructive">{message}</span>
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/* ── Active Allocations Tab ── */
export function ActiveAllocationsTab() {
  const [search, setSearch] = useState("");
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returning, setReturning] = useState<string | null>(null);

  useEffect(() => {
    allocationApi
      .list()
      .then((res) => {
        setAllocations(((res.data ?? []) as ApiAllocation[]).map(mapApiAllocation));
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Failed to load allocations");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (id: string) => {
    setReturning(id);
    try {
      await allocationApi.return(id, { condition: "Good" });
      setAllocations((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "Returned" as const, actualReturnDate: new Date().toISOString().slice(0, 10) }
            : a
        )
      );
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Failed to return asset");
    } finally {
      setReturning(null);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const active = allocations.filter((a) => a.status !== "Returned");

  const filtered = active.filter(
    (a) =>
      a.assetTag.toLowerCase().includes(search.toLowerCase()) ||
      a.assetName.toLowerCase().includes(search.toLowerCase()) ||
      a.employee.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Active Allocations</h3>
          <p className="text-xs text-muted-foreground">{filtered.length} active allocation{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search allocations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-56"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Asset", "Holder", "Department", "Allocated", "Expected Return", "Days Left", "Status", "Actions"].map((h) => (
                <th key={h} className={`px-4 py-3 text-xs font-medium text-muted-foreground ${h === "Department" ? "hidden md:table-cell" : ""} ${h === "Allocated" ? "hidden lg:table-cell" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const days = daysUntil(a.expectedReturn);
              return (
                <tr key={a.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{a.assetName}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{a.assetTag}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{a.employee}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{a.department}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{formatDate(a.allocatedDate)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(a.expectedReturn)}</td>
                  <td className="px-4 py-3">
                    {a.status === "Overdue" ? (
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">{Math.abs(days)}d overdue</span>
                    ) : (
                      <span className={`text-xs font-medium ${days <= 7 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>{days}d</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise" title="Transfer">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise" title="Return" onClick={() => handleReturn(a.id)} disabled={returning === a.id}>
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise" title="Extend">
                        <CalendarPlus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Transfer Requests Tab ── */
export function TransferRequestsTab() {
  const [transfers, setTransfers] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    allocationApi
      .list({ status: "TRANSFERRED" })
      .then((res) => {
        setTransfers(((res.data ?? []) as ApiAllocation[]).map(mapApiAllocation));
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Failed to load transfer requests");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const workflow = [
    { label: "Requested", icon: FileText, done: true },
    { label: "Dept Head", icon: Building2, done: false },
    { label: "Asset Mgr", icon: User, done: false },
    { label: "Completed", icon: CheckCircle, done: false },
  ];

  return (
    <div className="space-y-4">
      {transfers.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">No transfer requests found.</div>
      )}
      {transfers.map((t) => (
        <div key={t.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <ArrowRight className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{t.assetName}</p>
                  <span className="font-mono text-[11px] text-muted-foreground">{t.assetTag}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Transferred to <span className="font-medium text-foreground">{t.employee}</span> ({t.department})
                </p>
                {t.returnNotes && (
                  <p className="mt-1 text-xs text-muted-foreground">{t.returnNotes}</p>
                )}

                {/* Workflow Steps */}
                <div className="mt-3 flex items-center gap-1">
                  {workflow.map((step, i) => {
                    const isDone = i === 0;
                    return (
                      <div key={step.label} className="flex items-center gap-1">
                        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          isDone ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                        }`}>
                          <step.icon className="h-3 w-3" />
                          {step.label}
                        </div>
                        {i < workflow.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/30" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES["Pending"]}`}>
                Pending
              </span>
              <span className="text-[11px] text-muted-foreground">{formatDate(t.allocatedDate)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Pending Approvals Tab ── */
export function PendingApprovalsTab() {
  const [processed, setProcessed] = useState<Record<string, string>>({});
  const [approvals, setApprovals] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    allocationApi
      .list({ status: "ACTIVE" })
      .then((res) => {
        const items = ((res.data ?? []) as ApiAllocation[]).map(mapApiAllocation);
        setApprovals(items.filter((a) => a.status === "Active" || a.status === "Due Soon"));
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Failed to load approvals");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = (id: string) => setProcessed((p) => ({ ...p, [id]: "Approved" }));
  const handleReject = (id: string) => setProcessed((p) => ({ ...p, [id]: "Rejected" }));
  const handleClarify = (id: string) => setProcessed((p) => ({ ...p, [id]: "Clarification" }));

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-4">
      {approvals.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">No pending approvals.</div>
      )}
      {approvals.map((req) => {
        const result = processed[req.id];
        return (
          <div key={req.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <RotateCcw className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{req.assetName}</p>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                      allocation
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requested by <span className="font-medium text-foreground">{req.employee}</span> · {req.department} · {formatDate(req.allocatedDate)}
                  </p>
                  {req.returnNotes && (
                    <p className="mt-1 text-xs text-muted-foreground">{req.returnNotes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {result ? (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    result === "Approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    result === "Rejected" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}>
                    {result === "Clarification" ? "Clarification Requested" : result}
                  </span>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="btn-enterprise" onClick={() => handleApprove(req.id)}>
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button variant="ghost" size="sm" className="btn-enterprise text-destructive hover:text-destructive" onClick={() => handleReject(req.id)}>
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                    <Button variant="ghost" size="sm" className="btn-enterprise" onClick={() => handleClarify(req.id)}>
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Overdue Returns Tab ── */
export function OverdueReturnsTab() {
  const [overdue, setOverdue] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    allocationApi
      .list({ status: "OVERDUE" })
      .then((res) => {
        setOverdue(((res.data ?? []) as ApiAllocation[]).map(mapApiAllocation));
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Failed to load overdue items");
      })
      .finally(() => setLoading(false));
  }, []);

  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <p className="text-sm font-medium text-foreground">
          {overdue.length} overdue return{overdue.length !== 1 ? "s" : ""} requiring attention
        </p>
      </div>
      {overdue.map((item) => {
        const daysOverdue = Math.abs(Math.ceil(
          (new Date(item.expectedReturn).getTime() - nowMs) / (1000 * 60 * 60 * 24)
        ));
        return (
          <div
            key={item.id}
            className="rounded-xl border border-red-500/30 bg-red-500/5 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.assetName}</p>
                    <span className="font-mono text-[11px] text-muted-foreground">{item.assetTag}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Allocated to <span className="font-medium text-foreground">{item.employee}</span> · {item.department}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expected return: {formatDate(item.expectedReturn)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${PRIORITY_CLASSES["critical"]}`}>
                  {daysOverdue} day{daysOverdue !== 1 ? "s" : ""} overdue · critical
                </span>
                <Button variant="outline" size="sm" className="btn-enterprise">
                  <Send className="h-3.5 w-3.5" /> Send Reminder
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      {overdue.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">No overdue returns.</div>
      )}
    </div>
  );
}

/* ── Returned Assets Tab ── */
export function ReturnedAssetsTab() {
  const [returned, setReturned] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    allocationApi
      .list({ status: "RETURNED" })
      .then((res) => {
        setReturned(((res.data ?? []) as ApiAllocation[]).map(mapApiAllocation));
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Failed to load returned assets");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">Returned Assets</h3>
        <p className="text-xs text-muted-foreground">{returned.length} returned asset{returned.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Asset", "Employee", "Department", "Allocated", "Returned", "Condition", "Notes"].map((h) => (
                <th key={h} className={`px-4 py-3 text-xs font-medium text-muted-foreground ${h === "Department" ? "hidden md:table-cell" : ""} ${h === "Allocated" ? "hidden lg:table-cell" : ""} ${h === "Notes" ? "hidden lg:table-cell" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {returned.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{a.assetName}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{a.assetTag}</p>
                </td>
                <td className="px-4 py-3 text-foreground">{a.employee}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{a.department}</td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{formatDate(a.allocatedDate)}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.actualReturnDate ? formatDate(a.actualReturnDate) : "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {a.condition ?? "—"}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">{a.returnNotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Allocation History Tab ── */
export function AllocationHistoryTab() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    allocationApi
      .list()
      .then((res) => {
        setEvents(((res.data ?? []) as ApiAllocation[]).map(mapApiAllocation));
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Failed to load history");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const filtered = events.filter(
    (e) =>
      e.assetName.toLowerCase().includes(search.toLowerCase()) ||
      e.assetTag.toLowerCase().includes(search.toLowerCase()) ||
      e.employee.toLowerCase().includes(search.toLowerCase())
  );

  const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    Active: { icon: User, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10" },
    Returned: { icon: RotateCcw, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
    Overdue: { icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    "Due Soon": { icon: CalendarPlus, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} events</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-0">
          {filtered.map((event, idx) => {
            const cfg = typeConfig[event.status] ?? typeConfig.Active;
            const Icon = cfg.icon;
            const isLast = idx === filtered.length - 1;
            return (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <div className={`flex-1 ${isLast ? "" : "pb-6"}`}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground capitalize">
                      {event.status === "Returned"
                        ? `Returned by ${event.employee}`
                        : `Allocated to ${event.employee}`}
                    </p>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASSES[event.status]}`}>
                      {event.status.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {event.assetName} ({event.assetTag}) · {event.department}
                  </p>
                  {event.returnNotes && (
                    <p className="mt-1 text-xs text-muted-foreground italic">&ldquo;{event.returnNotes}&rdquo;</p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground/70">
                    <span>{formatDate(event.allocatedDate)}</span>
                    <span>·</span>
                    <span>{event.employee}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
