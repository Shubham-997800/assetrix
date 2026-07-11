"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <AuthLayout>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start your 14-day free trial. No credit card required.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/dashboard");
        }}
        className="mt-8 space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground">
              First name
            </label>
            <input
              type="text"
              placeholder="John"
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Last name
            </label>
            <input
              type="text"
              placeholder="Doe"
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Work email
          </label>
          <input
            type="email"
            placeholder="john@company.com"
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Company name
          </label>
          <input
            type="text"
            placeholder="Acme Corp"
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button type="submit" className="w-full" size="lg">
          Create account
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link href="#" className="underline hover:text-foreground">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
