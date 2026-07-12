"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/shared/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useEffect } from "react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const canResend = countdown <= 0;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
    setCountdown(60);
    setLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCountdown(60);
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {!sent ? (
          <>
            {/* Header */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Reset your password
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <AuthInput
                label="Email address"
                type="email"
                placeholder="you@company.com"
                icon={<Mail className="h-4 w-4" />}
                error={error}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
              />

              <Button
                type="submit"
                className="w-full btn-enterprise"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <CheckCircle className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve sent password reset instructions to
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{email}</p>

            {/* Resend with Countdown */}
            <div className="mt-4">
              {canResend ? (
                <Button
                  onClick={handleResend}
                  variant="outline"
                  className="btn-enterprise"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend reset link"
                  )}
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Resend in{" "}
                    <span className="font-mono font-medium text-foreground">
                      {formatTime(countdown)}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="font-medium text-primary hover:text-primary/80"
              >
                try a different email
              </button>
            </p>
          </div>
        )}

        {/* Back to Login */}
        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
