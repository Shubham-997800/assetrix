import dynamicImport from "next/dynamic";
import { Suspense } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";

export const dynamic = "force-static";

const Features = dynamicImport(() => import("@/components/landing/features").then((m) => m.Features));
const PlatformArchitecture = dynamicImport(
  () => import("@/components/landing/architecture").then((m) => m.PlatformArchitecture),
);
const AIIntelligence = dynamicImport(
  () => import("@/components/landing/ai-intelligence").then((m) => m.AIIntelligence),
);
const DashboardShowcase = dynamicImport(
  () => import("@/components/landing/dashboard-showcase").then((m) => m.DashboardShowcase),
);
const Workflow = dynamicImport(() => import("@/components/landing/workflow").then((m) => m.Workflow));
const Analytics = dynamicImport(() => import("@/components/landing/analytics").then((m) => m.Analytics));
const Footer = dynamicImport(() => import("@/components/landing/footer").then((m) => m.Footer));

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Suspense>
          <Features />
        </Suspense>
        <Suspense>
          <PlatformArchitecture />
        </Suspense>
        <Suspense>
          <AIIntelligence />
        </Suspense>
        <Suspense>
          <DashboardShowcase />
        </Suspense>
        <Suspense>
          <Workflow />
        </Suspense>
        <Suspense>
          <Analytics />
        </Suspense>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
}
