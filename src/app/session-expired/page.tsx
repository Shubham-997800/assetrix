"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft, Loader2 } from "lucide-react";

export default function SessionExpiredPage() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/login");
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Icon */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <AlertTriangle className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Session Expired
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your session has expired due to inactivity.
            <br />
            Please sign in again to continue.
          </p>
        </div>

        {/* Security Notice */}
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <div>
              <p className="text-sm font-medium text-foreground">
                For your security
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Sessions expire after 30 minutes of inactivity to protect your
                account. Any unsaved work may not be preserved.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/login" className="block">
            <Button className="w-full btn-enterprise" size="lg">
              <ArrowLeft className="h-4 w-4" />
              Return to Login
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full btn-enterprise"
            size="lg"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Session
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground/60">
            If this keeps happening, contact your system administrator.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
