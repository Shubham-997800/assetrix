# Assetrix UI/UX Audit Checklist

Page-by-page improvement tracker. Status: `[x]` done, `[ ]` pending.

Verification commands: `npm run typecheck`, `npm run lint`, `npm run build`.

---

## Shared / Dashboard shell

### Navbar — `src/components/dashboard/dashboard-navbar.tsx`
- [x] Search trigger: `aria-haspopup="dialog"` + `aria-expanded` reflecting `searchOpen`.
- [x] `Ctrl K` kbd hint `text-[9px]` → `text-[10px]`.
- [x] Task / unread-count badges `text-[9px]` → `text-[10px]`.
- [x] Notification timestamp `muted-foreground/60` → `muted-foreground` (contrast).
- [x] Tasks / Notifications panels: `role="dialog"` + `aria-label`; Profile panel: `role="menu"` + `role="menuitem"` items.
- [x] Trigger buttons get `aria-controls` pointing at panel ids.

### Sidebar — `src/components/dashboard/dashboard-sidebar.tsx`
- [x] Nav links / fav / recent links: `focus-visible:ring` (keyboard focus visible).
- [x] Active links: `aria-current="page"`.
- [x] Section headers `muted-foreground/60` → `muted-foreground` + hover bg.
- [x] Collapsed mode: group toggle buttons now show chevron affordance.
- [x] Star/favorite button: 28px target (`h-7 w-7`), visible on focus.
- [x] Mobile drawer: `role="dialog"` + `aria-modal` + `useDialogA11y` (Escape / trap / focus restore / scroll lock).

### Mobile nav — `src/components/shared/mobile-nav.tsx`
- [x] `aria-label` on nav, `aria-current="page"` on active item, 44px touch targets.

### Global search — `src/components/shared/global-search.tsx`
- [x] Results: `role="listbox"` + `role="option"` + `aria-selected`.
- [x] Input: `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-activedescendant` + `aria-autocomplete`.
- [x] Focus trap via `dialogRef` (removed fragile `querySelector` hack).
- [x] Scroll-into-view uses `[role="option"]` (fixed broken index-based lookup).
- [x] Category text `muted-foreground/60` → `muted-foreground`.
- [x] Clear-search button gets `aria-label`.

### Command palette — `src/components/shared/command-palette.tsx`
- [x] Results: `role="listbox"` + `role="option"` + `aria-selected`.
- [x] Input: `role="combobox"` + `aria-controls` + `aria-activedescendant` + `aria-autocomplete`.
- [x] Scroll-into-view uses `[role="option"]`.
- [x] Category text `muted-foreground/60` → `muted-foreground`.

### Breadcrumb — `src/components/shared/breadcrumb-nav.tsx`
- [x] Home icon-only link gets `aria-label="Dashboard"`.
- [x] Links get `focus-visible:ring`.

### Keyboard shortcuts dialog — `src/components/shared/keyboard-shortcuts-help.tsx`
- [x] Group headers `muted-foreground/60` → `muted-foreground`.
- [x] Close button `aria-label` (already), `useDialogA11y`.

### AI panel — `src/components/shared/ai-panel.tsx`
- [x] Added `useDialogA11y` (Escape close / focus restore / scroll lock).
- [x] `Demo` and priority badges `text-[9px]` → `text-[10px]`.

### Landing
- [x] `hero.tsx` — mockup text `text-[8px]` → `text-[10px]`; time text `muted-foreground/60` → `muted-foreground`.
- [x] `analytics.tsx` — line + donut SVGs get `role="img"` + `aria-label`.

---

## Dialogs / Modals (a11y)

- [x] `src/hooks/use-dialog-a11y.ts` — reusable hook (Escape, Tab trap, initial focus, scroll lock, focus restore).
- [x] Organization `ConfirmDialog` / `Modal` — `role="dialog"` + `aria-modal` + `aria-label` + hook (hook called before early return).
- [x] Assets `DeleteConfirmDialog` — extracted component with hook + dialog semantics.
- [x] Organization Modal/Toast close buttons get `aria-label`.

---

## Native `alert()` → inline UI errors

- [x] `maintenance-tabs.tsx` — 5 action handlers (approve/reject/start/assign/resolve) → `actionError` state + inline banner (`role="alert"`).
- [x] `reports/page.tsx` — export-all error → inline banner.
- [x] `audit-tabs.tsx` — start-cycle error → inline banner.
- [x] `report-tabs.tsx` — generate-report error → inline banner.

---

## Asset Directory — `src/app/dashboard/assets/`

