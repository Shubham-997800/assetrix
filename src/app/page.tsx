import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { PlatformArchitecture } from "@/components/landing/architecture";
import { AIIntelligence } from "@/components/landing/ai-intelligence";
import { DashboardShowcase } from "@/components/landing/dashboard-showcase";
import { Workflow } from "@/components/landing/workflow";
import { Analytics } from "@/components/landing/analytics";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <PlatformArchitecture />
        <AIIntelligence />
        <DashboardShowcase />
        <Workflow />
        <Analytics />
      </main>
      <Footer />
    </div>
  );
}
