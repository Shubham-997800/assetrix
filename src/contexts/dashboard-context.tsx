"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

interface FavoriteItem {
  label: string;
  href: string;
  icon: string;
}

interface RecentPage {
  label: string;
  href: string;
  timestamp: number;
}

interface DashboardContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (href: string) => void;
  recentPages: RecentPage[];
  addRecentPage: (item: { label: string; href: string }) => void;
  isLight: boolean;
  toggleTheme: () => void;
}

const defaultCtx: DashboardContextType = {
  sidebarCollapsed: false, toggleSidebar: () => {},
  mobileDrawerOpen: false, setMobileDrawerOpen: () => {},
  commandOpen: false, setCommandOpen: () => {},
  searchOpen: false, setSearchOpen: () => {},
  aiPanelOpen: false, setAiPanelOpen: () => {},
  shortcutsOpen: false, setShortcutsOpen: () => {},
  favorites: [], addFavorite: () => {}, removeFavorite: () => {},
  recentPages: [], addRecentPage: () => {},
  isLight: false, toggleTheme: () => {},
};

const DashboardContext = createContext<DashboardContextType>(defaultCtx);

export function useDashboard() {
  return useContext(DashboardContext);
}

const PAGE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/organization": "Organization Setup",
  "/dashboard/assets": "Asset Directory",
  "/dashboard/allocations": "Asset Allocation",
  "/dashboard/bookings": "Resource Booking",
  "/dashboard/maintenance": "Maintenance",
  "/dashboard/audit": "Audit Module",
  "/dashboard/reports": "Reports & Analytics",
  "/dashboard/notifications": "Notifications",
  "/dashboard/logs": "Activity Logs",
  "/dashboard/profile": "Profile",
};

function getPageLabel(href: string): string {
  if (PAGE_LABELS[href]) return PAGE_LABELS[href];
  const segments = href.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const { theme, setTheme } = useTheme();
  const [isLight, setIsLight] = useState(false);
  const pathname = usePathname();
  const hydrated = useRef(false);

  const addRecentPage = useCallback((item: { label: string; href: string }) => {
    setRecentPages((prev) => {
      const filtered = prev.filter((p) => p.href !== item.href);
      return [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 10);
    });
  }, []);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    setFavorites((prev) => {
      try {
        const stored = localStorage.getItem("assetrix-favorites");
        return stored ? JSON.parse(stored) : prev;
      } catch { return prev; }
    });
    setRecentPages((prev) => {
      try {
        const stored = localStorage.getItem("assetrix-recent-pages");
        return stored ? JSON.parse(stored) : prev;
      } catch { return prev; }
    });
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem("assetrix-favorites", JSON.stringify(favorites)); } catch { /* ignore */ }
  }, [favorites]);

  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem("assetrix-recent-pages", JSON.stringify(recentPages)); } catch { /* ignore */ }
  }, [recentPages]);

  useEffect(() => {
    setIsLight(theme === "light");
  }, [theme]);

  useEffect(() => {
    if (!hydrated.current) return;
    const label = getPageLabel(pathname);
    addRecentPage({ label, href: pathname });
  }, [pathname, addRecentPage]);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((p) => !p), []);

  const addFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.href === item.href)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFavorite = useCallback((href: string) => {
    setFavorites((prev) => prev.filter((f) => f.href !== href));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const ctxValue = useMemo(
    () => ({
      sidebarCollapsed, toggleSidebar,
      mobileDrawerOpen, setMobileDrawerOpen,
      commandOpen, setCommandOpen,
      searchOpen, setSearchOpen,
      aiPanelOpen, setAiPanelOpen,
      shortcutsOpen, setShortcutsOpen,
      favorites, addFavorite, removeFavorite,
      recentPages, addRecentPage,
      isLight, toggleTheme,
    }),
    [
      sidebarCollapsed, toggleSidebar,
      mobileDrawerOpen, commandOpen, searchOpen, aiPanelOpen, shortcutsOpen,
      favorites, addFavorite, removeFavorite,
      recentPages, addRecentPage,
      isLight, toggleTheme,
    ]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (mod && e.key === "/") { e.preventDefault(); setCommandOpen(true); }
      if (mod && e.key === "b") { e.preventDefault(); toggleSidebar(); }
      if (mod && e.shiftKey && e.key === "T") { e.preventDefault(); toggleTheme(); }
      if (mod && e.shiftKey && e.key === "P") { e.preventDefault(); window.location.href = "/dashboard/profile"; }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setCommandOpen(false);
        setAiPanelOpen(false);
        setShortcutsOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [toggleSidebar, setSearchOpen, setCommandOpen, setAiPanelOpen, setShortcutsOpen, setMobileDrawerOpen, toggleTheme]);

  return (
    <DashboardContext.Provider value={ctxValue}>
      {children}
    </DashboardContext.Provider>
  );
}
