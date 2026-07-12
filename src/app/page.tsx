import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustedBy } from "@/components/landing/trusted-by";
import { Features } from "@/components/landing/features";
import { PlatformArchitecture } from "@/components/landing/architecture";
import { AIIntelligence } from "@/components/landing/ai-intelligence";
import { DashboardShowcase } from "@/components/landing/dashboard-showcase";
import { Workflow } from "@/components/landing/workflow";
import { Security } from "@/components/landing/security";
import { DeveloperExperience } from "@/components/landing/developer-experience";
import { Performance } from "@/components/landing/performance";
import { Accessibility } from "@/components/landing/accessibility";
import { Analytics } from "@/components/landing/analytics";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <Features />
        <PlatformArchitecture />
        <AIIntelligence />
        <DashboardShowcase />
        <Workflow />
        <Security />
        <DeveloperExperience />
        <Performance />
        <Accessibility />
        <Analytics />
      </main>
      <Footer />
    </div>
  );
}
