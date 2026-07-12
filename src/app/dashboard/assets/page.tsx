"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  Package,
  QrCode,
  Upload,
  ToggleLeft,
} from "lucide-react";

/* ── Data ── */

const assets = [
  { tag: "AST-001", name: "MacBook Pro 16\"", category: "IT Equipment", department: "Engineering", status: "Allocated", assignedTo: "S. Chen" },
  { tag: "AST-002", name: "Dell Monitor 27\"", category: "IT Equipment", department: "Finance", status: "Available", assignedTo: "—" },
  { tag: "AST-003", name: "CNC Machine Model X", category: "Machinery", department: "Operations", status: "Under Maintenance", assignedTo: "—" },
  { tag: "AST-004", name: "Projector Epson 4K", category: "Audio/Visual", department: "Marketing", status: "Available", assignedTo: "—" },
  { tag: "AST-005", name: "Ergonomic Chair", category: "Furniture", department: "HR", status: "Allocated", assignedTo: "A. Rivera" },
  { tag: "AST-006", name: "Toyota Hilux", category: "Vehicles", department: "Procurement", status: "Allocated", assignedTo: "M. Webb" },
  { tag: "AST-007", name: "Conference Table", category: "Furniture", department: "Operations", status: "Reserved", assignedTo: "—" },
  { tag: "AST-008", name: "HP LaserJet Pro", category: "IT Equipment", department: "Finance", status: "Available", assignedTo: "—" },
];

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Allocated: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Under Maintenance": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Reserved: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Retired: "bg-muted text-muted-foreground",
};

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20";
const selectCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20";

/* ── All Assets Tab ── */

function AllAssetsTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.tag.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64"
            />
          </div>
          <Button variant="outline" size="sm" className="btn-enterprise">
            <QrCode className="h-3.5 w-3.5" /> <span className="hidden sm:inline">QR Search</span>
          </Button>
          <Button variant="outline" size="sm" className="btn-enterprise">
            <Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
        <Button size="sm" className="btn-enterprise" onClick={() => setActiveTab("register")}>
          <Plus className="h-3.5 w-3.5" /> Register Asset
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Asset Tag", "Name", "Category", "Department", "Status", "Assigned To", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-medium text-muted-foreground sm:px-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((asset) => (
              <tr key={asset.tag} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground sm:px-6">{asset.tag}</td>
                <td className="px-4 py-3 text-foreground sm:px-6">{asset.name}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell sm:px-6">{asset.category}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell sm:px-6">{asset.department}</td>
                <td className="px-4 py-3 sm:px-6">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[asset.status] ?? "bg-muted text-muted-foreground"}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell sm:px-6">{asset.assignedTo}</td>
                <td className="px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" className="btn-enterprise"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon-sm" className="btn-enterprise"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon-sm" className="btn-enterprise text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
        <span className="text-xs text-muted-foreground">Page {page} of {totalPages || 1}</span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Register Asset Tab ── */

function RegisterAssetTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [bookable, setBookable] = useState(false);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Basic Details</h3>
        <p className="text-xs text-muted-foreground">Primary information about the asset</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Asset Name</label>
            <input className={`${inputCls} mt-1.5`} placeholder="e.g. MacBook Pro 16" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <select className={`${selectCls} mt-1.5`} defaultValue="">
              <option value="" disabled>Select category</option>
              <option>IT Equipment</option>
              <option>Machinery</option>
              <option>Audio/Visual</option>
              <option>Furniture</option>
              <option>Vehicles</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Serial Number</label>
            <input className={`${inputCls} mt-1.5`} placeholder="Manufacturer serial number" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Asset Tag</label>
            <input className={`${inputCls} mt-1.5 bg-muted/50`} value="AST-XXXX" readOnly />
            <p className="mt-1 text-[11px] text-muted-foreground">Auto-generated on submission</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Acquisition Details</h3>
        <p className="text-xs text-muted-foreground">Purchase and warranty information</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Acquisition Date</label>
            <input type="date" className={`${inputCls} mt-1.5`} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Cost</label>
            <input type="number" className={`${inputCls} mt-1.5`} placeholder="0.00" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Vendor</label>
            <input className={`${inputCls} mt-1.5`} placeholder="Supplier or vendor name" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Warranty Expiry</label>
            <input type="date" className={`${inputCls} mt-1.5`} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Documents</h3>
        <p className="text-xs text-muted-foreground">Upload invoices, warranty cards, or manuals</p>
        <div className="mt-5 flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/40 hover:bg-muted/20">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
            <p className="mt-1 text-[11px] text-muted-foreground/60">PDF, PNG, JPG up to 10MB</p>
            <Button variant="outline" size="sm" className="btn-enterprise mt-3">Choose Files</Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Bookable Resource</h3>
        <p className="text-xs text-muted-foreground">Allow this asset to be reserved by team members</p>
        <div className="mt-4 flex items-center gap-3">
          <button
            role="switch"
            aria-checked={bookable}
            onClick={() => setBookable(!bookable)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${bookable ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${bookable ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className="text-sm text-foreground">{bookable ? "Enabled" : "Disabled"}</span>
          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-5">
        <Button size="default" className="btn-enterprise">
          <Package className="h-3.5 w-3.5" /> Submit
        </Button>
        <Button variant="outline" size="default" className="btn-enterprise" onClick={() => setActiveTab("all")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

/* ── Lifecycle Tab ── */

const lifecycleStages = [
  { label: "Available", count: 36, pct: 45, color: "bg-emerald-500" },
  { label: "Allocated", count: 26, pct: 32, color: "bg-blue-500" },
  { label: "Reserved", count: 6, pct: 8, color: "bg-violet-500" },
  { label: "Under Maintenance", count: 10, pct: 12, color: "bg-amber-500" },
  { label: "Lost", count: 1, pct: 1, color: "bg-red-500" },
  { label: "Retired", count: 1, pct: 1, color: "bg-muted-foreground" },
  { label: "Disposed", count: 1, pct: 1, color: "bg-zinc-500" },
];

function LifecycleTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Asset Lifecycle Overview</h3>
        <p className="text-xs text-muted-foreground">Distribution of assets across lifecycle stages</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lifecycleStages.map((s) => (
            <div key={s.label} className="card-hover rounded-xl border border-border p-5">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${s.color}`} />
                <span className="text-sm font-medium text-foreground">{s.label}</span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{s.count}</p>
                <p className="text-xs text-muted-foreground">{s.pct}% of total assets</p>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */

const tabs = [
  { id: "all", label: "All Assets" },
  { id: "register", label: "Register Asset" },
  { id: "lifecycle", label: "Lifecycle" },
];

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Asset Directory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage and track organizational assets</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Asset tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "all" && <AllAssetsTab setActiveTab={setActiveTab} />}
      {activeTab === "register" && <RegisterAssetTab setActiveTab={setActiveTab} />}
      {activeTab === "lifecycle" && <LifecycleTab />}
    </div>
  );
}
