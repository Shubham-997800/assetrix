export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="h-20 w-20 rounded-2xl bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-2 mt-4 sm:mt-0">
            <div className="h-6 w-40 rounded bg-muted" />
            <div className="h-3 w-52 rounded bg-muted/60" />
            <div className="h-2 w-32 rounded bg-muted/60" />
          </div>
          <div className="h-8 w-28 rounded-lg bg-muted mt-4 sm:mt-0" />
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-24 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="h-5 w-32 rounded bg-muted" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <div className="h-3 w-28 rounded bg-muted/60" />
            <div className="h-9 flex-1 rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
