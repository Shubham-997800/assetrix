export default function BookingsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-lg bg-muted" />
          <div className="h-4 w-52 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-muted" />
      </div>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-7 w-16 rounded-lg bg-muted" />
            <div className="h-7 w-16 rounded-lg bg-muted" />
          </div>
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <div className="flex flex-col items-center space-y-1">
                <div className="h-3 w-10 rounded bg-muted" />
                <div className="h-2 w-8 rounded bg-muted/60" />
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 rounded bg-muted" />
                <div className="h-2 w-24 rounded bg-muted/60" />
              </div>
              <div className="h-5 w-20 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
