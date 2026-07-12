"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Assetrix] Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 mb-5">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </span>
      <h2 className="text-lg font-bold text-foreground">Page Error</h2>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground leading-relaxed">
        This section encountered an error. You can try reloading or navigate back.
      </p>
      {error.digest && (
        <p className="mt-3 rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
          {error.digest}
        </p>
      )}
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
