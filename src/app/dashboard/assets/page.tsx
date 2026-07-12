"use client";

import { useState } from "react";
import { MOCK_ASSETS } from "./_components/data";
import { AssetDirectoryTable } from "./_components/asset-directory-table";
import { RegisterAssetForm } from "./_components/register-asset-form";
import { AssetDetailsView } from "./_components/asset-details-view";
import { AssetLifecycleTab } from "./_components/asset-lifecycle-tab";
import type { Asset } from "./_components/types";

type View = "directory" | "register" | "details" | "lifecycle";

export default function AssetsPage() {
  const [view, setView] = useState<View>("directory");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setView("details");
  };

  const handleRegisterAsset = () => {
    setView("register");
  };

  const handleRegisterSubmit = () => {
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

      {/* Directory Tab */}
      {view === "directory" && (
        <AssetDirectoryTable
          assets={MOCK_ASSETS}
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
      {view === "lifecycle" && (
        <AssetLifecycleTab assets={MOCK_ASSETS} />
      )}
    </div>
  );
}
