import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CommandPalette } from "@/components/shared/command-palette";

export const metadata: Metadata = {
  title: {
    template: "%s — Assetrix Dashboard",
    default: "Dashboard — Assetrix",
  },
  description: "Manage assets, maintenance, bookings, allocations, and organizational resources from the Assetrix dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <CommandPalette />
      {children}
    </DashboardShell>
  );
}
