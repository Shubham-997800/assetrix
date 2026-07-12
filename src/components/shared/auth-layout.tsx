"use client";

import Link from "next/link";
import { Zap, Shield, Brain, BarChart3, CheckCircle, Lock } from "lucide-react";

const features = [
  { icon: Shield, label: "Enterprise Security" },
  { icon: Brain, label: "AI Powered Workflows" },
  { icon: BarChart3, label: "Real Time Analytics" },
  { icon: CheckCircle, label: "Role Based Access" },
  { icon: Lock, label: "Audit Logs" },
];

const metrics = [
  { value: "99.99%", label: "Availability" },
  { value: "10M+", label: "Events Processed" },
  { value: "250K+", label: "Users" },
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
            The operating system for modern business workflows.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Automate approvals, analyze data, manage operations and make faster
            decisions using AI powered workflows.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-4">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{f.label}</span>
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
