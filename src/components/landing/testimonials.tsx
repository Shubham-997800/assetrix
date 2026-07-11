"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Nexus replaced four separate tools for our team. The unified dashboard alone saved us 20 hours per week in reporting overhead.",
    name: "Catherine Morales",
    role: "VP of Operations",
    company: "Meridian Health Systems",
  },
  {
    quote:
      "The approval workflow engine is the most flexible we have evaluated. It handled our 12-step procurement process out of the box.",
    name: "David Okafor",
    role: "Chief Technology Officer",
    company: "Atlas Manufacturing",
  },
  {
    quote:
      "We migrated from a legacy ERP in under 8 weeks. The onboarding team and API integration layer made it remarkably smooth.",
    name: "Anika Patel",
    role: "Director of Finance",
    company: "Vanguard Logistics Group",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-border bg-background py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by operations leaders
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.role}, {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
