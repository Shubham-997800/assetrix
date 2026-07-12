"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, Lock, Mail } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    await new Promise((r) => setTimeout(r, 1500));
    if (password === "wrong") {
      setErrors({ general: "Invalid email or password." });
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Sign in
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        {errors.general && (
          <div
            className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive animate-fade-in"
            role="alert"
          >
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((p) => ({ ...p, email: undefined }));
                }}
                className={`input-focus-glow w-full rounded-xl border bg-muted/30 py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground min-h-[44px] ${
                  errors.email
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`input-focus-glow w-full rounded-xl border bg-muted/30 py-2.5 pl-9 pr-9 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground min-h-[44px] ${
                  errors.password
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
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
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Remember */}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
            />
            Remember me
          </label>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full btn-enterprise min-h-[44px]"
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

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
