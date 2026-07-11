"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Security", "API", "Documentation", "Blog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Partners", "Press"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
];

const socialLinks = [
  { label: "X (Twitter)", abbr: "X", href: "#" },
  { label: "LinkedIn", abbr: "Li", href: "#" },
  { label: "GitHub", abbr: "Gh", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Nexus homepage">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Nexus
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The enterprise operating system for workflow automation, AI
              insights, and real-time analytics.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.abbr}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  {social.abbr}
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border py-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Nexus Platform, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
