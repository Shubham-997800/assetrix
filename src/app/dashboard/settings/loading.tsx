export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="space-y-2">
        <div className="h-7 w-28 rounded-lg bg-muted" />
        <div className="h-4 w-56 rounded bg-muted/60" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex lg:flex-col gap-1 lg:w-56">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-28 rounded-lg bg-muted" />
          ))}
        </div>
        <div className="flex-1 rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-2 w-20 rounded bg-muted/60" />
                <div className="h-9 w-full rounded-lg bg-muted" />
              </div>
            ))}
          </div>
          <div className="h-8 w-32 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
