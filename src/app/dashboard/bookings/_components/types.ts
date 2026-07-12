export interface Resource {
  id: string;
  name: string;
  type: "Meeting Room" | "Equipment" | "Vehicle" | "Training Room";
  capacity: string;
  location: string;
  available: boolean;
  icon: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: Resource["type"];
  booker: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  participants: string[];
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled" | "No Show";
  reminderSent: boolean;
}

export interface BookingConflict {
  conflict: boolean;
  existingBooking?: Booking;
  suggestedSlots?: { start: string; end: string }[];
}

export const RESOURCE_TYPES = ["Meeting Room", "Equipment", "Vehicle", "Training Room"] as const;

export const STATUS_CLASSES: Record<string, string> = {
  Upcoming: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  Ongoing: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Completed: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  Cancelled: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  "No Show": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export const TYPE_ACCENT: Record<string, string> = {
  "Meeting Room": "border-l-blue-500",
  Equipment: "border-l-emerald-500",
  Vehicle: "border-l-amber-500",
  "Training Room": "border-l-violet-500",
};

export const TYPE_BADGE: Record<string, string> = {
  "Meeting Room": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Equipment: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Vehicle: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Training Room": "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};
