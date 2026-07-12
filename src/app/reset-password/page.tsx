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
    const newErrors: FormErrors = {};
    if (!password) {
      newErrors.password = "Password is required";
    } else if (getPasswordStrength(password).score < 2) {
      newErrors.password = "Password does not meet requirements";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
    setLoading(false);

    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {!success ? (
          <>
            {/* Header */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Set new password
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Choose a strong password for your account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-3">
                <AuthInput
                  label="New password"
                  type="password"
                  placeholder="Enter new password"
                  error={errors.password}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  autoComplete="new-password"
                />
                <PasswordStrength password={password} />
              </div>

              <AuthInput
                label="Confirm password"
                type="password"
                placeholder="Re-enter new password"
                error={errors.confirmPassword}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                }}
                autoComplete="new-password"
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
                    Resetting password...
                  </>
                ) : (
                  "Reset password"
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
              Password reset successful
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your password has been updated. Redirecting to sign in...
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
