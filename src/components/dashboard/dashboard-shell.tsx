"use client";

import { DashboardProvider, useDashboard } from "@/contexts/dashboard-context";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardNavbar } from "./dashboard-navbar";
import { GlobalSearch } from "@/components/shared/global-search";
import { AIPanel } from "@/components/shared/ai-panel";
import { MobileNav } from "@/components/shared/mobile-nav";
import { KeyboardShortcutsHelp } from "@/components/shared/keyboard-shortcuts-help";

function DashboardShellInner({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, aiPanelOpen } = useDashboard();

  return (
    <div className="relative min-h-screen bg-background">
      <GlobalSearch />
      <KeyboardShortcutsHelp />
      <DashboardSidebar />

      {/* Main area offset by sidebar */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:pl-[80px]" : "lg:pl-[280px]"}`}>
        <DashboardNavbar />
        <main id="main-content" className={`min-h-[calc(100vh-64px)] pb-24 sm:pb-20 lg:pb-6 ${aiPanelOpen ? "hidden sm:block" : ""}`} role="main">
          {children}
        </main>
      </div>

      {/* AI Panel floats over main content */}
      <AIPanel />

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </DashboardProvider>
  );
}
