"use client";

import { Code2, Webhook, Package, FileText, Plug } from "lucide-react";

const devFeatures = [
  {
    icon: Code2,
    title: "Modular ERP Architecture",
    description:
      "Cleanly separated modules for assets, bookings, maintenance, and audits. Each module is independently scalable and extensible.",
  },
  {
    icon: Webhook,
    title: "Workflow Engine",
    description:
      "Event-driven workflow engine with configurable approval chains, escalation rules, and SLA timers for every business process.",
  },
  {
    icon: Package,
    title: "Reusable Components",
    description:
      "Shared UI component library with consistent design patterns. Type-safe props and accessible by default across all modules.",
  },
  {
    icon: FileText,
    title: "Role-Based Routing",
    description:
      "Automatic route protection based on user roles. Department-level access control with granular permission inheritance.",
  },
  {
    icon: Plug,
    title: "Scalable Database Design",
    description:
      "Normalized schema supporting multi-tenant deployments. Optimized queries with automatic index suggestions for complex joins.",
  },
];

export function DeveloperExperience() {
  return (
    <section className="border-b border-border bg-background py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Developer Experience
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for teams who ship
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Modular ERP architecture with reusable components, role-based
              routing, and a workflow engine that scales with your organization.
            </p>

            {/* Code Preview */}
            <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-[10px] text-muted-foreground">
                  asset-api.ts
                </span>
              </div>
              <pre className="p-4 text-xs leading-relaxed overflow-x-auto">
                <code>
                  <span className="text-violet-600 dark:text-violet-400">const</span>{" "}
                  <span className="text-foreground">assets</span>{" "}
                  <span className="text-muted-foreground">=</span>{" "}
                  <span className="text-muted-foreground">await</span>{" "}
                  <span className="text-foreground">assetrix</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-primary">assets</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-amber-600 dark:text-amber-400">list</span>
                  <span className="text-muted-foreground">({"{"}</span>
                  {"\n"}
                  {"  "}<span className="text-foreground">status</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">&quot;available&quot;</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}<span className="text-foreground">department</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">&quot;engineering&quot;</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}<span className="text-foreground">page</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-amber-600 dark:text-amber-400">1</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"})"}</span>
                  {"\n\n"}
                  <span className="text-violet-600 dark:text-violet-400">for</span>{" "}
                  <span className="text-muted-foreground">(</span>
                  <span className="text-foreground">asset</span>{" "}
                  <span className="text-violet-600 dark:text-violet-400">of</span>{" "}
                  <span className="text-foreground">assets</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-foreground">data</span>
                  <span className="text-muted-foreground">) {"{"}</span>
                  {"\n"}
                  {"  "}<span className="text-muted-foreground">await</span>{" "}
                  <span className="text-foreground">assetrix</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-primary">maintenance</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-amber-600 dark:text-amber-400">schedule</span>
                  <span className="text-muted-foreground">(</span>
                  <span className="text-foreground">asset</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-foreground">id</span>
                  <span className="text-muted-foreground">)</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"}"}</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="space-y-4">
            {devFeatures.map((f) => (
              <div
                key={f.title}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
