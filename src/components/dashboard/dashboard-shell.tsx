"use client";

import { DashboardProvider } from "@/contexts/dashboard-context";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:m-2 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardNavbar />
          <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden" role="main">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
