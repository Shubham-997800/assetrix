export interface Allocation {
  id: string;
  assetTag: string;
  assetName: string;
  employee: string;
  department: string;
  allocatedDate: string;
  expectedReturn: string;
  actualReturnDate: string | null;
  status: "Active" | "Returned" | "Overdue" | "Due Soon";
  condition: string | null;
  returnNotes: string | null;
}

export interface AvailableAsset {
  id: string;
  tag: string;
  name: string;
  department: string;
  location: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
}

export const PRIORITY_CLASSES: Record<string, string> = {
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export const STATUS_CLASSES: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "Due Soon": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Overdue: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  Returned: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  Completed: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
};
