"use client";

import { useInView } from "@/hooks/use-in-view";
import {
  KeyRound,
  Lock,
  ScrollText,
  BadgeCheck,
  ShieldCheck,
  Activity,
  Server,
  Users,
  Fingerprint,
} from "lucide-react";

const securityFeatures = [
  {
    icon: KeyRound,
    title: "Role-Based Access Control",
    description:
      "Granular permissions with predefined and custom roles. Assign access at module, asset, and data level.",
  },
  {
    icon: Lock,
    title: "Encryption",
    description:
      "AES-256 encryption at rest and TLS 1.3 in transit. Customer-managed keys supported.",
  },
  {
    icon: ScrollText,
    title: "Audit Logs",
    description:
      "Immutable audit trail capturing every asset action. Filterable by user, module, timestamp, and action type.",
  },
  {
    icon: BadgeCheck,
    title: "Compliance",
    description:
      "SOC 2 Type II, GDPR, HIPAA, and ISO 27001 compliant. Automated compliance reporting for asset audits.",
  },
  {
    icon: ShieldCheck,
    title: "Approval Workflows",
    description:
      "Multi-level approval chains for asset allocation, transfers, and disposal. Customizable routing rules.",
  },
  {
    icon: Fingerprint,
    title: "Session Management",
    description:
      "Secure session handling with automatic expiration, concurrent session limits, and forced logout capabilities.",
  },
];

const metrics = [
  { icon: Activity, value: "99.8%", label: "Audit Accuracy" },
  { icon: Lock, value: "256-bit", label: "Encryption" },
  { icon: Users, value: "Role Based", label: "Access Control" },
  { icon: Server, value: "Full", label: "Traceability" },
];

export function Security() {
  const { ref: headerRef, isInView: headerVisible } = useInView();
  const { ref: cardsRef, isInView: cardsVisible } = useInView();
  const { ref: metricsRef, isInView: metricsVisible } = useInView();

  return (
    <section id="security" className="border-b border-border bg-muted/30 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mx-auto max-w-2xl text-center transition-all duration-500 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Security
          </p>
          <h2
            className="mt-3 font-bold tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.75rem, 0.5rem + 2vw, 2.25rem)" }}
          >
            Enterprise-grade by default
          </h2>
          <p
            className="mt-4 text-muted-foreground"
            style={{ fontSize: "clamp(0.95rem, 0.2rem + 0.8vw, 1.125rem)" }}
          >
            Security is not an add-on. Every layer of the platform is built to
            meet the strictest compliance and data protection standards.
          </p>
        </div>

        {/* Security Cards */}
        <div ref={cardsRef} className="mt-8 sm:mt-12 md:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {securityFeatures.map((f, i) => (
            <div
              key={f.title}
              className={`card-hover rounded-2xl border border-border bg-card p-6 transition-all duration-400 ${
                cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
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

        {/* Metrics Bar */}
        <div
          ref={metricsRef}
          className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-12 sm:grid-cols-4"
        >
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`text-center transition-all duration-400 ${
                metricsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <m.icon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-lg font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
