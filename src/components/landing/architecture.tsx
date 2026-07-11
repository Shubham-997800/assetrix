"use client";

import {
  Users,
  Cpu,
  Workflow,
  Brain,
  Target,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const steps = [
  { icon: Users, label: "Users", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { icon: Cpu, label: "Platform", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { icon: Workflow, label: "Workflow Engine", color: "bg-primary/10 text-primary" },
  { icon: Brain, label: "AI Layer", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { icon: Target, label: "Decision Engine", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { icon: BarChart3, label: "Analytics", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { icon: TrendingUp, label: "Business Outcome", color: "bg-primary/10 text-primary" },
];

export function PlatformArchitecture() {
  return (
    <section id="architecture" className="border-b border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Architecture
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Platform architecture built for enterprise
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A layered architecture that ensures data flows cleanly from input to
            insight to action.
          </p>
        </div>

        {/* Vertical Pipeline - Mobile/Tablet */}
        <div className="mt-16 flex flex-col items-center gap-0 lg:hidden">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center">
              <div
                className={`flex h-16 w-64 items-center gap-3 rounded-xl border border-border bg-card px-5 shadow-sm`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${step.color}`}>
                  <step.icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex flex-col items-center my-0.5" aria-hidden="true">
                  <div className="h-1.5 w-px bg-border" />
                  <div className="h-0 w-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-border" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Horizontal Pipeline - Desktop */}
        <div className="mt-16 hidden lg:block">
          <div className="relative flex items-start justify-between">
            {steps.map((step, i) => (
              <div key={step.label} className="relative flex flex-1 flex-col items-center z-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.color}`}
                  >
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-4 text-center text-xs font-semibold text-foreground">
                  {step.label}
                </p>
              </div>
            ))}
            {/* Connector Line */}
            <div className="absolute left-[calc(100%/14)] right-[calc(100%/14)] top-10 h-px border-t border-dashed border-border z-0" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
