"use client";

import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { ReportTabs } from "./_components/report-tabs";
import { reportApi } from "@/lib/api";
import type { ApiError } from "@/lib/api";

function ReportsPage() {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportAll = async () => {
    try {
      setExporting(true);
      setExportError(null);
      const res = await reportApi.generate({ name: "All Assets Report", type: "ASSET", format: "CSV" });
      const reportId = (res.data as { report?: { id?: string } })?.report?.id;
      if (reportId) {
        await reportApi.download(reportId, "csv");
      }
    } catch (err) {
      const apiErr = err as ApiError;
      setExportError(apiErr.message || "Failed to export reports");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Assetrix ERP &mdash; Asset intelligence and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-enterprise" onClick={handleExportAll} disabled={exporting}>
            {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} {exporting ? "Exporting..." : "Export All"}
          </Button>
        </div>
      </div>
      {exportError && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" /> {exportError}
        </div>
      )}
      <ReportTabs />
    </div>
  );
}

export default memo(ReportsPage);
