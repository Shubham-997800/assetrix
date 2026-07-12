"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  AlertTriangle,
  Building,
  Monitor,
  Car,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
} from "lucide-react";
import { RESOURCES, MOCK_BOOKINGS, TIME_SLOTS } from "./data";
import type { Resource, Booking, BookingConflict } from "./types";
import { STATUS_CLASSES, TYPE_ACCENT, TYPE_BADGE } from "./types";
import { TableDropdown } from "@/app/dashboard/assets/_components/table-dropdown";
import { DEPARTMENTS } from "./data";

/* ── Helpers ── */

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  Building,
  Monitor,
  Car,
  GraduationCap,
};

/* ═══════════════════════════════════════════════
   RESOURCE DIRECTORY
   ═══════════════════════════════════════════════ */

export function ResourceDirectoryTab() {
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");

  const filtered = RESOURCES.filter((r) => {
    if (filterType && r.type !== filterType) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = useMemo(() => {
    const map: Record<string, Resource[]> = {};
    filtered.forEach((r) => {
      if (!map[r.type]) map[r.type] = [];
      map[r.type].push(r);
    });
    return Object.entries(map);
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <TableDropdown
          options={[
            { label: "All Types", value: "" },
            { label: "Meeting Room", value: "Meeting Room" },
            { label: "Equipment", value: "Equipment" },
            { label: "Vehicle", value: "Vehicle" },
            { label: "Training Room", value: "Training Room" },
          ]}
          value={filterType}
          onChange={setFilterType}
          placeholder="All Types"
          className="w-40"
        />
      </div>

      {grouped.map(([type, resources]) => (
        <div key={type}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            {type}s
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => {
              const Icon = RESOURCE_ICONS[r.icon] ?? Building;
              return (
                <div
                  key={r.id}
                  className={`rounded-xl border-l-4 ${TYPE_ACCENT[r.type]} border border-border bg-card p-5 transition-colors hover:bg-muted/30`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{r.name}</p>
                        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_BADGE[r.type]}`}>
                          {r.type}
                        </span>
                      </div>
                    </div>
                    <span className={`h-2.5 w-2.5 rounded-full ${r.available ? "bg-emerald-500" : "bg-red-500"}`} />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {r.capacity}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.location}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs font-medium ${r.available ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {r.available ? "Available" : "In Use"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CALENDAR VIEW
   ═══════════════════════════════════════════════ */

export function CalendarViewTab() {
  const [month, setMonth] = useState(6); // July
  const [year, setYear] = useState(2026);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startsOn = new Date(year, month, 1).getDay();
  const today = 12;

  const bookingsByDay = useMemo(() => {
    const map: Record<number, Booking[]> = {};
    MOCK_BOOKINGS.forEach((b) => {
      const d = new Date(b.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(b);
      }
    });
    return map;
  }, [month, year]);

  const TYPE_COLORS: Record<string, string> = {
    "Meeting Room": "bg-blue-500",
    Equipment: "bg-emerald-500",
    Vehicle: "bg-amber-500",
    "Training Room": "bg-violet-500",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{monthName}</h3>
          <p className="text-xs text-muted-foreground">Resource bookings calendar</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> Meeting Room</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Equipment</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Vehicle</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-violet-500" /> Training</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => {
              if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
            }}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => {
              if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
            }}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-px rounded-lg border border-border bg-border overflow-hidden">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="bg-muted px-2 py-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {Array.from({ length: startsOn }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-background min-h-[5rem] p-1.5" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const dayBookings = bookingsByDay[d] || [];
          const isToday = d === today;
          return (
            <div
              key={d}
              className={`bg-background min-h-[5rem] p-1.5 transition-colors hover:bg-muted/50 ${isToday ? "ring-2 ring-inset ring-primary/30" : ""}`}
            >
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isToday ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
                {d}
              </span>
              {dayBookings.length > 0 && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {dayBookings.slice(0, 3).map((b) => (
                    <div key={b.id} className="flex items-center gap-1 rounded px-1 py-0.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${TYPE_COLORS[b.resourceType]}`} />
                      <span className="text-[10px] text-muted-foreground truncate">
                        {b.startTime} {b.resourceName.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="text-[9px] text-muted-foreground/60">+{dayBookings.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CREATE BOOKING
   ═══════════════════════════════════════════════ */

export function CreateBookingForm({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) {
  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [department, setDepartment] = useState("");
  const [participants, setParticipants] = useState("");
  const [conflict, setConflict] = useState<BookingConflict | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resource = RESOURCES.find((r) => r.id === resourceId);

  const checkOverlap = () => {
    if (!resourceId || !date || !startTime || !endTime) return;
    const existing = MOCK_BOOKINGS.filter(
      (b) => b.resourceId === resourceId && b.date === date && b.status !== "Cancelled"
    );
    const conflict = existing.find((b) => {
      const bStart = b.startTime;
      const bEnd = b.endTime;
      return startTime < bEnd && endTime > bStart;
    });
    if (conflict) {
      const suggested: { start: string; end: string }[] = [];
      const slots = TIME_SLOTS.filter((s) => s >= endTime);
      for (let i = 0; i < slots.length - 1 && suggested.length < 2; i++) {
        const slotStart = slots[i];
        const slotEnd = slots[i + 1];
        const hasConflict = existing.some((b) => slotStart < b.endTime && slotEnd > b.startTime);
        if (!hasConflict) suggested.push({ start: slotStart, end: slotEnd });
      }
      setConflict({ conflict: true, existingBooking: conflict, suggestedSlots: suggested });
    } else {
      setConflict({ conflict: false });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!resourceId) errs.resource = "Select a resource";
    if (!date) errs.date = "Select a date";
    if (!startTime) errs.startTime = "Select start time";
    if (!endTime) errs.endTime = "Select end time";
    if (startTime && endTime && startTime >= endTime) errs.endTime = "End time must be after start time";
    if (!purpose.trim()) errs.purpose = "Purpose is required";
    if (!department) errs.department = "Select a department";
    if (conflict?.conflict) errs.overlap = "Booking overlaps with existing reservation";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => onSubmit(), 1500);
    }
  };

  const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">Booking Confirmed</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {resource?.name} booked for {date}, {startTime}–{endTime}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Conflict Warning */}
      {conflict?.conflict && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Booking Rejected</h3>
              <p className="mt-1 text-sm text-foreground">
                This slot overlaps with an existing booking by {conflict.existingBooking?.booker}.
              </p>
              {conflict.suggestedSlots && conflict.suggestedSlots.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-muted-foreground">Suggested available slots:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {conflict.suggestedSlots.map((s) => (
                      <button
                        key={s.start}
                        onClick={() => { setStartTime(s.start); setEndTime(s.end); setConflict(null); }}
                        className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500/10"
                      >
                        {s.start} – {s.end}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Create Booking</h3>
            <p className="text-xs text-muted-foreground">Reserve a shared resource</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TableDropdown
              label="Resource *"
              options={RESOURCES.filter((r) => r.available).map((r) => ({
                label: `${r.name} — ${r.type} (${r.location})`,
                value: r.id,
              }))}
              value={resourceId}
              onChange={(v) => { setResourceId(v); setConflict(null); }}
              placeholder="Select a resource"
            />
            {errors.resource && <p className="mt-1 text-[11px] text-destructive">{errors.resource}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Date *</label>
            <input type="date" className={inputCls + " mt-1.5"} value={date} onChange={(e) => { setDate(e.target.value); setConflict(null); }} />
            {errors.date && <p className="mt-1 text-[11px] text-destructive">{errors.date}</p>}
          </div>
          <div />
          <div>
            <TableDropdown
              label="Start Time *"
              options={TIME_SLOTS.map((t) => ({ label: t, value: t }))}
              value={startTime}
              onChange={(v) => { setStartTime(v); setConflict(null); }}
              placeholder="Start"
            />
            {errors.startTime && <p className="mt-1 text-[11px] text-destructive">{errors.startTime}</p>}
          </div>
          <div>
            <TableDropdown
              label="End Time *"
              options={TIME_SLOTS.filter((t) => t > startTime).map((t) => ({ label: t, value: t }))}
              value={endTime}
              onChange={(v) => { setEndTime(v); setConflict(null); }}
              placeholder="End"
            />
            {errors.endTime && <p className="mt-1 text-[11px] text-destructive">{errors.endTime}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground">Purpose *</label>
            <input className={inputCls + " mt-1.5"} placeholder="What is this booking for?" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            {errors.purpose && <p className="mt-1 text-[11px] text-destructive">{errors.purpose}</p>}
          </div>
          <div>
            <TableDropdown
              label="Department *"
              options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
              value={department}
              onChange={setDepartment}
              placeholder="Select department"
            />
            {errors.department && <p className="mt-1 text-[11px] text-destructive">{errors.department}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Participants</label>
            <input className={inputCls + " mt-1.5"} placeholder="Comma-separated names" value={participants} onChange={(e) => setParticipants(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button size="default" className="btn-enterprise" onClick={handleSubmit}>
          <Calendar className="h-3.5 w-3.5" /> Confirm Booking
        </Button>
        <Button variant="outline" size="default" className="btn-enterprise" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BOOKING LIST TABS
   ═══════════════════════════════════════════════ */

export function UpcomingBookingsTab() {
  const upcoming = MOCK_BOOKINGS.filter((b) => b.status === "Upcoming");
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {upcoming.map((b) => (
        <div key={b.id} className={`rounded-xl border border-l-4 ${TYPE_ACCENT[b.resourceType]} border-border bg-card p-5 transition-colors hover:bg-muted/30`}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{b.resourceName}</h4>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_BADGE[b.resourceType]}`}>{b.resourceType}</span>
            </div>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="icon-xs"><Edit className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon-xs" className="text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{b.purpose}</p>
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> {b.booker} · {b.department}</div>
            <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {formatDate(b.date)}</div>
            <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {b.startTime} – {b.endTime}</div>
            {b.participants.length > 0 && (
              <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {b.participants.join(", ")}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function OngoingBookingsTab() {
  const ongoing = MOCK_BOOKINGS.filter((b) => b.status === "Ongoing");
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ongoing.map((b) => (
        <div key={b.id} className={`rounded-xl border border-l-4 ${TYPE_ACCENT[b.resourceType]} border-border bg-card p-5`}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{b.resourceName}</h4>
              <div className="mt-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_BADGE[b.resourceType]}`}>{b.resourceType}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">In progress</span>
              </div>
            </div>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{b.purpose}</p>
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> {b.booker}</div>
            <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {b.startTime} – {b.endTime}</div>
          </div>
          <Button variant="destructive" size="sm" className="mt-4 w-full">
            <XCircle className="h-3.5 w-3.5" /> End Now
          </Button>
        </div>
      ))}
    </div>
  );
}

export function CompletedBookingsTab() {
  const completed = MOCK_BOOKINGS.filter((b) => b.status === "Completed");
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Resource", "Booked By", "Date", "Time", "Duration", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {completed.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-4 py-3.5 font-medium text-foreground">{b.resourceName}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{b.booker}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{formatDate(b.date)}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{b.startTime} – {b.endTime}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{b.startTime} – {b.endTime}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">Completed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CancelledBookingsTab() {
  const cancelled = MOCK_BOOKINGS.filter((b) => b.status === "Cancelled");
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Resource", "Booked By", "Date", "Status", "Reason"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cancelled.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-4 py-3.5 font-medium text-foreground">{b.resourceName}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{b.booker}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{formatDate(b.date)}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">Cancelled</span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs">{b.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BOOKING HISTORY
   ═══════════════════════════════════════════════ */

export function BookingHistoryTab() {
  const [search, setSearch] = useState("");
  const all = MOCK_BOOKINGS;

  const filtered = all.filter(
    (b) =>
      b.resourceName.toLowerCase().includes(search.toLowerCase()) ||
      b.booker.toLowerCase().includes(search.toLowerCase()) ||
      b.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Booking History</h3>
          <p className="text-xs text-muted-foreground">{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search history..."
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
              {["Resource", "Type", "Booker", "Department", "Date", "Time", "Duration", "Status"].map((h) => (
                <th key={h} className={`px-4 py-3 text-xs font-medium text-muted-foreground ${h === "Department" ? "hidden md:table-cell" : ""} ${h === "Duration" ? "hidden lg:table-cell" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-4 py-3.5 font-medium text-foreground">{b.resourceName}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_BADGE[b.resourceType]}`}>{b.resourceType}</span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{b.booker}</td>
                <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">{b.department}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{formatDate(b.date)}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{b.startTime} – {b.endTime}</td>
                <td className="hidden px-4 py-3.5 text-muted-foreground lg:table-cell">
                  {(() => {
                    const s = parseInt(b.startTime.split(":")[0]) * 60 + parseInt(b.startTime.split(":")[1]);
                    const e = parseInt(b.endTime.split(":")[0]) * 60 + parseInt(b.endTime.split(":")[1]);
                    const hrs = (e - s) / 60;
                    return hrs >= 1 ? `${hrs}h` : `${e - s}m`;
                  })()}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[b.status]}`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
