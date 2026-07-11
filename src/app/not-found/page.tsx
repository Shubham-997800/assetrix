"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <FileX className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h1 className="mt-8 text-6xl font-bold text-foreground">404</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
