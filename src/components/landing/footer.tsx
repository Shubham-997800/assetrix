"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import Link from "next/link";
import { PrivacyDialog } from "@/components/shared/privacy-dialog";

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [privacyType, setPrivacyType] = useState<"privacy" | "terms">("privacy");

  const openDialog = (type: "privacy" | "terms") => {
    setPrivacyType(type);
    setPrivacyOpen(true);
  };

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

          {/* Links & Copyright */}
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button
                onClick={() => openDialog("privacy")}
                className="transition-colors hover:text-foreground"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => openDialog("terms")}
                className="transition-colors hover:text-foreground"
              >
                Terms of Service
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Assetrix, Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

      <PrivacyDialog
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        type={privacyType}
      />
    </footer>
  );
}
