import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandPalette } from "@/components/shared/command-palette";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assetrix — Enterprise Asset & Resource Management Platform",
  description:
    "Track assets, eliminate allocation conflicts, automate maintenance workflows and manage resource bookings from a single operational platform.",
  keywords: ["asset management", "ERP", "resource management", "maintenance", "audit", "enterprise"],
  openGraph: {
    title: "Assetrix — Enterprise Asset & Resource Management Platform",
    description: "Track assets, eliminate allocation conflicts, automate maintenance workflows and manage resource bookings from a single operational platform.",
    type: "website",
    siteName: "Assetrix",
    url: "https://assetrix.vercel.app",
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
          <CommandPalette />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
