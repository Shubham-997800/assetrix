"use client";

import Link from "next/link";
import {
  Zap,
  Shield,
  Brain,
  BarChart3,
  CheckCircle,
  Lock,
} from "lucide-react";

const features = [
  { icon: Shield, label: "Enterprise Security" },
  { icon: Brain, label: "AI-Powered Workflows" },
  { icon: BarChart3, label: "Real-Time Analytics" },
  { icon: CheckCircle, label: "Role-Based Access" },
  { icon: Lock, label: "Audit Logs & Compliance" },
];

const metrics = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "10M+", label: "Events Processed" },
  { value: "250K+", label: "Assets Managed" },
  { value: "42", label: "Countries" },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 items-center justify-center border-r border-border bg-muted/20 lg:flex xl:w-[55%]">
        <div className="max-w-lg px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Assetrix
            </span>
          </Link>

          {/* Tagline */}
          <h2 className="mt-10 text-3xl font-bold leading-tight text-foreground lg:text-4xl">
            The enterprise platform for asset
            <br />
            and resource management.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Track assets, automate maintenance, manage bookings, and make
            faster decisions with AI-powered workflows and real-time analytics.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-4">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="text-xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground/60">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>SOC 2 Type II compliant · GDPR ready · ISO 27001</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[480px] animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Assetrix
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
