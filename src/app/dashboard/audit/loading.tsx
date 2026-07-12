export default function AuditLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-lg bg-muted" />
          <div className="h-4 w-48 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="h-3 w-24 rounded bg-muted/60" />
            <div className="h-6 w-12 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="h-5 w-36 rounded bg-muted" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <div className="h-8 w-8 rounded-lg bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-40 rounded bg-muted" />
              <div className="h-2 w-28 rounded bg-muted/60" />
            </div>
            <div className="h-5 w-16 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
