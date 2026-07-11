"use client";

import {
  Globe,
  Database,
  Zap,
  Clock,
  Radio,
} from "lucide-react";

const perfFeatures = [
  {
    icon: Globe,
    title: "Edge Delivery",
    description:
      "Static assets served from 200+ edge locations globally. Sub-50ms response times for 95% of users worldwide.",
  },
  {
    icon: Database,
    title: "Query Optimization",
    description:
      "Intelligent query planner with automatic index suggestions. Complex joins optimized to under 20ms.",
  },
  {
    icon: Zap,
    title: "Smart Caching",
    description:
      "Multi-layer caching with automatic invalidation. Redis-backed hot data cache with 99.9% hit rate.",
  },
  {
    icon: Clock,
    title: "Background Processing",
    description:
      "Asynchronous job queues for heavy operations. Scheduled reports, bulk imports, and data pipelines run without blocking.",
  },
  {
    icon: Radio,
    title: "Real-Time Updates",
    description:
      "WebSocket-based live updates across dashboards. Instant notifications, live counters, and streaming data feeds.",
  },
];

const stats = [
  { value: "<50ms", label: "P95 Latency" },
  { value: "99.99%", label: "Cache Hit Rate" },
  { value: "200+", label: "Edge Locations" },
  { value: "10M+", label: "Events/Second" },
];

export function Performance() {
  return (
    <section className="border-b border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Performance
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Engineered for speed at scale
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every component is optimized for performance. From edge caching to
            query optimization, the platform handles enterprise workloads
            without compromise.
          </p>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-foreground sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {perfFeatures.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
