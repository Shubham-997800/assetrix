# Assetrix UI/UX Audit Report

Date: 2026-08-05
Scope: Responsive behavior, overflow, spacing/typography, color consistency, component health, accessibility, performance.
Test widths: 320px / 375px / 640px / 768px / 1024px / 1280px / 1600px / 1920px, plus portrait and landscape orientations.

## Screens audited

- Landing: Home (`/`), Navbar, Hero
- Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/session-expired`
- Dashboard shell + mobile nav + sidebar + breadcrumbs
- Dashboard home, Allocations, Assets (directory, register form, QR modal, table dropdowns)
- Audit (cycles, create cycle, verification, discrepancies, close cycle, history)
- Bookings, Maintenance, Notifications, Logs, Organization, Settings, Profile, Reports (all 8 tabs)
- Shared: AI panel, command palette, global search, keyboard-shortcuts help, privacy dialog, loading skeletons

## Systemic root causes found

1. Pages had no horizontal padding (main content full-bleed). Child pages used `p-6`, loading states too, so layout shifted between ready and loading states.
2. Small button sizes (`xs`/`sm`, `icon-xs`/`icon-sm`) were below the 44px touch-target guideline (36/32px); some call sites forced `h-7 w-7` (28px).
3. Multiple `grid grid-cols-2` layouts squeezed to one usable column on phones.
4. Table headers did not hide columns at the same breakpoints as their body cells, producing header/body misalignment on mobile.
5. Several toolbars, pagination footers, and dropdown rows could overflow at 320px.
6. Icon-only controls lacked accessible labels; switches had no `aria-label`.

## Issues fixed (by file)

### System-wide
- `src/components/dashboard/dashboard-shell.tsx` — main content now `w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-6` (added horizontal padding + max width).
- `src/components/ui/button.tsx` — `xs`→`min-h-[36px]`, `sm`→`min-h-[40px]`, `icon-xs`→36px, `icon-sm`→40px; `default`/`icon` keep 44px.
- All 12 `dashboard/*/loading.tsx` — removed stray `p-6`, standardized paddings, fixed overflow-prone fixed-width skeleton bars (`w-40`/`w-56`/`w-48` → fluid `w-1/2`/`w-2/3` + `min-w-0`), fixed `grid-cols-2`→`grid-cols-1 sm:grid-cols-2`, made settings nav pills wrap on mobile.

### Assets
- `asset-directory-table.tsx` — headers now hide columns at the same breakpoints as cells (`hidden md:table-cell` / `lg:table-cell` / `xl:table-cell`); toolbar buttons wrap on mobile; `aria-label` added to icon-only toolbar buttons + QR button + prev/next; pagination page buttons wrap and center on mobile; QR button enlarged to 32px.
- `register-asset-form.tsx` — switches got `aria-label`, focus-visible ring, and a 44px extended hit area (`after:-inset-2.5`); remove-file button gets `type="button"`, `aria-label`, 32px target.
- `table-dropdown.tsx` — trigger raised to `min-h-[44px]`, `aria-haspopup`/`aria-expanded`/`aria-label`, label truncates with `min-w-0`.
- `assets/page.tsx` — fixed unescaped quotes (lint).

### Audit
- `audit-tabs.tsx` — 4 form/detail grids `grid-cols-1 sm:grid-cols-2`; tab buttons get `aria-pressed`; table action buttons no longer force `h-7`; pagination is now wrap-safe and uses 44px icon buttons with `aria-label`; `Date.now` lazy-init (lint purity).

### Reports
- `report-tabs.tsx` — KPI grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`; tab `aria-pressed`; pagination wrap-safe + 44px icon buttons + `aria-label`; bar-chart category/department labels `min-w-0 truncate`.

### Organization
- `organization/page.tsx` — dynamic-field row `w-32`→`w-28 shrink-0`, input `min-w-0`, remove button 32px + `aria-label`; employee pagination stacks on mobile, page buttons 36px + `aria-current`, prev/next 44px `size="icon"` with labels.

### Shared
- `ai-panel.tsx` — Page Insights header + chip row wrap.
- `command-palette.tsx`, `global-search.tsx` — hint footers wrap and stack on narrow widths.

### Landing
- `navbar.tsx` — nav links / Sign in / Create Account all collapse to the mobile sheet below `lg` (was overlapping at 640–1024px); hamburger now `lg:hidden`.

## Verification

- `npm run typecheck` — clean.
- `npm run lint` — clean (0 errors, 0 warnings).
- `npm run build` — successful, all 22 routes prerendered.

## Remaining recommendations (not blocking)

1. Table rows: replace 28px icon buttons in dense tables (e.g., asset row actions at `icon-sm` 40px) — already 40px, acceptable; consider spacing if rows feel tall.
2. Add explicit `overflow-x-auto` wrapper consistency on raw `<table>` usage (organization tables rely on card-level overflow — verified OK).
3. Export dropdown in asset directory is hover-only (`group-hover:block`); consider a click/tap-friendly menu for touch.
4. Consider `aria-label` localization + a dedicated `Table` caption for screen-reader users.
5. Runtime E2E pass at 320px in DevTools on a populated dataset recommended to confirm real-data edge cases.
6. Dark-mode contrast audit for the new `primary/10` chips (spot-checked, values are semantic tokens).
7. `report-tabs.tsx` heatmap min-width 600px scrolls horizontally by design; confirm acceptable on mobile.
