"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,

  User,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

/* ── Data ───────────────────────────────────────── */

type Tab = "calendar" | "upcoming" | "ongoing" | "completed" | "cancelled";

const tabs: { key: Tab; label: string; icon: React.ElementType; count?: number }[] = [
  { key: "calendar", label: "Calendar View", icon: Calendar },
  { key: "upcoming", label: "Upcoming", icon: CalendarClock, count: 4 },
  { key: "ongoing", label: "Ongoing", icon: Clock, count: 2 },
  { key: "completed", label: "Completed", icon: CheckCircle, count: 4 },
  { key: "cancelled", label: "Cancelled", icon: XCircle, count: 3 },
];

const calendarBookings: Record<number, { color: string; label: string }[]> = {
  14: [
    { color: "bg-blue-500", label: "Meeting Room" },
    { color: "bg-emerald-500", label: "Equipment" },
  ],
  15: [{ color: "bg-amber-500", label: "Vehicle" }],
  18: [
    { color: "bg-blue-500", label: "Meeting Room" },
    { color: "bg-emerald-500", label: "Equipment" },
    { color: "bg-blue-500", label: "Meeting Room" },
  ],
  21: [
    { color: "bg-amber-500", label: "Vehicle" },
    { color: "bg-blue-500", label: "Meeting Room" },
  ],
  22: [{ color: "bg-emerald-500", label: "Equipment" }],
  25: [
    { color: "bg-blue-500", label: "Meeting Room" },
    { color: "bg-amber-500", label: "Vehicle" },
  ],
};

const upcomingBookings = [
  { resource: "Meeting Room A", bookedBy: "S. Chen", date: "Jul 14", time: "10:00–12:00", duration: "2 hours", type: "meeting" as const },
  { resource: "Projector Epson", bookedBy: "K. Tanaka", date: "Jul 15", time: "14:00–16:00", duration: "2 hours", type: "equipment" as const },
  { resource: "Conference Room B", bookedBy: "M. Webb", date: "Jul 18", time: "09:00–17:00", duration: "Full day", type: "meeting" as const },
  { resource: "Toyota Hilux", bookedBy: "P. Sharma", date: "Jul 21", time: "08:00–18:00", duration: "Full day", type: "vehicle" as const },
];

const ongoingBookings = [
  { resource: "Meeting Room C", bookedBy: "A. Rivera", date: "Jul 12", time: "13:00–15:00", duration: "In progress", type: "meeting" as const },
  { resource: "CNC Machine", bookedBy: "J. Lee", date: "Jul 12", time: "08:00–17:00", duration: "In progress", type: "equipment" as const },
];

const completedBookings = [
  { resource: "Meeting Room A", bookedBy: "S. Chen", date: "Jul 10", duration: "3 hours", status: "Completed" },
  { resource: "Projector Epson", bookedBy: "M. Webb", date: "Jul 8", duration: "Full day", status: "Completed" },
  { resource: "Toyota Hilux", bookedBy: "P. Sharma", date: "Jul 7", duration: "4 hours", status: "Completed" },
  { resource: "Conference Room B", bookedBy: "K. Tanaka", date: "Jul 5", duration: "2 hours", status: "Completed" },
];

const cancelledBookings = [
  { resource: "Meeting Room C", bookedBy: "A. Rivera", date: "Jul 9", duration: "2 hours", status: "Cancelled", reason: "Scheduling conflict" },
  { resource: "CNC Machine", bookedBy: "J. Lee", date: "Jul 6", duration: "Full day", status: "Cancelled", reason: "Maintenance required" },
  { resource: "Projector Epson", bookedBy: "S. Chen", date: "Jul 3", duration: "3 hours", status: "Cancelled", reason: "Client meeting postponed" },
];

/* ── Helpers ────────────────────────────────────── */

const typeAccent: Record<string, string> = {
  meeting: "border-l-blue-500",
  equipment: "border-l-emerald-500",
  vehicle: "border-l-amber-500",
};

const typeBadge: Record<string, string> = {
  meeting: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  equipment: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  vehicle: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

/* ── Tab Content ────────────────────────────────── */

function CalendarView() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const julyDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const startsOn = 2;
  const today = 12;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">July 2026</h3>
          <p className="text-xs text-muted-foreground">Monthly resource bookings</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> Meeting Room</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Equipment</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Vehicle</span>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-3.5 w-3.5" /> New Booking
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-px rounded-lg border border-border bg-border overflow-hidden">
        {days.map((d) => (
          <div key={d} className="bg-muted px-2 py-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {Array.from({ length: startsOn }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-background p-2 min-h-[5rem]" />
        ))}
        {julyDays.map((d) => {
          const bookings = calendarBookings[d] || [];
          const isToday = d === today;
          return (
            <div
              key={d}
              className={`bg-background p-2 min-h-[5rem] transition-colors hover:bg-muted/50 ${isToday ? "ring-2 ring-inset ring-primary/30" : ""}`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                }`}
              >
                {d}
              </span>
              {bookings.length > 0 && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {bookings.map((b, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1 rounded px-1 py-0.5 ${b.color}/10`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${b.color}`} />
                      <span className="text-[10px] text-muted-foreground truncate">{b.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingBookings() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {upcomingBookings.map((b, i) => (
        <div
          key={i}
          className={`rounded-xl border border-l-4 ${typeAccent[b.type]} border-border bg-card p-5 transition-colors hover:bg-muted/30`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{b.resource}</h4>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${typeBadge[b.type]}`}>
                {b.type === "meeting" ? "Meeting Room" : b.type === "equipment" ? "Equipment" : "Vehicle"}
              </span>
            </div>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="icon-xs">
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon-xs" className="text-destructive hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> {b.bookedBy}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> {b.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> {b.time} · {b.duration}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OngoingBookings() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ongoingBookings.map((b, i) => (
        <div
          key={i}
          className={`rounded-xl border border-l-4 ${typeAccent[b.type]} border-border bg-card p-5`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{b.resource}</h4>
              <div className="mt-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeBadge[b.type]}`}>
                  {b.type === "meeting" ? "Meeting Room" : "Equipment"}
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  In progress
                </span>
              </div>
            </div>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
            </span>
          </div>
          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> {b.bookedBy}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> {b.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> {b.time}
            </div>
          </div>
          <div className="mt-4">
            <Button variant="destructive" size="sm" className="w-full">
              <XCircle className="h-3.5 w-3.5" /> End Now
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CompletedBookings() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Resource", "Booked By", "Date", "Duration", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {completedBookings.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-4 py-3.5 font-medium text-foreground">{row.resource}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.bookedBy}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.date}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.duration}</td>
                <td className="px-4 py-3.5">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CancelledBookings() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Resource", "Booked By", "Date", "Duration", "Status", "Reason"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cancelledBookings.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-4 py-3.5 font-medium text-foreground">{row.resource}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.bookedBy}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.date}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.duration}</td>
                <td className="px-4 py-3.5">
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────── */

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("calendar");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Resource Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage meeting rooms, equipment & vehicles</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> New Booking
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === t.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {t.count !== undefined && (
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "calendar" && <CalendarView />}
      {activeTab === "upcoming" && <UpcomingBookings />}
      {activeTab === "ongoing" && <OngoingBookings />}
      {activeTab === "completed" && <CompletedBookings />}
      {activeTab === "cancelled" && <CancelledBookings />}
    </div>
  );
}
