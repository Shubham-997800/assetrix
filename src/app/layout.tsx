import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { CommandPalette } from "@/components/shared/command-palette";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export const metadata: Metadata = {
  title: "Assetrix — Enterprise Asset & Resource Management Platform",
  description:
    "Track assets, eliminate allocation conflicts, automate maintenance workflows and manage resource bookings from a single operational platform.",
  keywords: ["asset management", "ERP", "resource management", "maintenance", "audit", "enterprise"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://assetrix.vercel.app"),
  openGraph: {
    title: "Assetrix — Enterprise Asset & Resource Management Platform",
    description: "Track assets, eliminate allocation conflicts, automate maintenance workflows and manage resource bookings from a single operational platform.",
    type: "website",
    siteName: "Assetrix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assetrix — Enterprise Asset & Resource Management Platform",
    description: "Track assets, eliminate allocation conflicts, automate maintenance workflows and manage resource bookings from a single operational platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <CommandPalette />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
