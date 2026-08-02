export type Priority = "Low" | "Medium" | "High" | "Critical";
export type IssueCategory = "Hardware Failure" | "Physical Damage" | "Software Issue" | "Performance Issue" | "Electrical Issue" | "Other";
export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Technician Assigned" | "In Progress" | "Resolved";
export type RepairProgress = "Diagnosis" | "Parts Ordered" | "Repair Started" | "Testing" | "Final Verification" | "Completed";

export interface MaintenanceRequest {
  id: string;
  assetTag: string;
  assetName: string;
  reportedBy: string;
  department: string;
  issueTitle: string;
  issueDescription: string;
  priority: Priority;
  category: IssueCategory;
  status: RequestStatus;
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectionReason: string | null;
  technician: string | null;
  technicianAssignedAt: string | null;
  estimatedCompletion: string | null;
  repairNotes: string | null;
  spareParts: string | null;
  progress: RepairProgress | null;
  workStartedAt: string | null;
  resolvedAt: string | null;
  resolutionSummary: string | null;
  finalNotes: string | null;
  repairCost: number | null;
  conditionAfter: string | null;
  attachments: string[];
}

export interface MaintenanceTimelineEvent {
  id: string;
  type: "reported" | "approved" | "rejected" | "technician_assigned" | "progress_update" | "resolved" | "available";
  title: string;
  description: string;
  date: string;
  user: string;
}

export const PRIORITY_CLASSES: Record<Priority, string> = {
  Low: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  Medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  High: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export const STATUS_CLASSES: Record<RequestStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  "Technician Assigned": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "In Progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Resolved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

export const PROGRESS_STEPS: RepairProgress[] = ["Diagnosis", "Parts Ordered", "Repair Started", "Testing", "Final Verification", "Completed"];

export const ISSUE_CATEGORIES: IssueCategory[] = [
  "Hardware Failure",
  "Physical Damage",
  "Software Issue",
  "Performance Issue",
  "Electrical Issue",
  "Other",
];
