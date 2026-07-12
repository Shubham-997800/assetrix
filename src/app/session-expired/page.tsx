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
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <AlertTriangle className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Session expired
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your session has expired. Please sign in again.
          </p>
        </div>

        <div className="space-y-2">
          <Link href="/login" className="block">
            <Button className="w-full btn-enterprise">
              <ArrowLeft className="h-4 w-4" />
              Sign in
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full btn-enterprise"
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
                Refresh session
              </>
            )}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
