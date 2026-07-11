"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left - Brand */}
      <div className="hidden w-1/2 items-center justify-center border-r border-border bg-muted/30 lg:flex">
        <div className="max-w-md px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Nexus
            </span>
          </Link>
          <h2 className="mt-8 text-2xl font-bold text-foreground">
            The operating system for modern business workflows.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Automate approvals, analyze data, manage operations and make faster
            decisions using AI powered workflows.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: "250K+", label: "Active Users" },
              { value: "99.99%", label: "Uptime" },
              { value: "5M+", label: "Transactions" },
              { value: "42", label: "Countries" },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-lg font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
