"use client";

import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface Rule {
  label: string;
  test: (p: string) => boolean;
}

const rules: Rule[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "" };
  const passed = rules.filter((r) => r.test(password)).length;
  if (passed <= 2) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (passed === 3) return { score: 2, label: "Medium", color: "bg-amber-500" };
  if (passed === 4) return { score: 3, label: "Strong", color: "bg-emerald-500" };
  return { score: 4, label: "Very Strong", color: "bg-emerald-500" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-3 animate-fade-in" style={{ animationDuration: "200ms" }}>
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Password strength</span>
          <span className={`text-xs font-semibold ${
            strength.score <= 1
              ? "text-red-500"
              : strength.score === 2
              ? "text-amber-500"
              : "text-emerald-500"
          }`}>
            {strength.label}
          </span>
        </div>
        <div
          className="flex gap-1"
          role="meter"
          aria-label={`Password strength: ${strength.label}`}
          aria-valuenow={strength.score}
          aria-valuemin={0}
          aria-valuemax={4}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= strength.score ? strength.color : "bg-muted"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Rules Checklist */}
      <div className="space-y-1">
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <div key={rule.label} className="flex items-center gap-2">
              {passed ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <X className="h-3 w-3 text-muted-foreground/50" />
              )}
              <span className={`text-xs ${passed ? "text-foreground" : "text-muted-foreground"}`}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function getPasswordStrength(password: string) {
  return getStrength(password);
}
