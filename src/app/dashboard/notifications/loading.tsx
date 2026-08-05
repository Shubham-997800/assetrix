export default function NotificationsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
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
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-3 w-1/2 max-w-[144px] rounded bg-muted" />
              <div className="h-2 w-2/3 max-w-[192px] rounded bg-muted/60" />
              <div className="h-2 w-1/4 max-w-[64px] rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
