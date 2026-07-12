export default function ReportsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded-lg bg-muted" />
          <div className="h-4 w-52 rounded bg-muted/60" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="h-3 w-28 rounded bg-muted" />
            <div className="h-2 w-40 rounded bg-muted/60" />
            <div className="h-9 w-full rounded-lg bg-muted mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
