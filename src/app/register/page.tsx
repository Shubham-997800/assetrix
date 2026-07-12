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
}

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
  const [privacyType, setPrivacyType] = useState<"privacy" | "terms">(
    "privacy",
  );

  const openDialog = (type: "privacy" | "terms") => {
    setPrivacyType(type);
    setPrivacyOpen(true);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = "Name is required";
    else if (name.trim().length < 2) e.name = "Min 2 characters";
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (getPasswordStrength(password).score < 2)
      e.password = "Password too weak";
    if (!confirmPassword) e.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords don't match";
    if (!acceptTerms) e.terms = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    router.push("/verify-email");
  };

  return (
    <AuthLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Create account
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Join your organization&apos;s workspace
          </p>
        </div>

        {/* Employee notice */}
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            All new accounts are created as{" "}
            <span className="font-medium text-foreground">Employee</span>{" "}
            accounts. Administrative roles are assigned internally by
            administrators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <AuthInput
            label="Full name"
            type="text"
            placeholder="John Doe"
            icon={<User className="h-4 w-4" />}
            error={errors.name}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            autoComplete="name"
          />

          <AuthInput
            label="Email"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            autoComplete="email"
          />

          <div className="space-y-2">
            <AuthInput
              label="Password"
              type="password"
              placeholder="Create a password"
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

          {/* Terms */}
          <div className="space-y-1">
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terms)
                    setErrors((p) => ({ ...p, terms: undefined }));
                }}
                className="mt-0.5 h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20"
              />
              <span>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => openDialog("terms")}
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                >
                  Terms
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => openDialog("privacy")}
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                >
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-destructive">{errors.terms}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full btn-enterprise"
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
