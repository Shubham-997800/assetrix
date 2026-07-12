"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  ArrowRightLeft,
  Wrench,
  Archive,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  QrCode,
  Download,
  Columns3,
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import type {
  Asset,
  ColumnVisibility,
  SortField,
  SortDirection,
} from "./types";
import { STATUS_BADGE_CLASSES, DEFAULT_COLUMNS } from "./types";
import { CATEGORIES, DEPARTMENTS, LOCATIONS } from "./data";
import { MultiDropdown, TableDropdown } from "./table-dropdown";
import { AssetQRModal } from "./asset-qr-modal";

interface AssetDirectoryTableProps {
  assets: Asset[];
  onViewAsset: (asset: Asset) => void;
  onRegisterAsset: () => void;
}

const PAGE_SIZE = 10;

type FilterState = {
  category: string[];
  status: string[];
  department: string[];
  location: string[];
  shared: string;
  bookable: string;
  warranty: string;
};

const INITIAL_FILTERS: FilterState = {
  category: [],
  status: [],
  department: [],
  location: [],
  shared: "",
  bookable: "",
  warranty: "",
};

interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  columns: ColumnVisibility;
}

const DEFAULT_SAVED_VIEWS: SavedView[] = [
  {
    id: "sv-1",
    name: "All IT Equipment",
    filters: { ...INITIAL_FILTERS, category: ["IT Equipment"] },
    columns: DEFAULT_COLUMNS,
  },
  {
    id: "sv-2",
    name: "Under Maintenance",
    filters: { ...INITIAL_FILTERS, status: ["Under Maintenance"] },
    columns: DEFAULT_COLUMNS,
  },
];

