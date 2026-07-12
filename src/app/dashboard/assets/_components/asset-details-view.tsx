"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  QrCode,
  Calendar,
  User,
  MapPin,
  Building2,
  Hash,
  Tag,
  Barcode,
  Shield,
  Clock,
  DollarSign,
  Wrench,
  FileText,
  Download,
  Image,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ArrowRight,
  Package,
} from "lucide-react";
import type {
  Asset,
} from "./types";
import {
  STATUS_BADGE_CLASSES,
  CONDITION_BADGE_CLASSES,
} from "./types";
import { MOCK_ALLOCATIONS, MOCK_MAINTENANCE, MOCK_TIMELINE } from "./data";
import { AssetQRModal } from "./asset-qr-modal";

interface AssetDetailsViewProps {
  asset: Asset;
  onBack: () => void;
}

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

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysFromNow(dateStr: string) {
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border px-4 py-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p
          className={`mt-0.5 text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

const TIMELINE_ICON_MAP: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  registered: { icon: Package, color: "text-primary", bg: "bg-primary/10" },
  allocated: { icon: User, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10" },
  transferred: { icon: ArrowRight, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
  maintenance: { icon: Wrench, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  maintenance_completed: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  audit_verified: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  returned: { icon: ArrowLeft, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  available: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  retired: { icon: Circle, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10" },
  lost: { icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
};

const PRIORITY_CLASSES: Record<string, string> = {
  Low: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  Medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  High: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Critical: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const DOC_ICONS: Record<string, React.ElementType> = {
  image: Image,
  warranty: Shield,
  invoice: FileText,
  manual: BookOpen,
  certificate: FileText,
};

export function AssetDetailsView({ asset, onBack }: AssetDetailsViewProps) {
  const [qrOpen, setQrOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const allocations = MOCK_ALLOCATIONS[asset.id] ?? [];
  const maintenance = MOCK_MAINTENANCE[asset.id] ?? [];
  const timeline = MOCK_TIMELINE[asset.id] ?? [];

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "allocation", label: "Allocation History" },
    { id: "maintenance", label: "Maintenance History" },
    { id: "documents", label: "Documents" },
    { id: "timeline", label: "Timeline" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon-sm"
              className="btn-enterprise mt-0.5"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {asset.name}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[asset.status]}`}
                >
                  {asset.status}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground">
                  {asset.tag}
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-sm text-muted-foreground">
                  {asset.manufacturer} {asset.modelNumber}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {asset.currentHolder && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> {asset.currentHolder}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> {asset.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {asset.location}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="btn-enterprise"
              onClick={() => setQrOpen(true)}
            >
              <QrCode className="h-3.5 w-3.5" /> QR Code
            </Button>
          </div>
        </div>
      </div>

      {/* Section Nav */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === s.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Section */}
      {activeSection === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Asset Information
            </h3>
            <div className="mt-4 grid gap-3">
              <InfoRow icon={Tag} label="Category" value={asset.category} />
              <InfoRow icon={Hash} label="Serial Number" value={asset.serialNumber} mono />
              <InfoRow icon={Package} label="Manufacturer" value={asset.manufacturer} />
              <InfoRow icon={Barcode} label="Model" value={asset.modelNumber} mono />
              <InfoRow icon={Tag} label="QR Code" value={asset.qrCode} mono />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Acquisition & Warranty
            </h3>
            <div className="mt-4 grid gap-3">
              <InfoRow icon={Calendar} label="Acquisition Date" value={formatDate(asset.acquisitionDate)} />
              <InfoRow icon={DollarSign} label="Acquisition Cost" value={formatCurrency(asset.acquisitionCost)} />
              <InfoRow icon={User} label="Vendor" value={asset.vendor} />
              <InfoRow icon={Shield} label="Warranty Expiry" value={formatDate(asset.warrantyExpiry)} />
              <InfoRow icon={FileText} label="Purchase Ref" value={asset.purchaseRef} mono />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Condition & Configuration
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <span className="text-xs text-muted-foreground">Condition</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CONDITION_BADGE_CLASSES[asset.condition]}`}
                >
                  {asset.condition}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <span className="text-xs text-muted-foreground">Shared Resource</span>
                <span className={`text-xs font-medium ${asset.sharedResource ? "text-primary" : "text-muted-foreground"}`}>
                  {asset.sharedResource ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <span className="text-xs text-muted-foreground">Bookable Resource</span>
                <span className={`text-xs font-medium ${asset.bookableResource ? "text-primary" : "text-muted-foreground"}`}>
                  {asset.bookableResource ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <span className="text-xs text-muted-foreground">Warranty Status</span>
                <span className={`text-xs font-medium ${daysFromNow(asset.warrantyExpiry) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {daysFromNow(asset.warrantyExpiry) > 0 ? `Active (${daysFromNow(asset.warrantyExpiry)} days)` : "Expired"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">Description</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {asset.description}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Created</p>
                <p className="text-xs font-medium text-foreground">
                  {formatDate(asset.createdAt)}
                </p>
              </div>
              <div className="rounded-lg border border-border px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Last Updated</p>
                <p className="text-xs font-medium text-foreground">
                  {formatDate(asset.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Allocation History */}
      {activeSection === "allocation" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground">Allocation History</h3>
            <p className="text-xs text-muted-foreground">
              {allocations.length} allocation record{allocations.length !== 1 ? "s" : ""}
            </p>
          </div>
          {allocations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <User className="mx-auto h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">
                No allocation records
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Employee</th>
                    <th className="hidden px-6 py-3 text-xs font-medium text-muted-foreground md:table-cell">Department</th>
                    <th className="hidden px-6 py-3 text-xs font-medium text-muted-foreground md:table-cell">Allocated</th>
                    <th className="hidden px-6 py-3 text-xs font-medium text-muted-foreground md:table-cell">Expected Return</th>
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Returned</th>
                    <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-3.5 font-medium text-foreground">{a.employee}</td>
                      <td className="hidden px-6 py-3.5 text-muted-foreground md:table-cell">{a.department}</td>
                      <td className="hidden px-6 py-3.5 text-muted-foreground md:table-cell">{formatDate(a.allocatedDate)}</td>
                      <td className="hidden px-6 py-3.5 text-muted-foreground md:table-cell">
                        {a.expectedReturn ? formatDate(a.expectedReturn) : "—"}
                      </td>
                      <td className="px-6 py-3.5">
                        {a.returnDate ? (
                          <span className="text-sm text-foreground">{formatDate(a.returnDate)}</span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            a.status === "Active"
                              ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                              : a.status === "Returned"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Maintenance History */}
      {activeSection === "maintenance" && (
        <div className="space-y-4">
          {maintenance.length === 0 ? (
            <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
              <Wrench className="mx-auto h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">
                No maintenance records
              </p>
            </div>
          ) : (
            maintenance.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        m.status === "Completed"
                          ? "bg-emerald-500/10"
                          : m.status === "In Progress"
                            ? "bg-amber-500/10"
                            : "bg-muted"
                      }`}
                    >
                      <Wrench
                        className={`h-5 w-5 ${
                          m.status === "Completed"
                            ? "text-emerald-500"
                            : m.status === "In Progress"
                              ? "text-amber-500"
                              : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {m.id}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_CLASSES[m.priority]}`}
                        >
                          {m.priority}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground">{m.issue}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>Technician: {m.technician}</span>
                        <span>·</span>
                        <span>Reported: {formatDate(m.reportedDate)}</span>
                        {m.completedDate && (
                          <>
                            <span>·</span>
                            <span>Completed: {formatDate(m.completedDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      m.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : m.status === "In Progress"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                {m.resolution && (
                  <div className="mt-4 rounded-lg border border-border bg-muted/30 px-4 py-3">
                    <p className="text-[11px] text-muted-foreground">Resolution</p>
                    <p className="mt-0.5 text-sm text-foreground">{m.resolution}</p>
                    {m.cost > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Cost: {formatCurrency(m.cost)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Documents */}
      {activeSection === "documents" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Documents</h3>
              <p className="text-xs text-muted-foreground">
                {asset.documents.length} document{asset.documents.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {asset.documents.length === 0 ? (
            <div className="mt-6 rounded-lg border-2 border-dashed border-border px-6 py-12 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">
                No documents uploaded
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {asset.documents.map((doc) => {
                const DocIcon = DOC_ICONS[doc.type] ?? FileText;
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <DocIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} · {doc.size} · {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                    <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      {activeSection === "timeline" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">Asset Timeline</h3>
          <p className="text-xs text-muted-foreground">
            Complete lifecycle history of this asset
          </p>

          {timeline.length === 0 ? (
            <div className="mt-6 px-6 py-12 text-center">
              <Clock className="mx-auto h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">
                No timeline events recorded
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-0">
              {timeline.map((event, idx) => {
                const mapping =
                  TIMELINE_ICON_MAP[event.type] ?? TIMELINE_ICON_MAP.registered;
                const Icon = mapping.icon;
                const isLast = idx === timeline.length - 1;
                return (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${mapping.bg}`}
                      >
                        <Icon className={`h-4 w-4 ${mapping.color}`} />
                      </div>
                      {!isLast && (
                        <div className="mt-1 w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className={`flex-1 ${isLast ? "" : "pb-6"}`}>
                      <p className="text-sm font-medium text-foreground">
                        {event.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {event.description}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground/70">
                        <span>{formatDateTime(event.date)}</span>
                        <span>·</span>
                        <span>{event.user}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <AssetQRModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        assetTag={asset.tag}
        assetName={asset.name}
      />
    </div>
  );
}
