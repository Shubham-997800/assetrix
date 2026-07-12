"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";
import { authApi } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verifying, setVerifying] = useState(!!token);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const canResend = countdown <= 0;
  const [sentEmail, setSentEmail] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setVerified(true);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Verification failed.";
        setError(message);
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [token]);

  const handleResend = useCallback(async () => {
    if (!canResend || !sentEmail) return;
    setResendLoading(true);
    try {
      await authApi.resendVerification(sentEmail);
      setCountdown(60);
    } catch {
      // silently retry
    } finally {
      setResendLoading(false);
    }
  }, [canResend, sentEmail]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (verifying) {
    return (
      <AuthLayout>
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying your email...</p>
        </div>
      </AuthLayout>
    );
  }

  if (verified) {
    return (
      <AuthLayout>
        <div className="space-y-4 text-center animate-fade-in">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Email verified
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your email has been verified. You can now sign in.
            </p>
          </div>
          <Link href="/login">
            <Button className="btn-enterprise">Sign in</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-4 text-center">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <XCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 animate-fade-in">
          <Mail className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Verify your email
          </h1>
          {sentEmail ? (
            <p className="mt-1 text-sm text-muted-foreground">
              We sent a verification link to{" "}
              <span className="font-medium text-foreground">{sentEmail}</span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Check your email for the verification link, or enter your email below to resend.
            </p>
          )}
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

        {!sentEmail && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const em = fd.get("email") as string;
              if (em) {
                setSentEmail(em);
                setCountdown(60);
                authApi.resendVerification(em).catch(() => {});
              }
            }}
            className="space-y-2"
          >
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              required
            />
            <Button type="submit" variant="outline" className="w-full btn-enterprise">
              Send verification email
            </Button>
          </form>
        )}

        {sentEmail && (
          <>
            {canResend ? (
              <Button
                onClick={handleResend}
                variant="outline"
                className="w-full btn-enterprise"
                disabled={resendLoading}
              >
                {resendLoading ? (
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
          </>
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </AuthLayout>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
