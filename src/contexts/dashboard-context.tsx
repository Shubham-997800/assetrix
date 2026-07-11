"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface DashboardContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  sidebarCollapsed: false,
  toggleSidebar: () => {},
  mobileDrawerOpen: false,
  setMobileDrawerOpen: () => {},
  commandOpen: false,
  setCommandOpen: () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((p) => !p), []);

  return (
    <DashboardContext.Provider
      value={{ sidebarCollapsed, toggleSidebar, mobileDrawerOpen, setMobileDrawerOpen, commandOpen, setCommandOpen }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
