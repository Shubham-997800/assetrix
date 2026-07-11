"use client";

import { useInView } from "@/hooks/use-in-view";
import {
  FilePlus,
  CheckCircle,
  Brain,
  Rocket,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FilePlus,
    title: "Request Created",
    description: "Employee submits a request through the portal.",
  },
  {
    number: "02",
    icon: CheckCircle,
    title: "Approval",
    description: "Route to the right manager based on rules.",
  },
  {
    number: "03",
    icon: Brain,
    title: "AI Analysis",
    description: "ML model evaluates risk, cost and compliance.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Execution",
    description: "Approved actions are triggered automatically.",
  },
  {
    number: "05",
    icon: BarChart3,
    title: "Reporting",
    description: "Results feed into analytics and audit logs.",
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
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From request to result
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A five-stage pipeline that handles the full lifecycle of any
            business process.
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

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`relative flex flex-col items-center text-center transition-all duration-400 lg:px-4 ${
                  timelineVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Step Circle */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                  <step.icon className="h-7 w-7 text-primary" />
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
