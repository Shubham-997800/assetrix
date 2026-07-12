"use client";

import { useInView } from "@/hooks/use-in-view";
import {
  ClipboardList,
  ArrowLeftRight,
  CalendarCheck,
  Wrench,
  ShieldCheck,
  BarChart3,
  Bell,
  ScrollText,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Asset Registration",
    description:
      "Register assets with full lifecycle tracking. Capture purchase details, warranty, location, and assign ownership from day one.",
  },
  {
    icon: ArrowLeftRight,
    title: "Asset Allocation Engine",
    description:
      "Allocate assets to departments, projects, or employees. Prevent conflicts with real-time availability checks and approval workflows.",
  },
  {
    icon: CalendarCheck,
    title: "Resource Booking",
    description:
      "Book shared resources with calendar views. Overlap validation prevents double-booking and optimizes utilization across teams.",
  },
  {
    icon: Wrench,
    title: "Maintenance Workflow",
    description:
      "Schedule preventive maintenance, track repairs, and manage service requests. Automated escalation for overdue maintenance tasks.",
  },
  {
    icon: ShieldCheck,
    title: "Audit Management",
    description:
      "Run audit cycles with physical verification. Track discrepancies, generate compliance reports, and maintain audit trails.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description:
      "Real-time dashboards with asset utilization, maintenance trends, and department allocation. Exportable reports for stakeholders.",
  },
  {
    icon: ScrollText,
    title: "Transfer Workflow",
    description:
      "Multi-level approval for asset transfers. Track movement history, update custodianship, and maintain chain of custody records.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Real-time alerts for maintenance schedules, booking confirmations, transfer approvals, and overdue returns across all channels.",
  },
];

export function Features() {
  const { ref: headerRef, isInView: headerVisible } = useInView();
  const { ref: gridRef, isInView: gridVisible } = useInView();

  return (
    <section id="features" className="border-b border-border bg-background py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mx-auto max-w-2xl text-center transition-all duration-500 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Platform
          </p>
          <h2
            className="mt-3 font-bold tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.75rem, 0.5rem + 2vw, 2.25rem)" }}
          >
            Everything you need to manage assets at scale
          </h2>
          <p
            className="mt-4 text-muted-foreground"
            style={{ fontSize: "clamp(0.95rem, 0.2rem + 0.8vw, 1.125rem)" }}
          >
            Every module is designed to eliminate manual tracking, prevent
            allocation conflicts, and automate maintenance lifecycle.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-8 sm:mt-12 md:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`card-hover group rounded-2xl border border-border bg-card p-6 transition-all duration-400 ${
                gridVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Learn more
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
