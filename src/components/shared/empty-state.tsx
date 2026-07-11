"use client";

import { FileX, SearchX, Bell, Activity, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateType = "no-data" | "no-results" | "no-notifications" | "no-activity" | "first-time";

const configs: Record<EmptyStateType, {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: string;
}> = {
  "no-data": {
    icon: FileX,
    title: "No data yet",
    description: "Create your first record to get started. Everything you add will appear here.",
    action: "Create Record",
  },
  "no-results": {
    icon: SearchX,
    title: "No results found",
    description: "Try adjusting your search terms or filters to find what you are looking for.",
  },
  "no-notifications": {
    icon: Bell,
    title: "All caught up",
    description: "No new notifications. We will let you know when something needs your attention.",
  },
  "no-activity": {
    icon: Activity,
    title: "No activity yet",
    description: "Activity from your team will appear here once workflows start running.",
  },
  "first-time": {
    icon: Rocket,
    title: "Welcome to Nexus",
    description: "Get started by connecting your first data source and creating a workflow.",
    action: "Get Started",
  },
};

export function EmptyState({ type = "no-data" }: { type?: EmptyStateType }) {
  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">
        {config.title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {config.description}
      </p>
      {config.action && (
        <Button size="sm" className="mt-5">
          {config.action}
        </Button>
      )}
    </div>
  );
}
