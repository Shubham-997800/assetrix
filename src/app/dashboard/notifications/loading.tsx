export default function NotificationsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-lg bg-muted" />
          <div className="h-4 w-52 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-muted" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-7 w-20 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-border/50 px-5 py-3.5">
            <div className="h-7 w-7 rounded-lg bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-36 rounded bg-muted" />
              <div className="h-2 w-48 rounded bg-muted/60" />
              <div className="h-2 w-16 rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
