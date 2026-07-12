"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const CRUMB_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  organization: "Organization Setup",
  assets: "Asset Directory",
  allocations: "Asset Allocation",
  bookings: "Resource Booking",
  maintenance: "Maintenance",
  audit: "Audit Module",
  reports: "Reports & Analytics",
  notifications: "Notifications",
  logs: "Activity Logs",
  profile: "Profile",
  settings: "Settings",
  new: "Create New",
  edit: "Edit",
  view: "View Details",
};

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = CRUMB_MAP[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-xs" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
