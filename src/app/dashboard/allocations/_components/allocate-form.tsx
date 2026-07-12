"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  User,
  Building2,
  Calendar,
  FileText,
  Package,
  AlertCircle,
} from "lucide-react";
import { TableDropdown } from "@/app/dashboard/assets/_components/table-dropdown";
import {
  AVAILABLE_ASSETS,
  ALLOCATED_ASSETS,
  EMPLOYEES,
  DEPARTMENTS,
} from "./data";
import type { Allocation } from "./types";

interface AllocateAssetFormProps {
  existingAllocations: Allocation[];
  onSubmit: () => void;
  onCancel: () => void;
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelCls = "text-xs font-medium text-foreground";

export function AllocateAssetForm({
  existingAllocations,
  onSubmit,
  onCancel,
}: AllocateAssetFormProps) {
  const [assetId, setAssetId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [allocDate, setAllocDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [returnDate, setReturnDate] = useState("");
  const [notes, setNotes] = useState("");
  const [conflict, setConflict] = useState<{
    asset: string;
    holder: string;
    dept: string;
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allAssets = [...AVAILABLE_ASSETS, ...ALLOCATED_ASSETS];

  const selectedAsset = allAssets.find((a) => a.id === assetId);
  const selectedEmployee = EMPLOYEES.find((e) => e.id === employeeId);

  const isAllocated = ALLOCATED_ASSETS.some((a) => a.id === assetId);

  const handleAssetChange = (id: string) => {
    setAssetId(id);
    setConflict(null);

    if (ALLOCATED_ASSETS.some((a) => a.id === id)) {
      const asset = ALLOCATED_ASSETS.find((a) => a.id === id);
      const alloc = existingAllocations.find(
        (a) => a.assetTag === asset?.tag && a.status !== "Returned"
      );
      setConflict({
        asset: asset?.name ?? "",
        holder: alloc?.employee ?? "Current holder",
        dept: alloc?.department ?? asset?.department ?? "",
      });
    }
  };

  const handleEmployeeChange = (id: string) => {
    setEmployeeId(id);
    const emp = EMPLOYEES.find((e) => e.id === id);
    if (emp) setDepartment(emp.department);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!assetId) errs.asset = "Select an asset";
    if (!employeeId) errs.employee = "Select an employee";
    if (!allocDate) errs.date = "Allocation date required";
    if (!returnDate) errs.returnDate = "Expected return date required";
    if (isAllocated) errs.conflict = "This asset is already allocated";
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
          Asset Allocated Successfully
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {selectedAsset?.name} has been assigned to {selectedEmployee?.name}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Conflict Warning */}
      {conflict && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
                Allocation Blocked
              </h3>
              <p className="mt-1 text-sm text-foreground">
                This asset is currently allocated to:
              </p>
              <div className="mt-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {conflict.holder
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {conflict.holder}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conflict.dept} Department
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Direct allocation of an already-allocated asset is not allowed.
                Create a transfer request instead.
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="btn-enterprise">
                  <ArrowLeftRight className="h-3.5 w-3.5" /> Create Transfer Request
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="btn-enterprise"
                  onClick={() => setConflict(null)}
                >
                  View Allocation Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Allocate Asset
            </h3>
            <p className="text-xs text-muted-foreground">
              Assign an available asset to an employee
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <TableDropdown
              label="Select Asset *"
              options={allAssets.map((a) => ({
                label: `${a.tag} — ${a.name}`,
                value: a.id,
              }))}
              value={assetId}
              onChange={handleAssetChange}
              placeholder="Choose an asset"
            />
            {errors.asset && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.asset}
              </p>
            )}
            {selectedAsset && !isAllocated && (
              <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Available
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Location: {selectedAsset.location}</span>
                  <span>Dept: {selectedAsset.department}</span>
                </div>
              </div>
            )}
            {isAllocated && (
              <div className="mt-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                  Already Allocated
                </span>
              </div>
            )}
          </div>

          <div>
            <TableDropdown
              label="Select Employee *"
              options={EMPLOYEES.map((e) => ({
                label: `${e.name} — ${e.department}`,
                value: e.id,
              }))}
              value={employeeId}
              onChange={handleEmployeeChange}
              placeholder="Choose an employee"
            />
            {errors.employee && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.employee}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>Department</label>
            <div className="mt-1.5 flex h-9 items-center rounded-lg border border-border bg-muted/30 px-3">
              <Building2 className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {department || "—"}
              </span>
            </div>
          </div>

          <div>
            <label className={labelCls}>Allocation Date *</label>
            <input
              type="date"
              className={inputCls + " mt-1.5"}
              value={allocDate}
              onChange={(e) => setAllocDate(e.target.value)}
            />
            {errors.date && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.date}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>Expected Return Date *</label>
            <input
              type="date"
              className={inputCls + " mt-1.5"}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={allocDate}
            />
            {errors.returnDate && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {errors.returnDate}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Allocation Notes</label>
            <textarea
              className={inputCls + " mt-1.5 resize-none"}
              rows={3}
              placeholder="Optional notes about this allocation"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button
          size="default"
          className="btn-enterprise"
          onClick={handleSubmit}
          disabled={!!conflict}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" /> Confirm Allocation
        </Button>
        <Button
          variant="outline"
          size="default"
          className="btn-enterprise"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
