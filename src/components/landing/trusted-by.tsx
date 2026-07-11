"use client";

const companies = [
  "Enterprise Corp",
  "Global Manufacturing",
  "Tech Startup Inc",
  "Financial Group",
  "Healthcare Network",
];

const metrics = [
  { value: "250K+", label: "Users" },
  { value: "5M+", label: "Transactions" },
  { value: "99.99%", label: "Availability" },
  { value: "42", label: "Countries" },
];

export function TrustedBy() {
  return (
    <section className="border-b border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Used by teams building the future
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {companies.map((name) => (
            <div
              key={name}
              className="text-base font-semibold text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
            >
              {name}
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-xl font-bold text-foreground sm:text-2xl">
                {m.value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
