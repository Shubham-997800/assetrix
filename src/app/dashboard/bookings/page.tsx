"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  History,
  BookOpen,
  MapPin,
} from "lucide-react";
import {
  ResourceDirectoryTab,
  CalendarViewTab,
  CreateBookingForm,
  UpcomingBookingsTab,
  OngoingBookingsTab,
  CompletedBookingsTab,
  CancelledBookingsTab,
  BookingHistoryTab,
} from "./_components/booking-tabs";
import { MOCK_BOOKINGS } from "./_components/data";

type Tab = "calendar" | "resources" | "upcoming" | "ongoing" | "completed" | "cancelled" | "history";
type View = "tabs" | "form";

const upcoming = MOCK_BOOKINGS.filter((b) => b.status === "Upcoming").length;
const ongoing = MOCK_BOOKINGS.filter((b) => b.status === "Ongoing").length;
const completed = MOCK_BOOKINGS.filter((b) => b.status === "Completed").length;
const cancelled = MOCK_BOOKINGS.filter((b) => b.status === "Cancelled").length;

const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
  { id: "calendar", label: "Calendar View", icon: Calendar },
  { id: "resources", label: "Resources", icon: MapPin },
  { id: "upcoming", label: "Upcoming", icon: CalendarClock, count: upcoming },
  { id: "ongoing", label: "Ongoing", icon: Clock, count: ongoing },
  { id: "completed", label: "Completed", icon: CheckCircle, count: completed },
  { id: "cancelled", label: "Cancelled", icon: XCircle, count: cancelled },
  { id: "history", label: "Booking History", icon: History },
];

export default function BookingsPage() {
  const [view, setView] = useState<View>("tabs");
  const [activeTab, setActiveTab] = useState<Tab>("calendar");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Resource Booking
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage meeting rooms, equipment & vehicles
          </p>
        </div>
        {view === "tabs" && (
          <Button size="sm" className="btn-enterprise" onClick={() => setView("form")}>
            <Plus className="h-3.5 w-3.5" /> New Booking
          </Button>
        )}
      </div>

      {/* Tabs */}
      {view === "tabs" && (
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === t.id
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
      )}

      {/* Content */}
      {view === "tabs" && activeTab === "calendar" && <CalendarViewTab />}
      {view === "tabs" && activeTab === "resources" && <ResourceDirectoryTab />}
      {view === "tabs" && activeTab === "upcoming" && <UpcomingBookingsTab />}
      {view === "tabs" && activeTab === "ongoing" && <OngoingBookingsTab />}
      {view === "tabs" && activeTab === "completed" && <CompletedBookingsTab />}
      {view === "tabs" && activeTab === "cancelled" && <CancelledBookingsTab />}
      {view === "tabs" && activeTab === "history" && <BookingHistoryTab />}

      {view === "form" && (
        <CreateBookingForm
          onSubmit={() => setView("tabs")}
          onCancel={() => setView("tabs")}
        />
      )}
    </div>
  );
}
