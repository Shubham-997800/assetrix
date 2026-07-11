"use client";

import {
  Keyboard,
  Ear,
  Contrast,
  Code2,
  BadgeCheck,
} from "lucide-react";

const a11yFeatures = [
  {
    icon: Keyboard,
    title: "Keyboard Navigation",
    description:
      "Every interactive element is fully operable via keyboard. Tab order, focus traps, and keyboard shortcuts built in.",
  },
  {
    icon: Ear,
    title: "Screen Readers",
    description:
      "ARIA labels, live regions, and semantic landmarks ensure full compatibility with JAWS, NVDA, and VoiceOver.",
  },
  {
    icon: Contrast,
    title: "Color Contrast",
    description:
      "All text meets WCAG 2.1 AA contrast ratios. 4.5:1 for body text, 3:1 for large text and UI components.",
  },
  {
    icon: Code2,
    title: "Semantic HTML",
    description:
      "Proper heading hierarchy, landmark regions, lists, and tables. Structure communicates meaning to assistive technology.",
  },
  {
    icon: BadgeCheck,
    title: "Accessibility Standards",
    description:
      "Committed to WCAG 2.1 AA compliance. Regular audits with automated tools and manual testing with assistive technology.",
  },
];

export function Accessibility() {
  return (
    <section className="border-b border-border bg-background py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Accessibility
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for everyone
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Accessibility is a core engineering requirement, not an afterthought.
            Every component is designed to be usable by all people.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 md:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {a11yFeatures.map((f) => (
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
