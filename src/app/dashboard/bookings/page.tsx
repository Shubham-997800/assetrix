"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState, useCallback, useMemo, memo } from "react";
>>>>>>> 95ccf54 (perf: optimize assets, allocations, bookings, maintenance, audit pages)
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

<<<<<<< HEAD
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
=======
const BOOKING_TAB_LABELS: Record<Tab, { label: string; icon: React.ElementType }> = {
  calendar: { label: "Calendar View", icon: Calendar },
  resources: { label: "Resources", icon: MapPin },
  upcoming: { label: "Upcoming", icon: CalendarClock },
  ongoing: { label: "Ongoing", icon: Clock },
  completed: { label: "Completed", icon: CheckCircle },
  cancelled: { label: "Cancelled", icon: XCircle },
  history: { label: "Booking History", icon: History },
};

const TAB_ORDER: Tab[] = ["calendar", "resources", "upcoming", "ongoing", "completed", "cancelled", "history"];
>>>>>>> 95ccf54 (perf: optimize assets, allocations, bookings, maintenance, audit pages)

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
      .catch(() => {});
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

  const counts = useMemo(() => ({
    upcoming: MOCK_BOOKINGS.filter((b) => b.status === "Upcoming").length,
    ongoing: MOCK_BOOKINGS.filter((b) => b.status === "Ongoing").length,
    completed: MOCK_BOOKINGS.filter((b) => b.status === "Completed").length,
    cancelled: MOCK_BOOKINGS.filter((b) => b.status === "Cancelled").length,
  }), []);

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
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
          {TAB_ORDER.map((id) => {
            const { label, icon: Icon } = BOOKING_TAB_LABELS[id];
            const count = counts[id as keyof typeof counts];
            return (
              <button
                key={id}
                onClick={() => handleSetActiveTab(id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {count !== undefined && (
                  <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
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