### Table — `asset-directory-table.tsx`
- [x] Export dropdown: hover-only → click toggle + outside-click close + Escape + `aria-haspopup`/`aria-expanded`/`role="menu"` + `role="menuitem"`.
- [x] QR button icon contrast `muted-foreground/40` → `muted-foreground`.
- [ ] Row action buttons: verify ≥32px target + `aria-label`.
- [ ] Verify column-hide breakpoints still align with cells (done in earlier pass, spot-check).

### Register form — `register-asset-form.tsx`
- [ ] Verify switches `aria-label` + 44px hit area (done earlier, spot-check).
- [ ] Verify form error display uses inline UI (no `alert()`).

### Details view — `asset-details-view.tsx`
- [ ] Check inline edit / action buttons for `aria-label` + focus states.
- [ ] Check QR modal + delete flow a11y.

### Lifecycle tab — `asset-lifecycle-tab.tsx`
- [x] Donut SVG `role="img"` + `aria-label`.
- [ ] Check interactive segments keyboard-accessible (if any).

---

## Allocations — `src/app/dashboard/allocations/`

- [ ] `allocate-form.tsx` — validation errors inline, focus after error.
- [ ] `allocation-tabs.tsx` — workflow steps a11y, action buttons labels, table hover-only menus.
- [ ] Pagination / empty states contrast.

## Bookings — `src/app/dashboard/bookings/`

- [x] `booking-tabs.tsx` — calendar `+{n} more` chip `text-[9px]` → `text-[10px]` + contrast.
- [x] Tab buttons `aria-pressed`.
- [ ] Calendar grid keyboard navigation, date-cell buttons `aria-pressed`/`aria-selected`.
- [ ] Booking form validation + success/error inline UI.

## Maintenance — `src/app/dashboard/maintenance/`

- [x] `maintenance-tabs.tsx` — `alert()` → inline error banner (action panel).
- [x] Tab buttons `aria-pressed`.
- [ ] `raise-request.tsx` — validation error focus, selects `aria-label`, submit disabled state.
- [ ] Request cards: keyboard-accessible open/view action.

## Audit — `src/app/dashboard/audit/`

- [x] `audit-tabs.tsx` — start-cycle `alert()` → inline banner.
- [x] History card: clickable `<div>` → `role="button"` + `tabIndex` + Enter/Space.
- [ ] Create-cycle form: inline validation errors, dialog a11y.
- [ ] Verification list: checkbox `aria-label`, row focus states.

## Notifications — `src/app/dashboard/notifications/`

- [x] Tabs `aria-pressed` (match pattern in other tabs).
- [x] Mark-read / archive / delete buttons `aria-label`.
- [x] Timestamp `muted-foreground/60` → `muted-foreground`.

## Activity Logs — `src/app/dashboard/logs/`

- [x] Tab buttons `aria-pressed`.
- [x] Role + timestamp text `muted-foreground/60` → `muted-foreground`.

## Organization — `src/app/dashboard/organization/page.tsx`

- [x] `ConfirmDialog` / `Modal` a11y + hook.
- [x] Modal/Toast close buttons `aria-label`.
- [x] Tab buttons `aria-pressed`.
- [ ] Tables: `aria-label`/caption, delete-department confirm dialog hook usage.
- [ ] Filters/search inputs `aria-label`.

## Reports — `src/app/dashboard/reports/`

- [x] `report-tabs.tsx` — generate-report `alert()` → inline banner.
- [x] Donut + trend SVGs `role="img"` + `aria-label`.
- [x] Export format cards `aria-pressed` + `focus-visible`.
- [ ] Heatmap min-width scroll wrapper — confirm acceptable on mobile (already noted).

## Settings / Profile

- [x] Settings: toggles `aria-label` + `aria-pressed` (already), section tabs `aria-pressed`.
- [x] Profile: tab buttons `aria-pressed`.
- [x] Profile components (`active-sessions.tsx`, `activity-log.tsx`, `devices.tsx`, `profile-header.tsx`) — time text `muted-foreground/60` → `muted-foreground`.
- [ ] Profile: action buttons labels, focus states.

---

## Charts

- [x] `asset-status-chart.tsx` donut SVG `role="img"` + `aria-label`.
- [x] `analytics.tsx` line + donut SVGs labeled.
- [x] `report-tabs.tsx` donut + trend SVGs labeled.
- [x] `asset-lifecycle-tab.tsx` donut SVG labeled.
- [x] `asset-qr-modal.tsx` QR SVG labeled.
- [ ] Analytics widgets: check hover-only tooltips have a tap/click equivalent.

---

## Final wrap-up

- [ ] `npm run typecheck` — clean.
- [ ] `npm run lint` — clean (0 errors, 0 warnings).
- [ ] `npm run build` — success, all routes prerendered.
- [ ] Update `AUDIT_REPORT.md` with final score + fixed items.
- [ ] Commit + push to `origin main`.
