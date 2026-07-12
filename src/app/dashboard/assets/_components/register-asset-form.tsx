"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { assetApi } from "@/lib/api";
import {
  Package,
  Upload,
  FileText,
  CheckCircle,
  X,
  Camera,
  File,
  FileImage,
  Shield,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { TableDropdown } from "./table-dropdown";
import { CATEGORIES, DEPARTMENTS, LOCATIONS } from "./data";
import type { AssetCondition } from "./types";

interface RegisterAssetFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const CONDITIONS: AssetCondition[] = ["Excellent", "Good", "Fair", "Poor", "Damaged"];

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";
const inputErrorCls =
  "w-full rounded-lg border border-destructive/50 bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-destructive focus:ring-2 focus:ring-destructive/20";
const labelCls = "text-xs font-medium text-foreground";
const descCls = "text-[11px] text-muted-foreground mt-1";

interface FormErrors {
  [key: string]: string;
}

function generateAssetTag() {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `AR-${num}`;
}

export function RegisterAssetForm({ onSubmit, onCancel }: RegisterAssetFormProps) {
  const [assetTag] = useState(generateAssetTag);

  const [basicDetails, setBasicDetails] = useState({
    name: "",
    description: "",
    category: "",
    condition: "" as AssetCondition | "",
    department: "",
    location: "",
  });

  const [identification, setIdentification] = useState({
    serialNumber: "",
    manufacturer: "",
    modelNumber: "",
    barcode: "",
  });

  const [acquisition, setAcquisition] = useState({
    date: "",
    cost: "",
    vendor: "",
    warrantyExpiry: "",
    purchaseRef: "",
  });

  const [files, setFiles] = useState<
    { name: string; type: string; size: string }[]
  >([]);

  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});

  const [resourceConfig, setResourceConfig] = useState({
    shared: false,
    bookable: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!basicDetails.name.trim()) errs.name = "Asset name is required";
    if (!basicDetails.category) errs.category = "Category is required";
    if (!basicDetails.condition) errs.condition = "Condition is required";
    if (!basicDetails.department) errs.department = "Department is required";
    if (!basicDetails.location) errs.location = "Location is required";
    if (!identification.serialNumber.trim())
      errs.serialNumber = "Serial number is required";
    if (!identification.manufacturer.trim())
      errs.manufacturer = "Manufacturer is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      setSubmitError(null);
      await assetApi.create({
        name: basicDetails.name,
        description: basicDetails.description || undefined,
        category: basicDetails.category,
        condition: basicDetails.condition?.toUpperCase(),
        department: basicDetails.department,
        location: basicDetails.location,
        serialNumber: identification.serialNumber,
        manufacturer: identification.manufacturer,
        model: identification.modelNumber || undefined,
        barcode: identification.barcode || undefined,
        purchaseDate: acquisition.date || undefined,
        purchasePrice: acquisition.cost ? parseFloat(acquisition.cost) : undefined,
        vendor: acquisition.vendor || undefined,
        warrantyExpiry: acquisition.warrantyExpiry || undefined,
        purchaseRef: acquisition.purchaseRef || undefined,
        sharedResource: resourceConfig.shared,
        bookableResource: resourceConfig.bookable,
      });
      setSubmitted(true);
      setTimeout(() => onSubmit(), 1500);
    } catch (err: unknown) {
      console.error("Failed to create asset:", err);
      setSubmitError(err instanceof Error ? err.message : "Failed to register asset. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    newFiles.forEach((file, idx) => {
      const fileObj = {
        name: file.name,
        type: file.type.startsWith("image/")
          ? "image"
          : file.name.endsWith(".pdf")
            ? "warranty"
            : "invoice",
        size:
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`,
      };
      const idx2 = files.length + idx;
      setFiles((prev) => [...prev, fileObj]);
      setUploadProgress((prev) => ({ ...prev, [idx2]: 0 }));

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress((prev) => ({ ...prev, [idx2]: progress }));
      }, 200);
    });
    e.target.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Asset Registered Successfully
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Asset <span className="font-mono font-medium text-foreground">{assetTag}</span> has
          been added to the inventory
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Redirecting to asset directory...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Section 1: Basic Details */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Basic Details</h3>
            <p className="text-xs text-muted-foreground">
              Primary information about the asset
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Asset Name *</label>
            <input
              className={`${errors.name ? inputErrorCls : inputCls} mt-1.5`}
              placeholder="e.g. MacBook Pro 16-inch M3 Max"
              value={basicDetails.name}
              onChange={(e) =>
                setBasicDetails((p) => ({ ...p, name: e.target.value }))
              }
            />
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} mt-1.5 resize-none`}
              rows={2}
              placeholder="Brief description of the asset"
              value={basicDetails.description}
              onChange={(e) =>
                setBasicDetails((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>
          <div>
            <TableDropdown
              label="Asset Category *"
              options={CATEGORIES.map((c) => ({ label: c, value: c }))}
              value={basicDetails.category}
              onChange={(v) =>
                setBasicDetails((p) => ({ ...p, category: v }))
              }
              placeholder="Select category"
            />
            {errors.category && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.category}
              </p>
            )}
          </div>
          <div>
            <TableDropdown
              label="Asset Condition *"
              options={CONDITIONS.map((c) => ({ label: c, value: c }))}
              value={basicDetails.condition}
              onChange={(v) =>
                setBasicDetails((p) => ({ ...p, condition: v as AssetCondition }))
              }
              placeholder="Select condition"
            />
            {errors.condition && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.condition}
              </p>
            )}
          </div>
          <div>
            <TableDropdown
              label="Department *"
              options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
              value={basicDetails.department}
              onChange={(v) =>
                setBasicDetails((p) => ({ ...p, department: v }))
              }
              placeholder="Select department"
            />
            {errors.department && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.department}
              </p>
            )}
          </div>
          <div>
            <TableDropdown
              label="Location *"
              options={LOCATIONS.map((l) => ({ label: l, value: l }))}
              value={basicDetails.location}
              onChange={(v) =>
                setBasicDetails((p) => ({ ...p, location: v }))
              }
              placeholder="Select location"
            />
            {errors.location && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Identification */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Identification</h3>
            <p className="text-xs text-muted-foreground">
              Serial numbers, tags, and tracking information
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Asset Tag</label>
            <div className="mt-1.5 flex h-9 items-center rounded-lg border border-border bg-muted/50 px-3">
              <span className="font-mono text-sm text-foreground">{assetTag}</span>
            </div>
            <p className={descCls}>Auto-generated. Cannot be edited.</p>
          </div>
          <div>
            <label className={labelCls}>Serial Number *</label>
            <input
              className={`${errors.serialNumber ? inputErrorCls : inputCls} mt-1.5`}
              placeholder="Manufacturer serial number"
              value={identification.serialNumber}
              onChange={(e) =>
                setIdentification((p) => ({ ...p, serialNumber: e.target.value }))
              }
            />
            {errors.serialNumber && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.serialNumber}
              </p>
            )}
          </div>
          <div>
            <label className={labelCls}>Manufacturer *</label>
            <input
              className={`${errors.manufacturer ? inputErrorCls : inputCls} mt-1.5`}
              placeholder="e.g. Apple Inc."
              value={identification.manufacturer}
              onChange={(e) =>
                setIdentification((p) => ({ ...p, manufacturer: e.target.value }))
              }
            />
            {errors.manufacturer && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.manufacturer}
              </p>
            )}
          </div>
          <div>
            <label className={labelCls}>Model Number</label>
            <input
              className={inputCls + " mt-1.5"}
              placeholder="e.g. MBP16-M3M-36-1TB"
              value={identification.modelNumber}
              onChange={(e) =>
                setIdentification((p) => ({ ...p, modelNumber: e.target.value }))
              }
            />
          </div>
          <div>
            <label className={labelCls}>Barcode</label>
            <input
              className={inputCls + " mt-1.5"}
              placeholder="Barcode number"
              value={identification.barcode}
              onChange={(e) =>
                setIdentification((p) => ({ ...p, barcode: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Section 3: Acquisition Details */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <File className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Acquisition Details
            </h3>
            <p className="text-xs text-muted-foreground">
              Purchase and warranty information
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Acquisition Date</label>
            <input
              type="date"
              className={inputCls + " mt-1.5"}
              value={acquisition.date}
              onChange={(e) =>
                setAcquisition((p) => ({ ...p, date: e.target.value }))
              }
            />
          </div>
          <div>
            <label className={labelCls}>Acquisition Cost ($)</label>
            <input
              type="number"
              className={inputCls + " mt-1.5"}
              placeholder="0.00"
              min="0"
              step="0.01"
              value={acquisition.cost}
              onChange={(e) =>
                setAcquisition((p) => ({ ...p, cost: e.target.value }))
              }
            />
            <p className={descCls}>Used for reports and analytics only</p>
          </div>
          <div>
            <label className={labelCls}>Vendor Name</label>
            <input
              className={inputCls + " mt-1.5"}
              placeholder="Supplier or vendor name"
              value={acquisition.vendor}
              onChange={(e) =>
                setAcquisition((p) => ({ ...p, vendor: e.target.value }))
              }
            />
          </div>
          <div>
            <label className={labelCls}>Warranty Expiry</label>
            <input
              type="date"
              className={inputCls + " mt-1.5"}
              value={acquisition.warrantyExpiry}
              onChange={(e) =>
                setAcquisition((p) => ({ ...p, warrantyExpiry: e.target.value }))
              }
            />
          </div>
          <div>
            <label className={labelCls}>Purchase Reference</label>
            <input
              className={inputCls + " mt-1.5"}
              placeholder="e.g. PO-2026-0001"
              value={acquisition.purchaseRef}
              onChange={(e) =>
                setAcquisition((p) => ({ ...p, purchaseRef: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Section 4: Documents & Media */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Upload className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Documents & Media
            </h3>
            <p className="text-xs text-muted-foreground">
              Upload invoices, warranty cards, manuals, or images
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/40 hover:bg-muted/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Camera className="h-5 w-5 text-muted-foreground/60" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              Drag and drop files here, or click to browse
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              PDF, PNG, JPG up to 10MB each
            </p>
            <Button
              variant="outline"
              size="sm"
              className="btn-enterprise mt-3"
              onClick={(e) => e.preventDefault()}
            >
              Choose Files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, idx) => {
              const progress = uploadProgress[idx] ?? 100;
              const isDone = progress >= 100;
              const icon =
                file.type === "image" ? (
                  <FileImage className="h-4 w-4" />
                ) : file.type === "warranty" ? (
                  <Shield className="h-4 w-4" />
                ) : file.type === "manual" ? (
                  <BookOpen className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                );
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-xs font-medium text-foreground">
                        {file.name}
                      </p>
                      <span className="ml-2 text-[10px] text-muted-foreground">
                        {file.size}
                      </span>
                    </div>
                    {!isDone && (
                      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {isDone ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  )}
                  <button
                    onClick={() => removeFile(idx)}
                    className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 5: Resource Configuration */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Resource Configuration
            </h3>
            <p className="text-xs text-muted-foreground">
              Configure shared and bookable settings
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Shared Resource</p>
              <p className="text-xs text-muted-foreground">
                This asset can be used by multiple team members simultaneously
              </p>
            </div>
            <button
              role="switch"
              aria-checked={resourceConfig.shared}
              onClick={() =>
                setResourceConfig((p) => ({ ...p, shared: !p.shared }))
              }
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                resourceConfig.shared ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  resourceConfig.shared ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Bookable Resource
              </p>
              <p className="text-xs text-muted-foreground">
                Team members can reserve this asset in advance through the booking
                system
              </p>
            </div>
            <button
              role="switch"
              aria-checked={resourceConfig.bookable}
              onClick={() =>
                setResourceConfig((p) => ({ ...p, bookable: !p.bookable }))
              }
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                resourceConfig.bookable ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  resourceConfig.bookable ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="rounded-lg bg-muted/30 px-4 py-3">
            <p className="text-xs font-medium text-foreground">Examples:</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {[
                {
                  name: "Meeting Room",
                  shared: true,
                  bookable: true,
                },
                {
                  name: "Laptop",
                  shared: false,
                  bookable: false,
                },
                {
                  name: "Projector",
                  shared: true,
                  bookable: true,
                },
              ].map((ex) => (
                <div
                  key={ex.name}
                  className="rounded-md border border-border bg-card px-3 py-2"
                >
                  <p className="text-xs font-medium text-foreground">{ex.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {ex.shared ? "Shared" : "Personal"} ·{" "}
                    {ex.bookable ? "Bookable" : "Not Bookable"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {submitError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}
      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button
          size="default"
          className="btn-enterprise"
          onClick={handleSubmit}
          disabled={submitting}
        >
          <Package className="h-3.5 w-3.5" /> {submitting ? "Registering..." : "Register Asset"}
        </Button>
        <Button
          variant="outline"
          size="default"
          className="btn-enterprise"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
