"use client";

import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { ReportTabs } from "./_components/report-tabs";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Assetrix ERP — Asset intelligence and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-enterprise"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          <Button size="sm" className="btn-enterprise"><Download className="h-3.5 w-3.5" /> Export All</Button>
        </div>
      </div>
      <ReportTabs />
    </div>
  );
}
