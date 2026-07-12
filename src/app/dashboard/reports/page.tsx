"use client";

<<<<<<< HEAD
import { useState } from "react";
=======
import React from "react";
>>>>>>> 96f7f5d (perf: optimize reports, notifications, profile, logs pages)
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import { ReportTabs } from "./_components/report-tabs";
import { reportApi } from "@/lib/api";
import type { ApiError } from "@/lib/api";

<<<<<<< HEAD
export default function ReportsPage() {
  const [exporting, setExporting] = useState(false);

  const handleExportAll = async () => {
    try {
      setExporting(true);
      const res = await reportApi.generate({ type: "full", format: "csv" });
      const report = res.data as { id?: string } | undefined;
      if (report?.id) {
        await reportApi.download(report.id);
      }
    } catch (err) {
      const apiErr = err as ApiError;
      alert(apiErr.message || "Failed to export reports");
    } finally {
      setExporting(false);
    }
  };

=======
function ReportsPage() {
>>>>>>> 96f7f5d (perf: optimize reports, notifications, profile, logs pages)
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Assetrix ERP &mdash; Asset intelligence and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-enterprise" onClick={() => window.location.reload()}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          <Button size="sm" className="btn-enterprise" onClick={handleExportAll} disabled={exporting}>
            {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} {exporting ? "Exporting..." : "Export All"}
          </Button>
        </div>
      </div>
      <ReportTabs />
    </div>
  );
}

export default React.memo(ReportsPage);
