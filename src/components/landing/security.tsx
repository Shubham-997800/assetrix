"use client";

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
  Clock,
} from "lucide-react";

const securityFeatures = [
  {
    icon: KeyRound,
    title: "Role-Based Access Control",
    description:
      "Granular permissions with predefined and custom roles. Assign access at module, feature, and data level.",
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
      "Immutable audit trail capturing every action. Filterable by user, module, timestamp, and action type.",
  },
  {
    icon: BadgeCheck,
    title: "Compliance",
    description:
      "SOC 2 Type II, GDPR, HIPAA, and ISO 27001 compliant. Automated compliance reporting.",
  },
  {
    icon: ShieldCheck,
    title: "Access Policies",
    description:
      "IP allowlisting, device fingerprinting, geo-restrictions, and conditional access rules per role.",
  },
  {
    icon: Fingerprint,
    title: "Session Management",
    description:
      "Secure session handling with automatic expiration, concurrent session limits, and forced logout capabilities.",
  },
];

const metrics = [
  { icon: Activity, value: "99.99%", label: "Availability" },
  { icon: Lock, value: "256-bit", label: "Encryption" },
  { icon: Users, value: "Role Based", label: "Access Control" },
  { icon: Server, value: "Full", label: "Traceability" },
];

export function Security() {
  return (
    <section id="security" className="border-b border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Security
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Enterprise-grade by default
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Security is not an add-on. Every layer of the platform is built to
            meet the strictest compliance and data protection standards.
          </p>
        </div>

        {/* Security Cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {securityFeatures.map((f) => (
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

        {/* Metrics Bar */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-12 sm:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
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
