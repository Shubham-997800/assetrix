"use client";

import { Brain, Database, Sparkles, Target, Lightbulb, ArrowRight } from "lucide-react";

const pipelineSteps = [
  { icon: Database, label: "Asset Data" },
  { icon: Brain, label: "AI Engine" },
  { icon: Sparkles, label: "Prediction" },
  { icon: Lightbulb, label: "Recommendation" },
  { icon: Target, label: "Decision Support" },
];

export function AIIntelligence() {
  return (
    <section id="ai" className="border-b border-border bg-background py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Pipeline */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              AI Operational Intelligence
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Decisions powered by intelligence
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our AI layer processes your asset and operational data through a
              multi-stage pipeline to deliver actionable recommendations with
              measurable confidence scores.
            </p>

            {/* Visual Pipeline */}
            <div className="mt-10 space-y-3">
              {pipelineSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {step.label}
                  </span>
                  {i < pipelineSteps.length - 1 && (
                    <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - AI Recommendation Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  AI Recommendation
                </p>
                <p className="text-xs text-muted-foreground">
                  Maintenance Prediction Analysis
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Recommendation
                </p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  Schedule preventive maintenance for Server Rack B3
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Confidence
                  </p>
                  <p className="mt-1 text-2xl font-bold text-primary">87%</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Risk Score
                  </p>
                  <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                    Medium
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Reasoning
                </p>
                <ul className="mt-2 space-y-1.5">
                  {[
                    "Predicted failure within 14 days based on usage patterns",
                    "High utilization assets require priority maintenance",
                    "Historical data shows similar models failed at 8,200 hours",
                  ].map((r) => (
                    <li
                      key={r}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
