"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  History,
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
import { bookingApi } from "@/lib/api";
import type { Booking as ApiBooking } from "@/lib/types";

type Tab = "calendar" | "resources" | "upcoming" | "ongoing" | "completed" | "cancelled" | "history";
type View = "tabs" | "form";

function mapBookingStatus(b: ApiBooking): string {
  switch (b.status) {
    case "PENDING": return "Upcoming";
    case "APPROVED": {
      const now = new Date();
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      if (start <= now && end >= now) return "Ongoing";
      if (start > now) return "Upcoming";
      return "Completed";
    }
    case "COMPLETED": return "Completed";
    case "CANCELLED":
    case "REJECTED": return "Cancelled";
    default: return "Upcoming";
  }
}

const TAB_CONTENT: Record<Tab, React.ElementType | null> = {
  calendar: CalendarViewTab,
  resources: ResourceDirectoryTab,
  upcoming: UpcomingBookingsTab,
  ongoing: OngoingBookingsTab,
  completed: CompletedBookingsTab,
  cancelled: CancelledBookingsTab,
  history: BookingHistoryTab,
};

function BookingsPage() {
  const [view, setView] = useState<View>("tabs");
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    bookingApi
      .list()
      .then((res) => {
        const items = (res.data ?? []) as ApiBooking[];
        const c: Record<string, number> = { upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 };
        items.forEach((b) => {
          const s = mapBookingStatus(b).toLowerCase();
          if (s in c) c[s]++;
        });
        setCounts(c);
      })
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
      });
  }, []);

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "calendar", label: "Calendar View", icon: Calendar },
    { id: "resources", label: "Resources", icon: MapPin },
    { id: "upcoming", label: "Upcoming", icon: CalendarClock, count: counts.upcoming },
    { id: "ongoing", label: "Ongoing", icon: Clock, count: counts.ongoing },
    { id: "completed", label: "Completed", icon: CheckCircle, count: counts.completed },
    { id: "cancelled", label: "Cancelled", icon: XCircle, count: counts.cancelled },
    { id: "history", label: "Booking History", icon: History },
  ];

  const handleNewBooking = useCallback(() => {
    setView("form");
  }, []);

  const handleViewTabs = useCallback(() => {
    setView("tabs");
  }, []);

  const handleSetActiveTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  const ActiveContent = view === "tabs" ? TAB_CONTENT[activeTab] : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Resource Booking
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage meeting rooms, equipment and vehicles
          </p>
        </div>
        {view === "tabs" && (
          <Button size="sm" className="btn-enterprise" onClick={handleNewBooking}>
            <Plus className="h-3.5 w-3.5" /> New Booking
          </Button>
        )}
      </div>

      {/* Tabs */}
      {view === "tabs" && (
        <div className="border-b border-border">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSetActiveTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.count !== undefined && (
                  <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Content */}
      {ActiveContent && <ActiveContent />}

      {view === "form" && (
        <CreateBookingForm
          onSubmit={handleViewTabs}
          onCancel={handleViewTabs}
        />
      )}
    </div>
  );
}

export default memo(BookingsPage);
