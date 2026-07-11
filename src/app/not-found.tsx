import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Go Home
        </Link>
        <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-muted">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
