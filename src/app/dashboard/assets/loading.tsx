export default function AssetsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-lg bg-muted" />
          <div className="h-4 w-56 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-muted" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-9 flex-1 rounded-lg bg-muted" />
        <div className="h-9 w-24 rounded-lg bg-muted" />
        <div className="h-9 w-24 rounded-lg bg-muted" />
      </div>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <div className="border-b border-border px-5 py-3">
          <div className="flex gap-4">
            {["w-8", "w-24", "w-32", "w-20", "w-16", "w-20", "w-16"].map((w, i) => (
              <div key={i} className={`h-3 rounded bg-muted ${w}`} />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border/50 px-5 py-3.5">
            <div className="h-3 w-8 rounded bg-muted/60" />
            <div className="h-3 w-28 rounded bg-muted" />
            <div className="h-3 w-36 rounded bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="h-3 w-16 rounded bg-muted/60" />
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="h-3 w-12 rounded bg-muted/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
