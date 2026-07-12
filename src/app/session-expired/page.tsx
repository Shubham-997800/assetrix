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
      <div className="space-y-6">
        {/* Icon */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <AlertTriangle className="h-7 w-7 text-primary" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Session Expired
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your session has expired due to inactivity.
            <br />
            Please sign in again to continue.
          </p>
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
      </div>
    </AuthLayout>
  );
}
