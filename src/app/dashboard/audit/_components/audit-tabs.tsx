"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  ClipboardCheck,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
} from "lucide-react";
import { TableDropdown } from "@/app/dashboard/assets/_components/table-dropdown";
import {
  AUDIT_STATUS_CLASSES,
  DISCREPANCY_STATUS_CLASSES,
  type AuditCycle,
  type AuditAsset,
  type Discrepancy,
  type DiscrepancyStatus,
  type AuditStatus,
} from "./types";
import {
  MOCK_AUDIT_ASSETS,
  MOCK_DISCREPANCIES,
} from "./data";
import { auditApi } from "@/lib/api";
import type { ApiError } from "@/lib/api";

const ITEMS_PER_PAGE = 10;
const inputCls =
  "h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type AuditTab = "cycles" | "create-cycle" | "assign-auditors" | "verification" | "discrepancies" | "close-cycle" | "history";

interface AuditTabsProps {
  initialCycles: AuditCycle[];
  onRefresh: () => void;
}

export function AuditTabs({ initialCycles, onRefresh }: AuditTabsProps) {
  const [activeTab, setActiveTab] = useState<AuditTab>("cycles");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<AuditAsset | null>(null);
  const [cycles, setCycles] = useState<AuditCycle[]>(initialCycles);
  const [assets] = useState<AuditAsset[]>(MOCK_AUDIT_ASSETS);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>(MOCK_DISCREPANCIES);

  useEffect(() => {
    setCycles(initialCycles);
  }, [initialCycles]);

  const tabs: { key: AuditTab; label: string; icon: React.ReactNode }[] = [
    { key: "cycles", label: "Audit Cycles", icon: <ClipboardCheck className="h-3.5 w-3.5" /> },
    { key: "create-cycle", label: "Create Cycle", icon: <Calendar className="h-3.5 w-3.5" /> },
    { key: "assign-auditors", label: "Assign Auditors", icon: <Users className="h-3.5 w-3.5" /> },
    { key: "verification", label: "Verification", icon: <Eye className="h-3.5 w-3.5" /> },
    { key: "discrepancies", label: "Discrepancy Reports", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    { key: "close-cycle", label: "Close Cycle", icon: <CheckCircle className="h-3.5 w-3.5" /> },
    { key: "history", label: "History", icon: <FileText className="h-3.5 w-3.5" /> },
  ];

  const filteredCycles = useMemo(() => {
    let items = [...cycles];
    if (statusFilter !== "All") items = items.filter((c) => c.status === statusFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.id.toLowerCase().includes(s) ||
          c.departmentScope.toLowerCase().includes(s)
      );
    }
    return items;
  }, [cycles, statusFilter, search]);

  const filteredAssets = useMemo(() => {
    let items = [...assets];
    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(
        (a) =>
          a.assetName.toLowerCase().includes(s) ||
          a.assetTag.toLowerCase().includes(s) ||
          a.assignedAuditor.toLowerCase().includes(s)
      );
    }
    return items;
  }, [assets, search]);

  const filteredDiscrepancies = useMemo(() => {
    let items = [...discrepancies];
    if (statusFilter !== "All") items = items.filter((d) => d.status === statusFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(
        (d) =>
          d.assetName.toLowerCase().includes(s) ||
          d.assetTag.toLowerCase().includes(s) ||
          d.type.toLowerCase().includes(s)
      );
    }
    return items;
  }, [discrepancies, statusFilter, search]);

  const totalPages = (items: unknown[]) => Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const paged = <T,>(items: T[]) => items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const badgeStyle = (status: string) => {
    const classes = DISCREPANCY_STATUS_CLASSES[status as DiscrepancyStatus] || AUDIT_STATUS_CLASSES[status as AuditStatus] || "";
    return `${classes} border inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap`;
  };

  const handleResolveDiscrepancy = (discId: string) => {
    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.id === discId
          ? { ...d, status: "Resolved" as DiscrepancyStatus, resolvedAt: new Date().toISOString() }
          : d
      )
    );
  };

  const handleCloseCycle = (cycleId: string) => {
    setCycles((prev) =>
      prev.map((c) =>
        c.id === cycleId
          ? { ...c, status: "Closed" as AuditStatus }
          : c
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/20 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); setSearch(""); setStatusFilter("All"); }}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== "create-cycle" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${inputCls} pl-9`} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <TableDropdown
              label=""
              options={["Draft", "Active", "Completed", "Closed", "Open", "Acknowledged", "Resolved"].map((s) => ({ label: s, value: s }))}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              placeholder="All Statuses"
            />
          </div>
        </div>
      )}

      {activeTab === "cycles" && (
        <CyclesTab
          cycles={paged(filteredCycles)}
          total={filteredCycles.length}
          page={page}
          totalPages={totalPages(filteredCycles)}
          setPage={setPage}
          badgeStyle={badgeStyle}
          onSelectCycle={() => {}}
          startCycle={(id) => setCycles((prev) => prev.map((c) => c.id === id ? { ...c, status: "Active" as AuditStatus } : c))}
        />
      )}

      {activeTab === "create-cycle" && (
        <CreateCycleTab onSubmit={() => setActiveTab("cycles")} onRefresh={onRefresh} />
      )}

      {activeTab === "assign-auditors" && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">Auditor assignment is managed through the cycle detail view</p>
        </div>
      )}

      {activeTab === "verification" && (
        <VerificationTab
          assets={paged(filteredAssets)}
          total={filteredAssets.length}
          page={page}
          totalPages={totalPages(filteredAssets)}
          setPage={setPage}
          selectedAsset={selectedAsset ? filteredAssets.find((a) => a.id === selectedAsset.id) || null : null}
          onSelectAsset={setSelectedAsset}
        />
      )}

      {activeTab === "discrepancies" && (
        <DiscrepanciesTab
          discrepancies={paged(filteredDiscrepancies)}
          total={filteredDiscrepancies.length}
          page={page}
          totalPages={totalPages(filteredDiscrepancies)}
          setPage={setPage}
          badgeStyle={badgeStyle}
          onResolve={handleResolveDiscrepancy}
        />
      )}

      {activeTab === "close-cycle" && (
        <CloseCycleTab
          cycles={cycles.filter((c) => c.status === "Active" || c.status === "Completed")}
          onClose={handleCloseCycle}
        />
      )}

      {activeTab === "history" && (
        <HistoryTab cycles={cycles.filter((c) => c.status === "Closed" || c.status === "Completed")} />
      )}
    </div>
  );
}

function CyclesTab({ cycles, total, page, totalPages, setPage, badgeStyle, onSelectCycle, startCycle }: {
  cycles: AuditCycle[];
  total: number;
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  badgeStyle: (s: string) => string;
  onSelectCycle: (c: AuditCycle) => void;
  startCycle: (id: string) => void;
}) {
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Cycle</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Scope</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Period</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Progress</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cycles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">No audit cycles found</TableCell>
              </TableRow>
            ) : (
              cycles.map((cycle) => (
                <TableRow key={cycle.id} className="border-border hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{cycle.name}</p>
                      <p className="text-[11px] text-muted-foreground">{cycle.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs text-foreground">{cycle.departmentScope}</p>
                      <p className="text-[11px] text-muted-foreground">{cycle.locationScope}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{cycle.startDate} — {cycle.endDate}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${cycle.totalAssets > 0 ? (cycle.verifiedCount / cycle.totalAssets) * 100 : 0}%` }} />
                      </div>
                      <span className="text-[11px] text-muted-foreground">{cycle.verifiedCount}/{cycle.totalAssets}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={badgeStyle(cycle.status)}>{cycle.status}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary/80" onClick={() => onSelectCycle(cycle)}>
                        <Eye className="h-3 w-3" /> View
                      </Button>
                      {cycle.status === "Draft" && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-500 hover:text-emerald-600" onClick={() => startCycle(cycle.id)}>
                          Start
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
    </>
  );
}

