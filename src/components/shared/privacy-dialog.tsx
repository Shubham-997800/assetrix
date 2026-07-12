"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface PrivacyDialogProps {
  open: boolean;
  onClose: () => void;
  type?: "privacy" | "terms";
}

const content = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "July 2026",
    sections: [
      {
        heading: "Information We Collect",
        body: "We collect your name, work email, department, and role information when you create an account. We also collect usage data such as login timestamps, pages visited, and actions performed within the platform.",
      },
      {
        heading: "How We Use Your Information",
        body: "Your information is used to provide and improve the Assetrix platform, manage your organization's asset and resource data, generate analytics reports, and send important account-related notifications.",
      },
      {
        heading: "Data Sharing",
        body: "We do not sell or share your personal data with third parties for marketing purposes. Data is only shared with service providers who assist in operating the platform, and only under strict data processing agreements.",
      },
      {
        heading: "Data Security",
        body: "All data is encrypted in transit and at rest. We implement role-based access controls, regular security audits, and continuous monitoring to protect your information.",
      },
      {
        heading: "Your Rights",
        body: "You can request access to, correction of, or deletion of your personal data at any time by contacting your system administrator or our support team.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "July 2026",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: "By accessing or using Assetrix, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.",
      },
      {
        heading: "Account Responsibilities",
        body: "You are responsible for maintaining the confidentiality of your account credentials. You must notify your administrator immediately of any unauthorized access.",
      },
      {
        heading: "Acceptable Use",
        body: "You agree to use the platform only for lawful business purposes. Unauthorized access, data manipulation, or disruption of service is strictly prohibited.",
      },
      {
        heading: "Intellectual Property",
        body: "All content, features, and functionality of the Assetrix platform are owned by Assetrix, Inc. and are protected by copyright, trademark, and other intellectual property laws.",
      },
      {
        heading: "Limitation of Liability",
        body: "Assetrix, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.",
      },
    ],
  },
};

export function PrivacyDialog({
  open,
  onClose,
  type = "privacy",
}: PrivacyDialogProps) {
  const data = content[type];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 mx-4 max-h-[80vh] w-full max-w-lg animate-scale-in overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">{data.title}</h2>
            <p className="text-xs text-muted-foreground">
              Last updated: {data.lastUpdated}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-5" style={{ maxHeight: "calc(80vh - 120px)" }}>
          {data.sections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-sm font-semibold text-foreground">
                {section.heading}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 btn-enterprise"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}
