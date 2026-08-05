export default function LogsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-lg bg-muted" />
          <div className="h-4 w-48 rounded bg-muted/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-lg bg-muted" />
          <div className="h-9 w-24 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-24 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border/50 px-5 py-3">
            <div className="h-7 w-7 rounded-full bg-muted flex-shrink-0" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-3 w-1/2 max-w-[160px] rounded bg-muted" />
              <div className="h-2 w-2/3 max-w-[224px] rounded bg-muted/60" />
            </div>
            <div className="h-3 w-16 flex-shrink-0 rounded bg-muted/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
