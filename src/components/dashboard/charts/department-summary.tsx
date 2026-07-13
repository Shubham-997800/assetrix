import { useMemo } from "react";
import { Building2, Users, Wrench, AlertTriangle } from "lucide-react";
import { departments } from "./dashboard-data";

export function DepartmentSummary() {
  const maxAssets = useMemo(() => Math.max(...departments.map((d) => d.assets)), []);

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
      <div className="mt-4 space-y-3">
        {departments.map((d) => (
          <div
            key={d.name}
            className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {d.name}
              </span>
              <span className="text-xs font-semibold text-primary">
                {d.assets}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/60 transition-all duration-500"
                style={{ width: `${(d.assets / maxAssets) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {d.employees}
              </span>
              <span className="flex items-center gap-1">
                <Wrench className="h-3 w-3" />
                {d.maintenance}
              </span>
              {d.overdue > 0 && (
                <span className="flex items-center gap-1 text-red-500">
                  <AlertTriangle className="h-3 w-3" />
                  {d.overdue} overdue
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
