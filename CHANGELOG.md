# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- Removed committed Vercel environment files (`.env.vercel-prod`, `.env.vercel-prod2`) that contained OIDC tokens and added them to `.gitignore`. Rotate any credentials previously exposed in repository history.
- Added `SECURITY.md` with a vulnerability disclosure process.

### Docs
- Rebuilt the root README with architecture diagrams, accurate API reference, deployment verification, and project health report.
- Rebuilt README again in a modern FlowSync-style layout: typing header, badge rows, problem statement, feature tables, screens & modules, detailed **UI Libraries & Design System** section (per-library usage), system/API architecture ASCII diagrams, database ER schema, request lifecycle, getting started, deployment, roadmap, and author section.
- Corrected README accuracy: `recharts` is declared in `package.json` but never imported — all charts are hand-built inline SVG/donut/bar components (`report-tabs.tsx`); README now documents that instead of claiming a chart library.
- Expanded README with: full **Aura Cyan** design-token system (light/dark palettes, chart/sidebar/radius tokens, typography), complete **pages & routes** list, **backend module map** (16 domains × routes/controllers/services), full backend dependency table (cors, cookie-parser, compression, dotenv) and dev-tooling list (tsx, jest, supertest, husky, lint-staged, prisma CLI).
- Added `docs/HEALTH_REPORT.md` and `docs/FINAL_REPORT.md`.
- Added `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, issue templates, and PR template.

### Fixed
- Dashboard widgets (overdue returns, activity timeline, asset status, booking preview) now consume real API data with demo fallbacks; backend dashboard stats now also return `activeBookings`, `pendingTransfers`, `overdueReturns`, and `overdueItems`.
- Command palette actions wired up (toggle sidebar, toggle theme, sign out).
- Navbar dropdowns close on Escape; aria-labels added to AI/theme/help/sidebar toggles.
- Asset directory PDF export now generates a real PDF instead of a `.txt` placeholder.
- `PrivacyDialog` now uses `role="dialog"` + `aria-modal` with focus trap.
- Reused shared `PasswordStrength` component in change-password (removed duplicate logic).
- Fixed dead "Learn more" links on landing features; decorative showcase buttons are now non-interactive.
- Added aria-labels to AI panel close/send controls and chat input.
- Pinned the live domain `assetrix-nu.vercel.app` in homepage, metadata, and CORS origin.

## [1.0.0] - 2026-07-30

### Added
- Enterprise asset lifecycle management (register → allocate → maintain → audit → retire).
- Role-based access control: `SUPER_ADMIN`, `ADMIN`, `DEPARTMENT_MANAGER`, `TECHNICIAN`, `EMPLOYEE`.
- Department hierarchy, asset categories, and employee directory.
- Allocation engine with conflict detection and transfer approval workflow.
- Resource booking with overlap validation and approval flow.
- Maintenance operations: preventive schedules, task lifecycle, cost tracking.
- Audit cycles with physical verification and discrepancy management.
- Reports & analytics with CSV / PDF / Excel export.
- Notification center with per-channel preferences.
- AI-style operational intelligence (health scores, recommendations, predictive maintenance).
- JWT auth with refresh-token rotation, Redis-backed sessions, login history.
- Swagger/OpenAPI documentation (dev mode).
- Next.js 16 frontend with dark/light theme, command palette, keyboard shortcuts.
- Docker + Railway deployment configuration for the backend.

### Fixed
- Cross-origin login flow (`sameSite=none`, Vercel API URL, remember-me wiring).
- Helmet CORP blocking browser fetch.
- Email verification dev bypass and pending-requests queue.
- CSP `connect-src` covering the deployed API origin.
- DB indexes on high-traffic tables.

## [0.9.0] - 2026-07-01

### Added
- Initial dashboard with KPI cards and charts.
- Landing page (16 sections).
- Basic auth flows (register, login, logout).

## [0.1.0] - 2026-05-20

### Added
- Project scaffold: Next.js frontend + Express/Prisma backend.
- Initial Prisma schema (auth, departments, assets).
- Railway + Vercel deployment configuration.
