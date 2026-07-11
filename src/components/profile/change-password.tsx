"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Lock, Loader2 } from "lucide-react";
import { getPasswordStrength } from "@/components/auth/password-strength";

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ current?: string; newPass?: string; confirm?: string }>({});

  const strength = getPasswordStrength(newPass);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!current) errs.current = "Current password is required";
    if (!newPass) errs.newPass = "New password is required";
    else if (strength.score < 2) errs.newPass = "Password is too weak";
    if (newPass !== confirm) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    setCurrent(""); setNewPass(""); setConfirm("");
    setTimeout(() => setSuccess(false), 3000);
  };

  const inputClass = (error?: string) =>
    `w-full rounded-lg border bg-background px-3 py-2 pr-10 text-sm text-foreground outline-none transition-all ${
      error ? "border-destructive focus:border-destructive" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
    }`;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
        <p className="text-xs text-muted-foreground">Update your password regularly for security</p>
      </div>

      {success && (
        <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 animate-fade-in">
          Password updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Current Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="password" value={current} placeholder="Enter current password"
              onChange={(e) => { setCurrent(e.target.value); setErrors((p) => ({ ...p, current: undefined })); }}
              className={`${inputClass(errors.current)} pl-10`} />
          </div>
          {errors.current && <p className="mt-1 text-xs text-destructive">{errors.current}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">New Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="password" value={newPass} placeholder="Enter new password"
              onChange={(e) => { setNewPass(e.target.value); setErrors((p) => ({ ...p, newPass: undefined })); }}
              className={`${inputClass(errors.newPass)} pl-10`} />
          </div>
          {errors.newPass && <p className="mt-1 text-xs text-destructive">{errors.newPass}</p>}

          {newPass && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength.score ? strength.score <= 1 ? "bg-red-500" : strength.score === 2 ? "bg-amber-500" : "bg-emerald-500" : "bg-muted"
                  }`} />
                ))}
              </div>
              <div className="space-y-1">
                {rules.map((r) => {
                  const pass = r.test(newPass);
                  return (
                    <div key={r.label} className="flex items-center gap-2">
                      {pass ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-muted-foreground/50" />}
                      <span className={`text-xs ${pass ? "text-foreground" : "text-muted-foreground"}`}>{r.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Confirm New Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="password" value={confirm} placeholder="Re-enter new password"
              onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })); }}
              className={`${inputClass(errors.confirm)} pl-10`} />
          </div>
          {errors.confirm && <p className="mt-1 text-xs text-destructive">{errors.confirm}</p>}
        </div>

        <Button type="submit" size="sm" className="btn-enterprise" disabled={loading}>
          {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating...</> : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
