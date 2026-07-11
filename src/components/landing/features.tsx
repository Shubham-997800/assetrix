"use client";

import { useInView } from "@/hooks/use-in-view";
import {
  Workflow,
  Brain,
  BarChart3,
  CheckCircle,
  Shield,
  MessageSquare,
  Plug,
  ScrollText,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automate repetitive business processes with configurable rules and triggers.",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description:
      "Receive intelligent recommendations and predictions powered by machine learning.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Real-time dashboards, customizable reports, and drillable data visualizations.",
  },
  {
    icon: CheckCircle,
    title: "Approvals",
    description:
      "Multi-level enterprise approval workflows with role-based routing and SLAs.",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "Enterprise grade access control with RBAC, encryption, and audit logging.",
  },
  {
    icon: MessageSquare,
    title: "Collaboration",
    description:
      "Comments, mentions and activity feeds built into every workflow and record.",
  },
  {
    icon: Plug,
    title: "Integrations",
    description:
      "Connect external systems with pre-built connectors and a REST API.",
  },
  {
    icon: ScrollText,
    title: "Audit Logs",
    description:
      "Complete traceability of every action with immutable, filterable audit trails.",
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
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to operate at scale
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every module is designed to integrate seamlessly, perform under
            pressure, and grow with your organization.
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