function CreateCycleTab({ onSubmit, onRefresh }: { onSubmit: () => void; onRefresh: () => void }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim() || !department || !location) return;
    try {
      setSubmitting(true);
      setError(null);
      await auditApi.createCycle({
        name,
        departmentScope: department,
        locationScope: location,
        notes,
      });
      onRefresh();
      onSubmit();
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to create cycle");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 max-w-2xl">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" /> Create New Audit Cycle
      </h3>
      <div className="mt-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground">Cycle Name *</label>
          <input className={`${inputCls} mt-1.5 w-full`} placeholder="e.g. Q3 2026 IT Asset Audit" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-foreground">Department Scope *</label>
            <TableDropdown label="" options={["Engineering", "Finance", "HR", "Marketing", "Operations", "Procurement", "Sales", "IT"].map((d) => ({ label: d, value: d }))} value={department} onChange={setDepartment} placeholder="Select department" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Location Scope *</label>
            <TableDropdown label="" options={["Floor 1, Board Room", "Floor 2, Wing A", "Floor 2, Wing B", "Floor 3, Wing A", "Floor 3, Wing B", "Production Floor, Bay 7", "Warehouse A", "Server Room, Rack 4"].map((l) => ({ label: l, value: l }))} value={location} onChange={setLocation} placeholder="Select location" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-foreground">Notes</label>
          <textarea className={`${inputCls} mt-1.5 w-full resize-none`} rows={3} placeholder="Additional instructions or scope..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      <div className="mt-5 flex gap-2 border-t border-border pt-4">
        <Button size="default" className="btn-enterprise" onClick={handleCreate} disabled={submitting || !name.trim() || !department || !location}>
          {submitting ? "Creating..." : "Create Cycle"}
        </Button>
        <Button variant="outline" size="default" className="btn-enterprise" onClick={onSubmit} disabled={submitting}>Cancel</Button>
      </div>
    </div>
  );
}

