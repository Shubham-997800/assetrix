"use client";

import React, { memo, useMemo } from "react";
import { DashboardProvider, useDashboard } from "@/contexts/dashboard-context";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardNavbar } from "./dashboard-navbar";
import { GlobalSearch } from "@/components/shared/global-search";
import { AIPanel } from "@/components/shared/ai-panel";
import { MobileNav } from "@/components/shared/mobile-nav";
import { KeyboardShortcutsHelp } from "@/components/shared/keyboard-shortcuts-help";

const COLLAPSED_OFFSET = "lg:pl-[80px]";
const EXPANDED_OFFSET = "lg:pl-[280px]";

const DashboardShellInner = memo(function DashboardShellInner({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, aiPanelOpen } = useDashboard();

  const mainWrapperClassName = useMemo(
    () => `transition-all duration-300 ${sidebarCollapsed ? COLLAPSED_OFFSET : EXPANDED_OFFSET}`,
    [sidebarCollapsed],
  );

  const mainClassName = useMemo(
    () => `min-h-[calc(100vh-64px)] pb-24 sm:pb-20 lg:pb-6 ${aiPanelOpen ? "hidden sm:block" : ""}`,
    [aiPanelOpen],
  );

  return (
    <div className="relative min-h-screen bg-background">
      <GlobalSearch />
      <KeyboardShortcutsHelp />
      <DashboardSidebar />

      <div className={mainWrapperClassName}>
        <DashboardNavbar />
        <main id="main-content" className={mainClassName} role="main">
          {children}
        </main>
      </div>

      <AIPanel />
      <MobileNav />
    </div>
  );
});

const DashboardShell = memo(function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </DashboardProvider>
  );
});

export { DashboardShell };
