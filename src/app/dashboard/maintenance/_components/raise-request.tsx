"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Upload,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { TableDropdown } from "@/app/dashboard/assets/_components/table-dropdown";
import {
  ASSET_OPTIONS,
  ISSUE_CATEGORIES,
  PRIORITY_CLASSES,
} from "./types";
import type { Priority, IssueCategory } from "./types";

interface RaiseRequestFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelCls = "text-xs font-medium text-foreground";

export function RaiseRequestForm({ onSubmit, onCancel }: RaiseRequestFormProps) {
  const [assetTag, setAssetTag] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [files, setFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedAsset = ASSET_OPTIONS.find((a) => a.tag === assetTag);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!assetTag) errs.asset = "Select an asset";
    if (!title.trim()) errs.title = "Issue title is required";
    if (!description.trim()) errs.description = "Description is required";
    if (!priority) errs.priority = "Select priority";
    if (!category) errs.category = "Select category";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => onSubmit(), 1500);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Maintenance Request Submitted
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Request will be reviewed by an Asset Manager for approval
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Raise Maintenance Request
            </h3>
            <p className="text-xs text-muted-foreground">
              Report an issue with an allocated asset
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TableDropdown
              label="Select Asset *"
              options={ASSET_OPTIONS.map((a) => ({
                label: `${a.tag} — ${a.name}`,
                value: a.tag,
              }))}
              value={assetTag}
              onChange={setAssetTag}
              placeholder="Choose the affected asset"
            />
            {errors.asset && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.asset}
              </p>
            )}
            {selectedAsset && (
              <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3">
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Department: {selectedAsset.department}</span>
                  <span>Asset: {selectedAsset.name}</span>
                </div>
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Issue Title *</label>
            <input
              className={`${errors.title ? "border-destructive/50 focus:border-destructive" : ""} ${inputCls} mt-1.5`}
              placeholder="Brief title describing the problem"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.title}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Issue Description *</label>
            <textarea
              className={`${errors.description ? "border-destructive/50 focus:border-destructive" : ""} ${inputCls} mt-1.5 resize-none`}
              rows={4}
              placeholder="Describe the issue in detail — what happened, when it started, error messages, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.description}
              </p>
            )}
          </div>

          <div>
            <TableDropdown
              label="Priority Level *"
              options={["Low", "Medium", "High", "Critical"].map((p) => ({
                label: p,
                value: p,
              }))}
              value={priority}
              onChange={(v) => setPriority(v as Priority)}
              placeholder="Select priority"
            />
            {errors.priority && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.priority}
              </p>
            )}
            {priority && (
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${PRIORITY_CLASSES[priority as Priority]}`}>
                  {priority}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {priority === "Critical" && "Immediate attention required"}
                  {priority === "High" && "Address within 24 hours"}
                  {priority === "Medium" && "Address within 3 business days"}
                  {priority === "Low" && "Schedule during normal maintenance"}
                </span>
              </div>
            )}
          </div>

          <div>
            <TableDropdown
              label="Issue Category *"
              options={ISSUE_CATEGORIES.map((c) => ({ label: c, value: c }))}
              value={category}
              onChange={(v) => setCategory(v as IssueCategory)}
              placeholder="Select category"
            />
            {errors.category && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.category}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Attachments</label>
            <label
              htmlFor="maint-upload"
              className="mt-1.5 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/40 hover:bg-muted/20"
            >
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground/50" />
                <p className="mt-1 text-xs text-muted-foreground">
                  Upload photos, videos, or documents
                </p>
              </div>
              <input
                id="maint-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const names = Array.from(e.target.files || []).map((f) => f.name);
                  setFiles((prev) => [...prev, ...names]);
                }}
              />
            </label>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-1.5">
                    <span className="text-xs text-foreground">{f}</span>
                    <button onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button size="default" className="btn-enterprise" onClick={handleSubmit}>
          <Wrench className="h-3.5 w-3.5" /> Submit Request
        </Button>
        <Button variant="outline" size="default" className="btn-enterprise" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
