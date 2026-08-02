import { useMemo } from "react";
import { Building2, Package } from "lucide-react";
import type { DepartmentAssetCount } from "@/lib/types";

export function DepartmentSummary({ departments }: { departments?: DepartmentAssetCount[] }) {
  const list = departments ?? [];

  const maxAssets = useMemo(() => {
    if (!departments || departments.length === 0) return 0;
    return Math.max(...departments.map((d) => d._count.assets));
  }, [departments]);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Department Summary
            </h3>
            <p className="text-xs text-muted-foreground">
              Assets per department
            </p>
          </div>
        </div>
      </div>
      {list.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
          No departments created yet.
        </p>
      ) : (
      <div className="mt-4 space-y-3">
        {list.map((d) => (
          <div
            key={d.id}
            className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {d.name}
              </span>
              <span className="text-xs font-semibold text-primary">
                {d._count.assets}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/60 transition-all duration-500"
                style={{ width: `${maxAssets > 0 ? (d._count.assets / maxAssets) * 100 : 0}%` }}
              />
            </div>
            <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {d._count.assets} assets
              </span>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
