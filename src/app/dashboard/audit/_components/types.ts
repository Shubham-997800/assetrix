export type AuditStatus = "Draft" | "Active" | "Review" | "Completed" | "Closed" | "Cancelled";
export type VerificationResult = "Verified" | "Missing" | "Damaged" | "Incorrect Location" | "Incorrect Holder" | null;
export type DiscrepancyType = "Missing" | "Damaged" | "Incorrect Location" | "Incorrect Holder";
export type DiscrepancyStatus = "Open" | "Acknowledged" | "Resolved" | "Closed";

export interface AuditCycle {
  id: string;
  name: string;
  departmentScope: string;
  locationScope: string;
  startDate: string;
  endDate: string;
  status: AuditStatus;
  totalAssets: number;
  verifiedCount: number;
  discrepanciesCount: number;
  createdBy: string;
  notes: string;
}

export interface AuditAsset {
  id: string;
  cycleId: string;
  assetTag: string;
  assetName: string;
  currentLocation: string;
  recordedHolder: string;
  department: string;
  assignedAuditor: string;
  result: VerificationResult;
  verifiedAt: string | null;
  notes: string;
}

export interface Auditor {
  name: string;
  department: string;
  assignedCount: number;
}

export interface Discrepancy {
  id: string;
  cycleId: string;
  cycleName: string;
  assetTag: string;
  assetName: string;
  type: DiscrepancyType;
  currentLocation: string;
  recordedHolder: string;
  department: string;
  reportedBy: string;
  reportedAt: string;
  recommendedAction: string;
  status: DiscrepancyStatus;
  resolvedAt: string | null;
}

export const AUDIT_STATUS_CLASSES: Record<AuditStatus, string> = {
  Draft: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  Active: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  Review: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Closed: "bg-muted text-muted-foreground border-border",
  Cancelled: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

export const AUDIT_STATUS_MAP: Record<string, AuditStatus> = {
  DRAFT: "Draft",
  IN_PROGRESS: "Active",
  REVIEW: "Review",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend cycle shape is loosely typed
export function mapAuditCycle(cycle: any): AuditCycle {
  const creator = cycle?.createdBy;
  const createdBy =
    typeof creator === "string"
      ? creator
      : creator && typeof creator === "object"
        ? [creator.firstName, creator.lastName].filter(Boolean).join(" ") || "Unknown"
        : "Unknown";
  return {
    ...cycle,
    status: AUDIT_STATUS_MAP[cycle?.status] ?? cycle?.status ?? "Draft",
    createdBy,
  };
}

export const DISCREPANCY_STATUS_CLASSES: Record<DiscrepancyStatus, string> = {
  Open: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  Acknowledged: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Resolved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Closed: "bg-muted text-muted-foreground border-border",
};

