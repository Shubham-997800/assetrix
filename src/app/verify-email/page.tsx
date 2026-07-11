"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = "john@company.com";

  const handleResend = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResent(true);
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 animate-fade-in-up">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
            Verify your email
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;ve sent a verification link to
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">{email}</p>
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Check your inbox</p>
              <p className="text-xs text-muted-foreground">
                Click the verification link in the email we sent you.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Verify your account</p>
              <p className="text-xs text-muted-foreground">
                The link expires in 24 hours. Check spam if you don&apos;t see it.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full btn-enterprise"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>

          {resent && (
            <p className="text-center text-xs text-emerald-600 dark:text-emerald-400 animate-fade-in">
              Verification email resent successfully.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-3 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
          <p className="text-xs text-muted-foreground">
            Need a different email?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              Change email
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
