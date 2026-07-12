"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/shared/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const canResend = countdown <= 0;

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      setCountdown(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset link.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setCountdown(60);
    } catch {
      // silently retry
    } finally {
      setLoading(false);
    }
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <AuthLayout>
      <div className="space-y-4">
        {!sent ? (
          <>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Reset password
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <AuthInput
                label="Email"
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-4 text-center animate-fade-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Check your email
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                We sent a reset link to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            {canResend ? (
              <Button
                onClick={handleResend}
                variant="outline"
                className="btn-enterprise"
                disabled={loading}
              >
                {loading ? "Sending..." : "Resend reset link"}
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

            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Try a different email
            </button>
          </div>
        )}

        <Link
          href="/login"
          className="flex items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
