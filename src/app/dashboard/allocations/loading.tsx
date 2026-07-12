export default function AllocationsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded-lg bg-muted" />
          <div className="h-4 w-56 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-muted" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-9 flex-1 rounded-lg bg-muted" />
        <div className="h-9 w-24 rounded-lg bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-2 w-20 rounded bg-muted/60" />
              </div>
            </div>
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded bg-muted/60" />
              <div className="h-2 w-3/4 rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
