"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[440px] animate-fade-in-up">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Assetrix
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-[11px] text-muted-foreground/50">
          &copy; {new Date().getFullYear()} Assetrix, Inc.
        </p>
      </div>
    </div>
  );
}
