export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-36 rounded-lg bg-muted" />
        <div className="h-4 w-52 rounded bg-muted/60" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-lg bg-muted" />
              <div className="h-3 w-12 rounded bg-muted/60" />
            </div>
            <div className="h-7 w-16 rounded bg-muted" />
            <div className="h-2 w-24 rounded bg-muted/60" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-muted" />
              <div className="h-2 w-20 rounded bg-muted/60" />
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-48 rounded bg-muted" />
                <div className="h-2 w-32 rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-muted" />
              <div className="h-2 w-16 rounded bg-muted/60" />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className="h-7 w-7 rounded-lg bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-36 rounded bg-muted" />
                <div className="h-2 w-48 rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