const STATUS_OPTIONS = [
  "Available",
  "Allocated",
  "Reserved",
  "Under Maintenance",
  "Lost",
  "Retired",
  "Disposed",
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isWarrantyActive(expiry: string) {
  return new Date(expiry) > new Date();
}

export function AssetDirectoryTable({
  assets,
  onViewAsset,
  onRegisterAsset,
}: AssetDirectoryTableProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [columns, setColumns] = useState<ColumnVisibility>(DEFAULT_COLUMNS);
  const [sortField, setSortField] = useState<SortField>("tag");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [savedViews, setSavedViews] = useState<SavedView[]>(DEFAULT_SAVED_VIEWS);
  const [viewName, setViewName] = useState("");
  const [qrModal, setQrModal] = useState<{ tag: string; name: string } | null>(null);

  const activeFilterCount =
    filters.category.length +
    filters.status.length +
    filters.department.length +
    filters.location.length +
    (filters.shared ? 1 : 0) +
    (filters.bookable ? 1 : 0) +
    (filters.warranty ? 1 : 0);

  const filtered = useMemo(() => {
    let result = [...assets];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.tag.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.serialNumber.toLowerCase().includes(q) ||
          a.qrCode.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.currentHolder && a.currentHolder.toLowerCase().includes(q))
      );
    }

    if (filters.category.length)
      result = result.filter((a) => filters.category.includes(a.category));
    if (filters.status.length)
      result = result.filter((a) => filters.status.includes(a.status));
    if (filters.department.length)
      result = result.filter((a) => filters.department.includes(a.department));
    if (filters.location.length)
      result = result.filter((a) => filters.location.includes(a.location));
    if (filters.shared === "yes")
      result = result.filter((a) => a.sharedResource);
    if (filters.shared === "no")
      result = result.filter((a) => !a.sharedResource);
    if (filters.bookable === "yes")
      result = result.filter((a) => a.bookableResource);
    if (filters.bookable === "no")
      result = result.filter((a) => !a.bookableResource);
    if (filters.warranty === "active")
      result = result.filter((a) => isWarrantyActive(a.warrantyExpiry));
    if (filters.warranty === "expired")
      result = result.filter((a) => !isWarrantyActive(a.warrantyExpiry));

    result.sort((a, b) => {
      let av = a[sortField] ?? "";
      let bv = b[sortField] ?? "";
      if (typeof av === "string") av = av.toLowerCase() as string;
      if (typeof bv === "string") bv = bv.toLowerCase() as string;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [assets, search, filters, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const exportCSV = () => {
    const headers = [
      "Asset Tag",
      "Name",
      "Category",
      "Department",
      "Holder",
      "Location",
      "Status",
      "Condition",
      "Acquisition Date",
      "Cost",
    ];
    const rows = filtered.map((a) => [
      a.tag,
      a.name,
      a.category,
      a.department,
      a.currentHolder ?? "—",
      a.location,
      a.status,
      a.condition,
      a.acquisitionDate,
      String(a.acquisitionCost),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asset-directory-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const lines = [
      "ASSET DIRECTORY REPORT",
      `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      `Total Assets: ${filtered.length}`,
      "",
      "─".repeat(100),
    ];
    filtered.forEach((a) => {
      lines.push(`${a.tag} | ${a.name}`);
      lines.push(`  Category: ${a.category} | Dept: ${a.department} | Status: ${a.status}`);
      lines.push(`  Holder: ${a.currentHolder ?? "—"} | Location: ${a.location}`);
      lines.push(`  Serial: ${a.serialNumber} | Cost: ${formatCurrency(a.acquisitionCost)}`);
      lines.push("");
    });
    lines.push("─".repeat(100));
    lines.push("END OF REPORT");
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asset-directory-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveCurrentView = () => {
    if (!viewName.trim()) return;
    const sv: SavedView = {
      id: `sv-${Date.now()}`,
      name: viewName.trim(),
      filters: { ...filters },
      columns: { ...columns },
    };
    setSavedViews((prev) => [...prev, sv]);
    setViewName("");
  };

  const loadView = (sv: SavedView) => {
    setFilters(sv.filters);
    setColumns(sv.columns);
    setShowSavedViews(false);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearch("");
    setPage(1);
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field)
      return <ChevronsUpDown className="h-3 w-3 text-muted-foreground/50" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-primary" />
    ) : (
      <ChevronDown className="h-3 w-3 text-primary" />
    );
  };

  const columnsConfig: { key: SortField; label: string; hide?: boolean }[] = [
    { key: "tag", label: "Asset Tag" },
    { key: "name", label: "Asset Name" },
    { key: "category", label: "Category", hide: true },
    { key: "department", label: "Department", hide: true },
    { key: "currentHolder", label: "Current Holder", hide: true },
    { key: "location", label: "Location", hide: true },
    { key: "status", label: "Status" },
    { key: "condition", label: "Condition", hide: true },
    { key: "acquisitionDate", label: "Acquisition Date", hide: true },
    { key: "updatedAt", label: "Last Updated", hide: true },
  ];

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by tag, name, serial, department..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="btn-enterprise"
                onClick={() => setQrModal({ tag: "QR-SCAN", name: "QR Code Scanner" })}
              >
                <QrCode className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">QR Search</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`btn-enterprise ${showFilters ? "border-primary text-primary" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`btn-enterprise ${showColumns ? "border-primary text-primary" : ""}`}
                onClick={() => setShowColumns(!showColumns)}
              >
                <Columns3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Columns</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="btn-enterprise"
                onClick={() => setShowSavedViews(!showSavedViews)}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Views</span>
              </Button>
              <div className="relative group">
                <Button variant="outline" size="sm" className="btn-enterprise">
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <div className="absolute right-0 top-full z-50 mt-1 hidden w-40 overflow-hidden rounded-lg border border-border bg-card shadow-md group-hover:block">
                  <button
                    onClick={exportCSV}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={exportPDF}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
              <Button size="sm" className="btn-enterprise" onClick={onRegisterAsset}>
                <Plus className="h-3.5 w-3.5" /> Register Asset
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-b border-border bg-muted/30 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-foreground">Advanced Filters</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MultiDropdown
                label="Category"
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                value={filters.category}
                onChange={(v) => { setFilters((f) => ({ ...f, category: v })); setPage(1); }}
              />
              <MultiDropdown
                label="Status"
                options={STATUS_OPTIONS.map((s) => ({ label: s, value: s }))}
                value={filters.status}
                onChange={(v) => { setFilters((f) => ({ ...f, status: v })); setPage(1); }}
              />
              <MultiDropdown
                label="Department"
                options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
                value={filters.department}
                onChange={(v) => { setFilters((f) => ({ ...f, department: v })); setPage(1); }}
              />
              <MultiDropdown
                label="Location"
                options={LOCATIONS.map((l) => ({ label: l, value: l }))}
                value={filters.location}
                onChange={(v) => { setFilters((f) => ({ ...f, location: v })); setPage(1); }}
              />
              <TableDropdown
                label="Shared Resource"
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
                value={filters.shared}
                onChange={(v) => { setFilters((f) => ({ ...f, shared: v })); setPage(1); }}
                placeholder="All"
              />
              <TableDropdown
                label="Bookable Resource"
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
                value={filters.bookable}
                onChange={(v) => { setFilters((f) => ({ ...f, bookable: v })); setPage(1); }}
                placeholder="All"
              />
              <TableDropdown
                label="Warranty Status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Expired", value: "expired" },
                ]}
                value={filters.warranty}
                onChange={(v) => { setFilters((f) => ({ ...f, warranty: v })); setPage(1); }}
                placeholder="All"
              />
            </div>
          </div>
        )}

        {/* Column Visibility Panel */}
        {showColumns && (
          <div className="border-b border-border bg-muted/30 px-4 py-4 sm:px-6">
            <p className="mb-3 text-xs font-medium text-foreground">Column Visibility</p>
            <div className="flex flex-wrap gap-2">
              {columnsConfig.map((col) => (
                <button
                  key={col.key}
                  onClick={() =>
                    setColumns((prev) => ({ ...prev, [col.key]: !prev[col.key] }))
                  }
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    columns[col.key]
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {columns[col.key] && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Saved Views Panel */}
        {showSavedViews && (
          <div className="border-b border-border bg-muted/30 px-4 py-4 sm:px-6">
            <p className="mb-3 text-xs font-medium text-foreground">Saved Views</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {savedViews.map((sv) => (
                <button
                  key={sv.id}
                  onClick={() => loadView(sv)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <Bookmark className="h-3 w-3 text-primary" />
                  {sv.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="View name..."
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                className="h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary sm:w-48"
              />
              <Button
                variant="outline"
                size="sm"
                className="btn-enterprise"
                onClick={saveCurrentView}
                disabled={!viewName.trim()}
              >
                Save Current View
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {columnsConfig
                  .filter((col) => columns[col.key])
                  .map((col) => (
                    <th
                      key={col.key}
                      className="cursor-pointer select-none px-3 py-3 text-xs font-medium text-muted-foreground hover:text-foreground sm:px-6"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortIcon(col.key)}
                      </div>
                    </th>
                  ))}
                <th className="px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnsConfig.filter((c) => columns[c.key]).length + 1}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-muted-foreground/30" />
                      <p className="mt-2 text-sm font-medium text-foreground">
                        No assets found
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="btn-enterprise mt-3"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                  >
                    {columns.tag && (
                      <td className="px-3 py-3 font-medium text-foreground sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{asset.tag}</span>
                          <button
                            onClick={() => setQrModal({ tag: asset.tag, name: asset.name })}
                            className="rounded p-0.5 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-primary"
                            title="View QR Code"
                          >
                            <QrCode className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    )}
                    {columns.name && (
                      <td className="px-3 py-3 sm:px-6">
                        <div>
                          <p className="font-medium text-foreground">{asset.name}</p>
                          <p className="text-[11px] text-muted-foreground">{asset.manufacturer}</p>
                        </div>
                      </td>
                    )}
                    {columns.category && (
                      <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">
                        {asset.category}
                      </td>
                    )}
                    {columns.department && (
                      <td className="hidden px-3 py-3 text-muted-foreground md:table-cell sm:px-6">
                        {asset.department}
                      </td>
                    )}
                    {columns.currentHolder && (
                      <td className="hidden px-3 py-3 md:table-cell sm:px-6">
                        {asset.currentHolder ? (
                          <span className="text-foreground">{asset.currentHolder}</span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                    )}
                    {columns.location && (
                      <td className="hidden px-3 py-3 text-muted-foreground lg:table-cell sm:px-6">
                        {asset.location}
                      </td>
                    )}
                    {columns.status && (
                      <td className="px-3 py-3 sm:px-6">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[asset.status]}`}
                        >
                          {asset.status}
                        </span>
                      </td>
                    )}
                    {columns.condition && (
                      <td className="hidden px-3 py-3 text-muted-foreground xl:table-cell sm:px-6">
                        {asset.condition}
                      </td>
                    )}
                    {columns.acquisitionDate && (
                      <td className="hidden px-3 py-3 text-muted-foreground xl:table-cell sm:px-6">
                        {formatDate(asset.acquisitionDate)}
                      </td>
                    )}
                    {columns.updatedAt && (
                      <td className="hidden px-3 py-3 text-muted-foreground xl:table-cell sm:px-6">
                        {formatDate(asset.updatedAt)}
                      </td>
                    )}
                    <td className="px-3 py-3 sm:px-6">
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="btn-enterprise"
                          title="View Details"
                          onClick={() => onViewAsset(asset)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="btn-enterprise"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="btn-enterprise"
                          title="Allocate"
                          disabled={asset.status !== "Available"}
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="btn-enterprise"
                          title="Maintenance"
                        >
                          <Wrench className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="btn-enterprise text-destructive hover:text-destructive"
                          title="Retire"
                          disabled={
                            asset.status === "Retired" || asset.status === "Disposed"
                          }
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row sm:px-6">
            <span className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} assets
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - page) <= 1
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`e-${i}`} className="px-1 text-xs text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      className={p === page ? "btn-enterprise" : ""}
                      onClick={() => setPage(p as number)}
                    >
                      {p}
                    </Button>
                  )
                )}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {qrModal && (
        <AssetQRModal
          open={!!qrModal}
          onClose={() => setQrModal(null)}
          assetTag={qrModal.tag}
          assetName={qrModal.name}
        />
      )}
    </>
  );
}
