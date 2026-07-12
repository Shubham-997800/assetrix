export default function MaintenanceLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 rounded-lg bg-muted" />
          <div className="h-4 w-48 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-40 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="h-3 w-20 rounded bg-muted/60" />
            <div className="h-6 w-12 rounded bg-muted" />
            <div className="h-2 w-16 rounded bg-muted/60" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-3">
          <div className="flex gap-4">
            {["w-8", "w-28", "w-20", "w-24", "w-16", "w-20"].map((w, i) => (
              <div key={i} className={`h-3 rounded bg-muted ${w}`} />
            ))}
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border/50 px-5 py-3.5">
            <div className="h-3 w-8 rounded bg-muted/60" />
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="h-3 w-24 rounded bg-muted/60" />
            <div className="h-3 w-16 rounded bg-muted/60" />
            <div className="h-5 w-20 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
