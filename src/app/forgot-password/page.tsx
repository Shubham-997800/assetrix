"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we will send you a reset link.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button type="submit" className="w-full" size="lg">
          Send reset link
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
