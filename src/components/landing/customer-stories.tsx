"use client";

import { Star, Quote } from "lucide-react";

const stories = [
  {
    quote:
      "Assetrix replaced four separate tracking systems for our hospital. We now manage 12,000+ medical devices from a single dashboard with 99.8% audit accuracy.",
    name: "Dr. Catherine Morales",
    role: "Chief Operations Officer",
    company: "Meridian Health Systems",
    initials: "CM",
  },
  {
    quote:
      "The allocation engine eliminated our double-booking issues overnight. We manage 8,000+ lab equipment across 6 departments without a single conflict in 6 months.",
    name: "Prof. David Okafor",
    role: "Head of Infrastructure",
    company: "Atlas University",
    initials: "DO",
  },
  {
    quote:
      "We migrated from a legacy ERP in under 8 weeks. The maintenance workflow automation reduced our repair turnaround time by 40% in the first quarter.",
    name: "Anika Patel",
    role: "Director of Operations",
    company: "Vanguard Manufacturing",
    initials: "AP",
  },
];

export function CustomerStories() {
  return (
    <section className="border-b border-border bg-muted/30 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Customer Stories
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by operations leaders
          </h2>
        </div>

        <div className="mt-8 sm:mt-12 md:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20" />

              {/* Stars */}
              <div className="mt-3 flex gap-0.5" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-primary text-primary"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
