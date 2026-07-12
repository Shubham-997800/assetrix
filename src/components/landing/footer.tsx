"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 py-12 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Assetrix homepage">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Assetrix
              </span>
            </Link>
            <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground sm:text-left">
              Enterprise asset & resource management platform. Track assets,
              automate maintenance, and manage bookings from one place.
            </p>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Assetrix, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
