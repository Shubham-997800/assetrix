"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/shared/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import {
  PasswordStrength,
  getPasswordStrength,
} from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!password) e.password = "Password is required";
    else if (getPasswordStrength(password).score < 2)
      e.password = "Password too weak";
    if (!confirmPassword) e.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <AuthLayout>
      <div className="space-y-4">
        {!success ? (
          <>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Set new password
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Choose a strong password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <div className="space-y-2">
                <AuthInput
                  label="New password"
                  type="password"
                  placeholder="Enter new password"
                  error={errors.password}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  autoComplete="new-password"
                />
                <PasswordStrength password={password} />
              </div>

              <AuthInput
                label="Confirm password"
                type="password"
                placeholder="Re-enter password"
                error={errors.confirmPassword}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((p) => ({ ...p, confirmPassword: undefined }));
                }}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                className="w-full btn-enterprise"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset password"
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
                Password updated
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Redirecting to sign in...
              </p>
            </div>
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
