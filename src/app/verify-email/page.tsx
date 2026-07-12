"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Loader2, Clock, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const canResend = countdown <= 0;
  const email = "john@company.com";

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    if (!canResend) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCountdown(60);
    setLoading(false);
  }, [canResend]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <AuthLayout>
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 animate-fade-in">
          <Mail className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Verify your email
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-left">
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              Click the verification link in the email we sent you.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              The link expires in 24 hours. Check spam if you don&apos;t see it.
            </p>
          </div>
        </div>

        {canResend ? (
          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full btn-enterprise"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Resend in{" "}
            <span className="font-mono font-medium text-foreground">
              {fmt(countdown)}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
          <p className="text-xs text-muted-foreground">
            Need a different email?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Change email
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
