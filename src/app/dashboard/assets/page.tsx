"use client";

import { useEffect, useState, useCallback } from "react";
import { assetApi } from "@/lib/api";
import { AssetDirectoryTable } from "./_components/asset-directory-table";
import { RegisterAssetForm } from "./_components/register-asset-form";
import { AssetDetailsView } from "./_components/asset-details-view";
import { AssetLifecycleTab } from "./_components/asset-lifecycle-tab";
import type { Asset, AssetStatus, AssetCondition } from "./_components/types";

type View = "directory" | "register" | "details" | "lifecycle";

const STATUS_MAP: Record<string, AssetStatus> = {
  AVAILABLE: "Available",
  ALLOCATED: "Allocated",
  MAINTENANCE: "Under Maintenance",
  RETIRED: "Retired",
  LOST: "Lost",
  STOLEN: "Lost",
};

const CONDITION_MAP: Record<string, AssetCondition> = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
  DAMAGED: "Damaged",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend assets return loosely-typed data with nested objects
function mapBackendAsset(apiAsset: Record<string, any>): Asset {
  const cat = apiAsset.category;
  const dept = apiAsset.department;
  const holder = apiAsset.allocatedTo;
  return {
    id: apiAsset.id ?? "",
    tag: apiAsset.assetTag ?? "",
    name: apiAsset.name ?? "",
    description: apiAsset.description ?? "",
    category: typeof cat === "object" && cat !== null ? cat.name : (cat ?? ""),
    condition: CONDITION_MAP[apiAsset.condition] ?? "Good",
    status: STATUS_MAP[apiAsset.status] ?? "Available",
    department: typeof dept === "object" && dept !== null ? dept.name : (dept ?? ""),
    location: apiAsset.location ?? "",
    currentHolder: holder
      ? `${holder.firstName} ${holder.lastName}`
      : null,
    serialNumber: apiAsset.serialNumber ?? "",
    manufacturer: apiAsset.manufacturer ?? "",
    modelNumber: apiAsset.model ?? "",
    barcode: apiAsset.barcode ?? "",
    qrCode: apiAsset.qrCode ?? apiAsset.assetTag ?? "",
    acquisitionDate: apiAsset.purchaseDate ?? "",
    acquisitionCost: apiAsset.purchasePrice ?? 0,
    vendor: apiAsset.vendor ?? "",
    warrantyExpiry: apiAsset.warrantyExpiry ?? "",
    purchaseRef: apiAsset.purchaseRef ?? "",
    sharedResource: apiAsset.sharedResource ?? false,
    bookableResource: apiAsset.bookableResource ?? false,
    documents: Array.isArray(apiAsset.documents)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend document shape varies
      ? apiAsset.documents.map((d: Record<string, any>) => ({
          id: d.id ?? "",
          name: d.name ?? "",
          type: d.type ?? "invoice",
          size: d.size ?? "",
          uploadedAt: d.uploadedAt ?? "",
        }))
      : [],
    createdAt: apiAsset.createdAt ?? "",
    updatedAt: apiAsset.updatedAt ?? "",
  };
}

export default function AssetsPage() {
  const [view, setView] = useState<View>("directory");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await assetApi.list({ limit: 100 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response shape varies
      const raw = res.data as any;
      const items = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : [];
      setAssets(items.map(mapBackendAsset));
    } catch (err: unknown) {
      console.error("Failed to fetch assets:", err);
      setError(err instanceof Error ? err.message : "Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setView("details");
  };

  const handleRegisterAsset = () => {
    setView("register");
  };

  const handleRegisterSubmit = () => {
    fetchAssets();
    setView("directory");
  };

  const handleBack = () => {
    setSelectedAsset(null);
    setView("directory");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Asset Directory
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and track organizational assets
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Tabs */}
      {view !== "details" && view !== "register" && (
        <div className="border-b border-border">
          <nav className="flex gap-1 overflow-x-auto" aria-label="Asset tabs">
            {[
              { id: "directory" as View, label: "All Assets" },
              { id: "register" as View, label: "Register Asset" },
              { id: "lifecycle" as View, label: "Lifecycle" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  view === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-6 animate-pulse p-6">
          <div className="rounded-xl border border-border bg-card overflow-x-auto">
            <div className="border-b border-border px-5 py-3">
              <div className="flex gap-4">
                {["w-8", "w-24", "w-32", "w-20", "w-16", "w-20", "w-16"].map((w, i) => (
                  <div key={i} className={`h-3 rounded bg-muted ${w}`} />
                ))}
              </div>
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-border/50 px-5 py-3.5">
                <div className="h-3 w-8 rounded bg-muted/60" />
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-3 w-36 rounded bg-muted" />
                <div className="h-5 w-20 rounded-full bg-muted" />
                <div className="h-3 w-16 rounded bg-muted/60" />
                <div className="h-5 w-20 rounded-full bg-muted" />
                <div className="h-3 w-12 rounded bg-muted/60" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directory Tab */}
      {!loading && view === "directory" && (
        <AssetDirectoryTable
          assets={assets}
          onViewAsset={handleViewAsset}
          onRegisterAsset={handleRegisterAsset}
        />
      )}

      {/* Register Tab */}
      {view === "register" && (
        <RegisterAssetForm
          onSubmit={handleRegisterSubmit}
          onCancel={handleBack}
        />
      )}

      {/* Details View */}
      {view === "details" && selectedAsset && (
        <AssetDetailsView asset={selectedAsset} onBack={handleBack} />
      )}

      {/* Lifecycle Tab */}
      {!loading && view === "lifecycle" && (
        <AssetLifecycleTab assets={assets} />
      )}
    </div>
  );
}
