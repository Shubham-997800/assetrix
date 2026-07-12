"use client";

import { useInView } from "@/hooks/use-in-view";
import {
  ClipboardList,
  ArrowLeftRight,
  CheckCircle,
  Wrench,
  ShieldCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Asset Registration",
    description: "Register assets with lifecycle tracking and ownership assignment.",
  },
  {
    number: "02",
    icon: ArrowLeftRight,
    title: "Allocation",
    description: "Assign assets to departments with real-time availability checks.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Transfer Request",
    description: "Multi-level approval workflow for asset movement between teams.",
  },
  {
    number: "04",
    icon: Wrench,
    title: "Maintenance",
    description: "Schedule preventive maintenance and track repair history.",
  },
  {
    number: "05",
    icon: ShieldCheck,
    title: "Audit",
    description: "Run audit cycles with physical verification and compliance reports.",
  },
  {
    number: "06",
    icon: BarChart3,
    title: "Reports",
    description: "Generate utilization reports and retirement forecasts.",
  },
];

export function Workflow() {
  const { ref: headerRef, isInView: headerVisible } = useInView();
  const { ref: timelineRef, isInView: timelineVisible } = useInView();

  return (
    <section id="workflow" className="border-b border-border bg-background py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mx-auto max-w-2xl text-center transition-all duration-500 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Workflow
          </p>
          <h2
            className="mt-3 font-bold tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.75rem, 0.5rem + 2vw, 2.25rem)" }}
          >
            From registration to retirement
          </h2>
          <p
            className="mt-4 text-muted-foreground"
            style={{ fontSize: "clamp(0.95rem, 0.2rem + 0.8vw, 1.125rem)" }}
          >
            A complete lifecycle pipeline that handles every stage of asset
            management from day one to disposal.
          </p>
        </div>

        {/* Horizontal Timeline */}
        <div ref={timelineRef} className="relative mt-8 sm:mt-12 md:mt-16">
          {/* Connector Line - Desktop with draw animation */}
          <div className="absolute left-[10%] right-[10%] top-12 hidden border-t border-dashed border-border lg:block" />
          <div
            className={`absolute left-[10%] top-12 hidden h-px bg-primary lg:block transition-all duration-700 ease-out ${
              timelineVisible ? "w-[80%]" : "w-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`relative flex flex-col items-center text-center transition-all duration-400 lg:px-3 ${
                  timelineVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Step Circle */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30 sm:h-20 sm:w-20">
                  <step.icon className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                </div>

                {/* Arrow */}
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-10 z-20 hidden text-muted-foreground/30 lg:block">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}

                {/* Text */}
                <span className="mt-5 text-[10px] font-bold uppercase tracking-widest text-primary">
                  Step {step.number}
                </span>
                <h3 className="mt-1.5 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-[200px] text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
