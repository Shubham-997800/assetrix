<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 — Agent Notes

This repository runs **Next.js 16** with the **App Router** and **Turbopack**. Several APIs and conventions differ from older Next.js versions. Before writing frontend code:

- Read the framework reference in the official docs: https://nextjs.org/docs/app
- Prefer **Server Components** by default; add `"use client"` only for interactive components.
- All dashboard pages live in `src/app/dashboard/**` and are client components (`"use client"`).
- The frontend proxies `/api/*` to the Express backend (see `next.config.ts` → `rewrites`). `NEXT_PUBLIC_API_URL` overrides the default `http://localhost:5000`.
- The backend lives in `backend/` (Express + Prisma) and is excluded from the frontend TypeScript config (`tsconfig.json` → `exclude: ["backend"]`).
- TypeScript is strict; do not use `any` without justification.
- The build and typecheck are separate: run `npm run build` (frontend) and `cd backend && npm run build` (backend).

Heed deprecation notices in the Next.js 16 release notes.
<!-- END:nextjs-agent-rules -->
