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
import { PrivacyDialog } from "@/components/shared/privacy-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, User } from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

const workflowSteps = [
  "You create an Employee account",
  "Admin reviews your registration",
  "Admin assigns your role and department",
  "You receive access to your workspace",
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [privacyType, setPrivacyType] = useState<"privacy" | "terms">("privacy");

  const openDialog = (type: "privacy" | "terms") => {
    setPrivacyType(type);
    setPrivacyOpen(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid work email address";
    }
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
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    await new Promise((r) => setTimeout(r, 2000));
    router.push("/verify-email");
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Join your organization&apos;s workspace
          </p>
        </div>

        {/* Error Banner */}
        {errors.general && (
          <div
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 animate-fade-in"
            role="alert"
          >
            <p className="text-sm text-destructive">{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthInput
            label="Full name"
            type="text"
            placeholder="John Doe"
            icon={<User className="h-4 w-4" />}
            error={errors.name}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name)
                setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            autoComplete="name"
          />

          <AuthInput
            label="Work email"
            type="email"
            placeholder="john@company.com"
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

          <div className="space-y-3">
            <AuthInput
              label="Password"
              type="password"
              placeholder="Create a strong password"
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
            placeholder="Re-enter your password"
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

          {/* Terms */}
          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terms)
                    setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => openDialog("terms")}
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => openDialog("privacy")}
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-destructive" role="alert">
                {errors.terms}
              </p>
            )}
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        {/* Role Assignment Workflow */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            How access works
          </p>
          <div className="mt-3 space-y-2.5">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {i + 1}
                </div>
                <p className="text-xs text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </div>

      <PrivacyDialog
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        type={privacyType}
      />
    </AuthLayout>
  );
}
