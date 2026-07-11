"use client";

import { useInView } from "@/hooks/use-in-view";
import { useCountUp } from "@/hooks/use-count-up";

const companies = [
  "Enterprise Corp",
  "Global Manufacturing",
  "Tech Startup Inc",
  "Financial Group",
  "Healthcare Network",
];

const metricsData = [
  { target: 250, suffix: "K+", label: "Users" },
  { target: 5, suffix: "M+", label: "Transactions" },
  { target: 99.99, suffix: "%", label: "Availability" },
  { target: 42, suffix: "", label: "Countries" },
];

function MetricItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, isInView } = useInView();
  const count = useCountUp(target, 1500);

  return (
    <div ref={ref} className="text-center">
      <p className="text-xl font-bold text-foreground sm:text-2xl">
        {isInView ? (target === 99.99 ? "99.99" : count.toLocaleString("en-IN")) : "0"}
        {suffix}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function TrustedBy() {
  const { ref: sectionRef, isInView } = useInView();

  return (
    <section className="border-b border-border bg-background py-12">
      <div ref={sectionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className={`text-center text-sm font-medium uppercase tracking-widest text-muted-foreground transition-all duration-500 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Used by teams building the future
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {companies.map((name, i) => (
            <div
              key={name}
              className={`text-base font-semibold text-muted-foreground/40 transition-all duration-500 hover:text-muted-foreground/70 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
          {metricsData.map((m) => (
            <MetricItem key={m.label} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}
