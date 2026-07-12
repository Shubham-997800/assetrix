"use client";

import { useState, useMemo } from "react";
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
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { TableDropdown } from "@/app/dashboard/assets/_components/table-dropdown";
import {
  STATUS_CLASSES,
  PRIORITY_CLASSES,
  ISSUE_CATEGORIES,
  type MaintenanceRequest,
  type RequestStatus,
  type Priority,
} from "./types";
import { MOCK_REQUESTS, MOCK_TIMELINE } from "./data";

const ITEMS_PER_PAGE = 10;

const ALL_STATUSES: RequestStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Technician Assigned",
  "In Progress",
  "Resolved",
];

const inputCls =
  "h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

export function MaintenanceTabs() {
  const [activeTab, setActiveTab] = useState<RequestStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [actionPanel, setActionPanel] = useState<"approve" | "reject" | "assign" | "resolve" | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_REQUESTS);

  const filtered = useMemo(() => {
    let items = [...requests];
    if (activeTab !== "All") items = items.filter((r) => r.status === activeTab);
    if (statusFilter !== "All") items = items.filter((r) => r.status === statusFilter);
    if (priorityFilter !== "All") items = items.filter((r) => r.priority === priorityFilter);
    if (categoryFilter !== "All") items = items.filter((r) => r.category === categoryFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.issueTitle.toLowerCase().includes(s) ||
          r.id.toLowerCase().includes(s) ||
          r.assetTag.toLowerCase().includes(s) ||
          r.assetName.toLowerCase().includes(s) ||
          r.reportedBy.toLowerCase().includes(s)
      );
    }
    return items;
  }, [requests, activeTab, statusFilter, priorityFilter, categoryFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleApprove = () => {
    if (!selectedRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "Approved" as RequestStatus,
              approvedAt: new Date().toISOString(),
              approvedBy: "Asset Manager",
            }
          : r
      )
    );
    setSelectedRequest(null);
    setActionPanel(null);
    setActionNote("");
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "Rejected" as RequestStatus,
              rejectionReason: actionNote || "Rejected",
            }
          : r
      )
    );
    setSelectedRequest(null);
    setActionPanel(null);
    setActionNote("");
  };

  const handleAssign = () => {
    if (!selectedRequest || !actionNote.trim()) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "Technician Assigned" as RequestStatus,
              technician: actionNote,
              technicianAssignedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setSelectedRequest(null);
    setActionPanel(null);
    setActionNote("");
  };

  const handleResolve = () => {
    if (!selectedRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "Resolved" as RequestStatus,
              resolvedAt: new Date().toISOString(),
              resolutionSummary: actionNote || "Resolved",
              progress: "Completed",
            }
          : r
      )
    );
    setSelectedRequest(null);
    setActionPanel(null);
    setActionNote("");
  };

  const badgeStyle = (status: RequestStatus) => `${STATUS_CLASSES[status]} border inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap`;
  const priorityBadge = (p: Priority) => `${PRIORITY_CLASSES[p]} border inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap`;

  if (selectedRequest) {
    const req = requests.find((r) => r.id === selectedRequest.id) || selectedRequest;
    return (
      <SelectedRequestView
        request={req}
        actionPanel={actionPanel}
        actionNote={actionNote}
        setActionNote={setActionNote}
        onApprove={() => setActionPanel("approve")}
        onReject={() => setActionPanel("reject")}
        onAssign={() => setActionPanel("assign")}
        onResolve={() => setActionPanel("resolve")}
        onConfirmApprove={handleApprove}
        onConfirmReject={handleReject}
        onConfirmAssign={handleAssign}
        onConfirmResolve={handleResolve}
        onCancelAction={() => { setActionPanel(null); setActionNote(""); }}
        onBack={() => { setSelectedRequest(null); setActionPanel(null); setActionNote(""); }}
      />
    );
  }

  const tabs: (RequestStatus | "All")[] = ["All", "Pending", "Approved", "Rejected", "Technician Assigned", "In Progress", "Resolved"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/20 p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === tab
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className={`${inputCls} pl-9`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <TableDropdown label="" options={ALL_STATUSES.map((s) => ({ label: s, value: s }))} value={statusFilter} onChange={(v) => { setStatusFilter(v as RequestStatus | "All"); setPage(1); }} placeholder="All Statuses" />
          <TableDropdown label="" options={["Low", "Medium", "High", "Critical"].map((p) => ({ label: p, value: p }))} value={priorityFilter} onChange={(v) => { setPriorityFilter(v as Priority | "All"); setPage(1); }} placeholder="All Priorities" />
          <TableDropdown label="" options={ISSUE_CATEGORIES.map((c) => ({ label: c, value: c }))} value={categoryFilter} onChange={(v) => { setCategoryFilter(v); setPage(1); }} placeholder="All Categories" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Request</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Asset</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Priority</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Technician</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Created</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  No maintenance requests found
                </TableCell>
              </TableRow>
            ) : (
              paged.map((req) => (
                <TableRow key={req.id} className="border-border hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{req.issueTitle}</p>
                      <p className="text-[11px] text-muted-foreground">{req.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs text-foreground">{req.assetName}</p>
                      <p className="text-[11px] text-muted-foreground">{req.assetTag}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={priorityBadge(req.priority)}>{req.priority}</span>
                  </TableCell>
                  <TableCell>
                    <span className={badgeStyle(req.status)}>{req.status}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-foreground">{req.technician || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{req.createdAt.split("T")[0]}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary/80" onClick={() => setSelectedRequest(req)}>
                      <Eye className="h-3 w-3" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-foreground">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" className="btn-enterprise h-7 w-7 p-0" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface SelectedRequestViewProps {
  request: MaintenanceRequest;
  actionPanel: "approve" | "reject" | "assign" | "resolve" | null;
  actionNote: string;
  setActionNote: (v: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onAssign: () => void;
  onResolve: () => void;
  onConfirmApprove: () => void;
  onConfirmReject: () => void;
  onConfirmAssign: () => void;
  onConfirmResolve: () => void;
  onCancelAction: () => void;
  onBack: () => void;
}

function SelectedRequestView({
  request,
  actionPanel,
  actionNote,
  setActionNote,
  onApprove,
  onReject,
  onAssign,
  onResolve,
  onConfirmApprove,
  onConfirmReject,
  onConfirmAssign,
  onConfirmResolve,
  onCancelAction,
  onBack,
}: SelectedRequestViewProps) {
  const [subTab, setSubTab] = useState<"overview" | "history">("overview");
  const timeline = MOCK_TIMELINE[request.id] || [];

  const badgeStyle = (status: RequestStatus) => `${STATUS_CLASSES[status]} border inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap`;

  const getActionButtons = () => {
    switch (request.status) {
      case "Pending":
        return (
          <div className="flex gap-2">
            <Button size="sm" className="btn-enterprise bg-emerald-600 hover:bg-emerald-700" onClick={onApprove}>
              <ThumbsUp className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button size="sm" variant="outline" className="btn-enterprise border-destructive/30 text-destructive hover:bg-destructive/10" onClick={onReject}>
              <ThumbsDown className="h-3.5 w-3.5" /> Reject
            </Button>
          </div>
        );
      case "Approved":
        return (
          <Button size="sm" className="btn-enterprise" onClick={onAssign}>
            <User className="h-3.5 w-3.5" /> Assign Technician
          </Button>
        );
      case "Technician Assigned":
      case "In Progress":
        return (
          <Button size="sm" className="btn-enterprise bg-emerald-600 hover:bg-emerald-700" onClick={onResolve}>
            <CheckCircle className="h-3.5 w-3.5" /> Mark Resolved
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="btn-enterprise gap-1.5" onClick={onBack}>
          <ChevronLeft className="h-3.5 w-3.5" /> Back to List
        </Button>
        <div className="flex items-center gap-2">{getActionButtons()}</div>
      </div>

      {actionPanel && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            {actionPanel === "approve" && <ThumbsUp className="h-4 w-4 text-emerald-500" />}
            {actionPanel === "reject" && <ThumbsDown className="h-4 w-4 text-destructive" />}
            {actionPanel === "assign" && <User className="h-4 w-4 text-primary" />}
            {actionPanel === "resolve" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
            <span className="text-sm font-medium text-foreground">
              {actionPanel === "approve" && "Approve Request"}
              {actionPanel === "reject" && "Reject Request"}
              {actionPanel === "assign" && "Assign Technician"}
              {actionPanel === "resolve" && "Mark as Resolved"}
            </span>
          </div>
          {actionPanel === "assign" ? (
            <input className={inputCls} placeholder="Technician name..." value={actionNote} onChange={(e) => setActionNote(e.target.value)} />
          ) : (
            <textarea className={`${inputCls} resize-none`} rows={3} placeholder={actionPanel === "resolve" ? "Resolution notes..." : "Add a note..."} value={actionNote} onChange={(e) => setActionNote(e.target.value)} />
          )}
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="btn-enterprise" onClick={
              actionPanel === "approve" ? onConfirmApprove :
              actionPanel === "reject" ? onConfirmReject :
              actionPanel === "assign" ? onConfirmAssign :
              onConfirmResolve
            }>Confirm</Button>
            <Button size="sm" variant="outline" className="btn-enterprise" onClick={onCancelAction}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{request.issueTitle}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{request.id}</p>
          </div>
          <span className={badgeStyle(request.status)}>{request.status}</span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{request.issueDescription}</p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoBlock icon={<Wrench className="h-3.5 w-3.5" />} label="Issue Category" value={request.category} />
          <InfoBlock icon={<AlertCircle className="h-3.5 w-3.5" />} label="Priority" value={request.priority} />
          <InfoBlock icon={<User className="h-3.5 w-3.5" />} label="Reported By" value={request.reportedBy} />
          <InfoBlock icon={<Calendar className="h-3.5 w-3.5" />} label="Created" value={request.createdAt.split("T")[0]} />
          <InfoBlock icon={<Wrench className="h-3.5 w-3.5" />} label="Asset" value={`${request.assetName} (${request.assetTag})`} />
          <InfoBlock icon={<Clock className="h-3.5 w-3.5" />} label="Approved At" value={request.approvedAt?.split("T")[0] || "Pending"} />
          <InfoBlock icon={<User className="h-3.5 w-3.5" />} label="Technician" value={request.technician || "Unassigned"} />
          <InfoBlock icon={<CheckCircle className="h-3.5 w-3.5" />} label="Resolved" value={request.resolvedAt?.split("T")[0] || "—"} />
        </div>
        {request.attachments.length > 0 && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Attachments</p>
            <div className="flex flex-wrap gap-2">
              {request.attachments.map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-foreground">
                  <Paperclip className="h-3 w-3 text-muted-foreground" /> {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex rounded-lg border border-border bg-muted/20 p-1 gap-1">
        <button onClick={() => setSubTab("overview")} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${subTab === "overview" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}>
          Workflow Progress
        </button>
        <button onClick={() => setSubTab("history")} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${subTab === "history" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}>
          Timeline History
        </button>
      </div>

      {subTab === "overview" ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <WorkflowProgress status={request.status} />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">Timeline History</h4>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">No timeline events recorded</p>
          ) : (
            <div className="space-y-4">
              {timeline.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1" />
                    {i < timeline.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.date.split("T")[0]} — {event.user}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-muted-foreground/50">{icon}</div>
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

const workflowSteps: { key: string; label: string; statuses: RequestStatus[] }[] = [
  { key: "pending", label: "Submitted", statuses: ["Pending", "Approved", "Rejected", "Technician Assigned", "In Progress", "Resolved"] },
  { key: "approved", label: "Approved", statuses: ["Approved", "Technician Assigned", "In Progress", "Resolved"] },
  { key: "assigned", label: "Technician Assigned", statuses: ["Technician Assigned", "In Progress", "Resolved"] },
  { key: "inprogress", label: "In Progress", statuses: ["In Progress", "Resolved"] },
  { key: "resolved", label: "Resolved", statuses: ["Resolved"] },
];

function WorkflowProgress({ status }: { status: RequestStatus }) {
  const currentIdx = workflowSteps.findIndex((s) => s.statuses.includes(status));
  const isRejected = status === "Rejected";

  return (
    <div className="space-y-4">
      {isRejected && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          <XCircle className="h-4 w-4" /> This request was rejected
        </div>
      )}
      <div className="flex items-center gap-1">
        {workflowSteps.map((step, i) => {
          const isComplete = currentIdx >= i;
          const isCurrent = currentIdx === i;
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-all ${
                    isComplete
                      ? isRejected
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground"
                  } ${isCurrent ? "ring-2 ring-primary/20" : ""}`}
                >
                  {isComplete ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`mt-1.5 text-[10px] text-center leading-tight ${isComplete ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
              {i < workflowSteps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 rounded-full ${currentIdx > i ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