function VerificationTab({ assets, total, page, totalPages, setPage, selectedAsset, onSelectAsset }: {
  assets: AuditAsset[];
  total: number;
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  selectedAsset: AuditAsset | null;
  onSelectAsset: (a: AuditAsset | null) => void;
}) {
  if (selectedAsset) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="btn-enterprise gap-1.5" onClick={() => onSelectAsset(null)}>
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </Button>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{selectedAsset.assetName}</h3>
              <p className="text-sm text-muted-foreground">{selectedAsset.assetTag}</p>
            </div>
            <span className={selectedAsset.result ? AUDIT_STATUS_CLASSES.Active : ""}>
              {selectedAsset.result || "Pending Verification"}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <InfoItem label="Department" value={selectedAsset.department} />
            <InfoItem label="Current Location" value={selectedAsset.currentLocation} />
            <InfoItem label="Recorded Holder" value={selectedAsset.recordedHolder} />
            <InfoItem label="Assigned Auditor" value={selectedAsset.assignedAuditor} />
            <InfoItem label="Verification Result" value={selectedAsset.result || "Pending"} />
            <InfoItem label="Verified At" value={selectedAsset.verifiedAt?.split("T")[0] || "—"} />
            {selectedAsset.notes && (
              <div className="sm:col-span-2">
                <InfoItem label="Notes" value={selectedAsset.notes} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Asset</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Location</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Auditor</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Result</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">No assets assigned</TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id} className="border-border hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{asset.assetName}</p>
                      <p className="text-[11px] text-muted-foreground">{asset.assetTag}</p>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-xs text-foreground">{asset.currentLocation}</span></TableCell>
                  <TableCell><span className="text-xs text-foreground">{asset.assignedAuditor}</span></TableCell>
                  <TableCell>
                    <span className={asset.result ? AUDIT_STATUS_CLASSES.Active : "text-xs text-muted-foreground"}>
                      {asset.result || "Pending"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary/80" onClick={() => onSelectAsset(asset)}>
                      <Eye className="h-3 w-3" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
    </>
  );
}

function DiscrepanciesTab({ discrepancies, total, page, totalPages, setPage, badgeStyle, onResolve }: {
  discrepancies: Discrepancy[];
  total: number;
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  badgeStyle: (s: string) => string;
  onResolve: (id: string) => void;
}) {
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Asset</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Cycle</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Reported By</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discrepancies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">No discrepancy reports</TableCell>
              </TableRow>
            ) : (
              discrepancies.map((d) => (
                <TableRow key={d.id} className="border-border hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.assetName}</p>
                      <p className="text-[11px] text-muted-foreground">{d.assetTag}</p>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-xs text-foreground">{d.type}</span></TableCell>
                  <TableCell><span className="text-xs text-muted-foreground">{d.cycleName}</span></TableCell>
                  <TableCell><span className="text-xs text-foreground">{d.reportedBy}</span></TableCell>
                  <TableCell><span className={badgeStyle(d.status)}>{d.status}</span></TableCell>
                  <TableCell>
                    {d.status !== "Resolved" && d.status !== "Closed" && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-500 hover:text-emerald-600" onClick={() => onResolve(d.id)}>
                        Resolve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />}
    </>
  );
}

function CloseCycleTab({ cycles, onClose }: { cycles: AuditCycle[]; onClose: (id: string) => void }) {
  if (cycles.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <CheckCircle className="mx-auto h-8 w-8 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">No cycles available to close</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cycles.map((cycle) => (
        <div key={cycle.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{cycle.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{cycle.departmentScope} — {cycle.startDate} to {cycle.endDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="text-sm font-medium text-foreground">{cycle.verifiedCount}/{cycle.totalAssets} verified</p>
              </div>
              <Button size="sm" className="btn-enterprise min-h-[44px]" onClick={() => onClose(cycle.id)}>
                <CheckCircle className="h-3.5 w-3.5" /> Close Cycle
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab({ cycles }: { cycles: AuditCycle[] }) {
  const [selectedCycle, setSelectedCycle] = useState<AuditCycle | null>(null);

  if (selectedCycle) {
    const cycle = cycles.find((c) => c.id === selectedCycle.id) || selectedCycle;
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="btn-enterprise gap-1.5" onClick={() => setSelectedCycle(null)}>
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </Button>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">{cycle.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{cycle.id} — {cycle.departmentScope}</p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <InfoItem label="Location Scope" value={cycle.locationScope} />
            <InfoItem label="Created By" value={cycle.createdBy} />
            <InfoItem label="Period" value={`${cycle.startDate} to ${cycle.endDate}`} />
            <InfoItem label="Total Assets" value={`${cycle.totalAssets}`} />
            <InfoItem label="Verified" value={`${cycle.verifiedCount}`} />
            <InfoItem label="Discrepancies" value={`${cycle.discrepanciesCount}`} />
            {cycle.notes && (
              <div className="sm:col-span-2">
                <InfoItem label="Notes" value={cycle.notes} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cycles.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">No completed or closed cycles</p>
        </div>
      ) : (
        cycles.map((cycle) => (
          <div key={cycle.id} className="rounded-xl border border-border bg-card p-5 hover:bg-muted/10 cursor-pointer transition-colors" onClick={() => setSelectedCycle(cycle)}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{cycle.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{cycle.departmentScope} — {cycle.startDate} to {cycle.endDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Verified</p>
                  <p className="text-sm font-medium text-foreground">{cycle.verifiedCount}/{cycle.totalAssets}</p>
                </div>
                <span className={AUDIT_STATUS_CLASSES[cycle.status]}>
                  {cycle.status}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Pagination({ page, totalPages, total, setPage }: { page: number; totalPages: number; total: number; setPage: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <span className="text-xs text-muted-foreground">
        Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, total)} of {total}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs text-foreground">{page} / {totalPages}</span>
        <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
