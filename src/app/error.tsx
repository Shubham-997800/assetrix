"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Assetrix] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </span>
        <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          An unexpected error occurred. Please try again or contact support if the issue persists.
        </p>
        {error.digest && (
          <p className="mt-3 rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 min-h-[44px] text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 min-h-[44px] text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
