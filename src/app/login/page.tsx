"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/shared/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
  lockout?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    await new Promise((r) => setTimeout(r, 1500));

    if (password === "wrong") {
      setErrors({
        general:
          "Invalid email or password. Please verify your credentials and try again.",
      });
      setLoading(false);
      return;
    }

    if (password === "locked") {
      setErrors({
        lockout:
          "Too many failed attempts. Your account has been temporarily locked. Please try again in 15 minutes or contact your administrator.",
      });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to your Assetrix account
          </p>
        </div>

        {/* Error Banner */}
        {errors.general && (
          <div
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 animate-fade-in"
            role="alert"
          >
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Lockout Banner */}
        {errors.lockout && (
          <div
            className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 animate-fade-in"
            role="alert"
          >
            <div className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Account Temporarily Locked
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {errors.lockout}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthInput
            label="Email address"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            autoComplete="email"
          />

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-1.5">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`input-focus-glow w-full rounded-xl border bg-muted/30 py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-all duration-150 placeholder:text-muted-foreground ${
                  errors.password
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                className="mt-1.5 text-xs text-destructive"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full btn-enterprise"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Request access
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
