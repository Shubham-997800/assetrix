<a id="top"></a>

<div align="center">

<img src="https://img.shields.io/badge/STATUS-PRODUCTION%20READY-10B981?style=for-the-badge&labelColor=0F172A&color=10B981" />

<br />
<br />

<img src="https://img.shields.io/badge/⚡_Assetrix-ERP-0891B2?style=for-the-badge&logoColor=white&labelColor=0F172A" />

<br />

### Enterprise Asset & Resource Management Platform

*Track Assets · Automate Maintenance · Manage Bookings · Audit Compliance*

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-4-FFFFFF?style=flat-square&labelColor=0F172A)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)

<br />
<br />

[**Live Demo**](https://assetrix.vercel.app) · [**GitHub**](https://github.com/Shubham-997800/assetrix) · [**Quick Start**](#-quick-start) · [**Features**](#-features) · [**Architecture**](#-architecture)

</div>

---

<br />

## Overview

Assetrix is a production-grade enterprise ERP platform for asset and resource management. It combines asset tracking, allocation workflows, maintenance automation, and audit compliance into a unified operational platform.

This is not a prototype. This is not a demo. This is engineering.

<br />

### Built With

```
Next.js 16          →  App Router, Server Components, Turbopack
TypeScript 5        →  Full type safety across every module
Tailwind CSS v4     →  Utility-first styling with design tokens
shadcn/ui           →  Accessible, composable component library
Lucide React        →  Consistent icon system
next-themes         →  Dark/Light/System mode with persistence
Inter Font          →  Enterprise typography
```

<br />

---

<br />

<br />

---

<br />

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Landing Page** | 16-section enterprise ERP landing page with animations |
| `/login` | **Login** | Social login (Google/GitHub/Microsoft) + email/password + validation |
| `/register` | **Register** | Full registration with password strength meter + terms |
| `/forgot-password` | **Forgot Password** | Email input → success state with resend option |
| `/reset-password` | **Reset Password** | New password with strength meter → auto-redirect |
| `/verify-email` | **Verify Email** | Verification instructions + resend email |
| `/dashboard` | **Dashboard** | Full enterprise shell: sidebar, navbar, KPIs, charts, activity |
| `/dashboard/profile` | **Profile** | 5 tabs: Personal Info, Contact, Account, Password, Sessions, Devices, Activity |
| `/dashboard/settings` | **Settings** | 7 tabs: General, Appearance, Notifications, Security, Language, Integrations, Preferences |
| `/dashboard/notifications` | **Notifications** | 5 tabs: All, Unread, Mentioned, Archived, Preferences |
| `/dashboard/reports` | **Reports** | KPIs, 4 charts, data table with sort/search/paginate, saved views, scheduled reports |
| `/dashboard/admin` | **Administration** | Users, Roles + Permissions Matrix, Audit Logs, Feature Flags, System Health, Background Jobs |
| `*` | **404** | Custom error page with navigation |

<br />

---

<br />

## Design System — Aura Cyan

<div align="center">

| Color | Hex | Preview |
|-------|-----|---------|
| Primary | `#0891B2` | ![#0891B2](https://img.shields.io/badge/-0891B2-0891B2?style=flat-square) |
| Accent | `#22D3EE` | ![#22D3EE](https://img.shields.io/badge/-22D3EE-22D3EE?style=flat-square) |
| Success | `#10B981` | ![#10B981](https://img.shields.io/badge/-10B981-10B981?style=flat-square) |
| Warning | `#F59E0B` | ![#F59E0B](https://img.shields.io/badge/-F59E0B-F59E0B?style=flat-square) |
| Error | `#EF4444` | ![#EF4444](https://img.shields.io/badge/-EF4444-EF4444?style=flat-square) |

</div>

### Light Theme

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#F8FAFC` | Application background |
| Card | `#FFFFFF` | Card surfaces |
| Border | `#E2E8F0` | Dividers, borders |
| Primary | `#0891B2` | Actions, links, focus |
| Text Primary | `#0F172A` | Headings, body |
| Text Secondary | `#64748B` | Descriptions, labels |

### Dark Theme

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#020617` | Application background |
| Card | `#0F172A` | Card surfaces |
| Border | `#1E293B` | Dividers, borders |
| Primary | `#22D3EE` | Actions, links, focus |
| Text Primary | `#F8FAFC` | Headings, body |
| Text Secondary | `#94A3B8` | Descriptions, labels |

<br />

---

<br />

## Landing Page — 16 Sections

| Section | Description |
|---------|-------------|
| **Navbar** | Sticky header with logo, nav links, theme toggle, login/register CTA |
| **Hero** | Enterprise headline, metrics (Assets, Bookings, Maintenance, Audit), floating widgets, dashboard preview |
| **Trusted By** | Industry logos (Hospitals, Universities, Government, Corporate, Manufacturing) + counter animations |
| **Features** | 8 asset management modules with scroll reveal + stagger animations |
| **Architecture** | 7-step pipeline (Departments → Employees → Assets → Allocation → Maintenance → Audit → Analytics) |
| **AI Intelligence** | Maintenance prediction pipeline + AI recommendation card with confidence scores |
| **Dashboard Showcase** | Full dashboard preview with KPIs, utilization chart, maintenance queue, asset table |
| **Workflow** | 6-step lifecycle timeline (Registration → Allocation → Transfer → Maintenance → Audit → Reports) |
| **Security** | 6 security cards (RBAC, Encryption, Audit, Compliance, Approvals, Sessions) + 4 metrics |
| **Developer Experience** | Code preview + 5 cards (Modular Architecture, Workflow Engine, Reusable Components, Role Routing, Scalable DB) |
| **Performance** | 5 feature cards + 4 stats (Latency, Cache, Edge, Events) |
| **Accessibility** | 5 commitment cards (Keyboard, Screen Readers, Contrast, Semantic HTML, Standards) |
| **Analytics** | 5 metrics + 4 charts (Utilization, Maintenance, Department Allocation, Retirement Forecast) |
| **Customer Stories** | 3 testimonial cards (Hospital, University, Manufacturing case studies) |
| **FAQ** | 6 accordion items (Allocation conflicts, Maintenance approval, Audit cycles, Booking validation) |
| **CTA Banner** | "Bring Visibility To Every Asset" with Explore Dashboard + Request Demo buttons |
| **Footer** | Product, Company, Legal links + social media |

<br />

---

<br />

## Authentication System

### 50/50 Split Layout

```
╔════════════════════════╦══════════════════════════════╗
║                        ║                              ║
║   Left Panel           ║   Right Panel                ║
║   (Branding)           ║   (Auth Form)                ║
║                        ║                              ║
║   Assetrix Logo        ║   max-width: 480px           ║
║   Tagline              ║   padding: 40px              ║
║   5 Feature Icons      ║   vertical-center            ║
║   4 Metrics            ║                              ║
║                        ║                              ║
╚════════════════════════╩══════════════════════════════╝
        Desktop: 50/50 split
        Tablet: 40/60 split
        Mobile: Single column + logo
```

### Auth Components

| Component | Features |
|-----------|----------|
| `AuthInput` | Reusable field with label, error, hint, icon, 44px show/hide password toggle |
| `SocialButtons` | Google (OAuth colors), GitHub, Microsoft with SVG icons, 44px height |
| `PasswordStrength` | 4-level bar (Weak/Medium/Strong/Very Strong) + 5-rule checklist, `role="meter"` |
| `AuthDivider` | Centered "or continue with" separator with `role="separator"` |

### Auth Pages

| Page | Features |
|------|----------|
| `/login` | Social login, email+password, remember me, error handling, loading state |
| `/register` | Full name, email, password+confirm, strength meter, terms, marketing opt-in |
| `/forgot-password` | Email input → success state with "try different email" |
| `/reset-password` | New password+confirm, strength meter, auto-redirect success |
| `/verify-email` | Mail illustration, instructions, resend with loading/success |

<br />

---

<br />

## Enterprise Dashboard

### Application Shell

```
┌─────────────────────────────────────────────────────────┐
│ Top Navbar (64px, z-40)                                  │
│ ┌──────┬─────────────────┬─────────────────────────────┐│
│ │Toggle│Assetrix/Overview│ 🔍 Search  🔔 👤 ☀️          ││
│ │      │                 │    Ctrl+K    2   Theme  Menu ││
│ └──────┴─────────────────┴─────────────────────────────┘│
├────────┬────────────────────────────────────────────────┤
│        │                                                 │
│ Side-  │  Dashboard Workspace                            │
│ bar    │                                                 │
│        │  ┌────────┐┌────────┐┌────────┐┌────────┐      │
│ 280px  │  │Assets  ││Bookings││Maint.  ││Audit   │      │
│ (72px  │  │12,450  ││3,200   ││24      ││99.8%   │      │
│  col-  │  └────────┘└────────┘└────────┘└────────┘      │
│  lpsd) │                                                 │
│ □ Dash │  ┌──────────────────┐┌──────────────────┐      │
│ □ Anal │  │ Asset Utilization││ Maintenance Queue  │      │
│ □ Repo │  │ (Bar Chart)      ││ (List)             │      │
│ □ Noti │  └──────────────────┘└──────────────────┘      │
│ □ Work │                                                 │
│ □ Audi │  ┌──────────────────┐┌──────────────────┐      │
│ □ Inte │  │ Booking Calendar ││ Transfer Status    │      │
│ □ Admi │  │ (Calendar)       ││ (Status Cards)     │      │
│ □ Sett │  └──────────────────┘└──────────────────┘      │
│ □ Prof │                                                 │
│ ────── │  ┌─────────────────────────────────────────┐   │
│ JD     │  │ Recent Asset Activity Table              │   │
│ john@. │  │ AST-8241 │ Engineering │ Active │ S.C.   │   │
│        │  └─────────────────────────────────────────┘   │
└────────┴────────────────────────────────────────────────┘
```

### Navbar Features

| Feature | Implementation |
|---------|---------------|
| Global Search | `Ctrl+K` shortcut, dropdown with suggestions (pages, records, assets) |
| Notifications | Dropdown with 5 items, unread badge, mark all read, `z-50` |
| Theme Toggle | Light/Dark/System with persistence (44px touch target) |
| Profile Menu | Profile, Settings, Security, Activity Log, Logout, `z-50` |
| Breadcrumb | Assetrix / Current Page (hidden on mobile) |
| Mobile Menu | Hamburger → Sheet overlay (`z-[55]`) |

### Sidebar Features

| Feature | Implementation |
|---------|---------------|
| Collapse | 280px → 72px with animated toggle button (28px, desktop only) |
| Nav Groups | Main, Operations, System (10 items with `aria-current="page"`) |
| Active State | Cyan background + dot indicator |
| Tooltips | `title` attribute when collapsed |
| Mobile Drawer | `85vw max-w-280px`, backdrop blur, `z-[60]`, Escape to close, body scroll lock |
| User Section | Avatar, name, email at bottom |

### Dashboard Sections

| Section | Description |
|---------|-------------|
| **KPI Cards** | 6 cards with animated counters (Assets: 12,450, Bookings: 3,200, Maintenance: 24, Audit: 99.8%) |
| **Asset Utilization** | 12-month bar chart with hover tooltips, responsive height |
| **Maintenance Queue** | List of scheduled maintenance items |
| **Booking Calendar** | Calendar view of active bookings |
| **Transfer Status** | Status cards for pending transfers |
| **Asset Activity** | Responsive table with status badges |

<br />

---

<br />

## Animation System

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useInView` | IntersectionObserver for scroll-triggered animations |
| `useCountUp` | Eased counter animation (cubic ease-out) |
| `useScrollShadow` | Navbar shadow on scroll |

### CSS Utilities

| Class | Effect |
|-------|--------|
| `animate-fade-in-up` | Fade + slide up 16px |
| `animate-scale-in` | Scale from 0.98 + fade |
| `animate-slide-down` | Slide down 8px + fade |
| `animate-slide-in-left` | Slide in from left |
| `animate-shimmer` | Skeleton loading shimmer |
| `animate-draw-line` | Progressive line width |
| `card-hover` | translateY(-4px) + border highlight |
| `btn-enterprise` | translateY(-1px) hover, scale(0.98) press |
| `input-focus-glow` | Cyan focus ring (4px) |
| `skeleton-shimmer` | Gradient shimmer animation |

### Stagger Delays

```
.delay-0    → 0ms      .delay-200  → 200ms
.delay-50   → 50ms     .delay-300  → 300ms
.delay-100  → 100ms    .delay-500  → 500ms
.delay-150  → 150ms    .delay-700  → 700ms
```

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce` — uses `0s` duration for all animations and transitions.

<br />

---

<br />

## Project Structure

```
assetrix/
├── public/                          # Static assets
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── globals.css              # Aura Cyan Theme + Animation System
│   │   ├── layout.tsx               # Root Layout + ThemeProvider + CommandPalette
│   │   ├── page.tsx                 # Landing Page (16 sections)
│   │   ├── not-found.tsx            # 404 Handler (semantic, 44px targets)
│   │   │
│   │   ├── login/page.tsx           # Login (social + email/password)
│   │   ├── register/page.tsx        # Register (strength meter + terms)
│   │   ├── forgot-password/page.tsx # Forgot Password (success state)
│   │   ├── reset-password/page.tsx  # Reset Password (strength meter)
│   │   ├── verify-email/page.tsx    # Verify Email (resend + instructions)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx           # Dashboard Shell Layout
│   │   │   ├── page.tsx             # Dashboard (KPIs, Charts, Activity)
│   │   │   ├── profile/page.tsx     # Profile (5 tabs)
│   │   │   ├── settings/page.tsx    # Settings (7 tabs)
│   │   │   ├── notifications/page.tsx # Notifications (5 tabs)
│   │   │   ├── reports/page.tsx     # Reports (charts, data table, views)
│   │   │   └── admin/page.tsx       # Admin (users, roles, audit, flags, health, jobs)
│   │   │
│   │   └── not-found/page.tsx       # 404 Page (stacking buttons on mobile)
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui Components
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx           # + btn-enterprise class
│   │   │   ├── card.tsx
│   │   │   ├── separator.tsx
│   │   │   └── sheet.tsx            # z-[55] overlay/content
│   │   │
│   │   ├── auth/                    # Auth Components
│   │   │   ├── auth-input.tsx       # Reusable input with 44px toggle
│   │   │   ├── social-buttons.tsx   # Google/GitHub/Microsoft (44px)
│   │   │   ├── password-strength.tsx # role="meter" + checklist
│   │   │   └── auth-divider.tsx     # role="separator"
│   │   │
│   │   ├── dashboard/               # Dashboard Shell
│   │   │   ├── dashboard-shell.tsx  # Layout wrapper + skip-to-content
│   │   │   ├── dashboard-navbar.tsx # Search, notifications, profile (z-40)
│   │   │   └── dashboard-sidebar.tsx # Collapsible nav (z-[60] mobile drawer)
│   │   │
│   │   ├── profile/                 # Profile Components
│   │   │   ├── profile-header.tsx   # Avatar upload + initials (44px button)
│   │   │   ├── personal-info.tsx    # Edit mode form
│   │   │   ├── contact-info.tsx     # Verified badges
│   │   │   ├── account-info.tsx     # Read-only metadata (overflow-safe)
│   │   │   ├── change-password.tsx  # Strength meter + full-width submit
│   │   │   ├── active-sessions.tsx  # Revoke (hidden text on mobile)
│   │   │   ├── devices.tsx          # Trust/remove (44px buttons + aria-label)
│   │   │   ├── activity-log.tsx     # Timeline (truncate + justify-between)
│   │   │   └── notification-settings.tsx # 44px toggles + aria-label
│   │   │
│   │   ├── landing/                 # 16 Landing Page Sections
│   │   │   ├── navbar.tsx           # + scroll shadow, z-40
│   │   │   ├── hero.tsx             # + stagger animations, flex-wrap CTAs
│   │   │   ├── trusted-by.tsx       # + counter animations
│   │   │   ├── features.tsx         # + scroll reveal
│   │   │   ├── architecture.tsx     # Responsive pipeline (mobile vertical, desktop horizontal)
│   │   │   ├── ai-intelligence.tsx
│   │   │   ├── dashboard-showcase.tsx # Full dashboard preview
│   │   │   ├── workflow.tsx         # + progressive line draw
│   │   │   ├── security.tsx         # + hover effects
│   │   │   ├── developer-experience.tsx
│   │   │   ├── performance.tsx
│   │   │   ├── accessibility.tsx
│   │   │   ├── analytics.tsx
│   │   │   ├── analytics-preview.tsx
│   │   │   ├── customer-stories.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── cta-banner.tsx
│   │   │   └── footer.tsx           # 44px social links, aria-label
│   │   │
│   │   └── shared/                  # Shared Components
│   │       ├── skeleton.tsx         # Responsive grid, role="status"
│   │       ├── empty-state.tsx
│   │       ├── command-palette.tsx  # Focus trap, z-[100], arrow nav
│   │       └── theme-toggle.tsx     # 44px, sr-only label
│   │
│   ├── contexts/
│   │   └── dashboard-context.tsx    # Sidebar + drawer state
│   │
│   ├── hooks/
│   │   ├── use-in-view.ts           # IntersectionObserver
│   │   ├── use-count-up.ts          # Counter animation
│   │   └── use-scroll-shadow.ts     # Scroll detection
│   │
│   └── lib/
│       └── utils.ts                 # cn() Utility
│
├── .gitignore
├── components.json                  # shadcn/ui Config
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md                        # This File
├── start-dev.bat                    # Dev server launcher
└── tsconfig.json
```

<br />

---

<br />

## Tech Stack Deep Dive

### Core

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.10 | React framework with App Router |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Node.js | 24.x | Runtime |

### Styling

| Technology | Version | Purpose |
|-----------|---------|---------|
| Tailwind CSS | 4.3.2 | Utility-first CSS |
| shadcn/ui | 4.13.0 | Component library |
| tw-animate-css | 1.4.0 | Animation utilities |

### Libraries

| Technology | Purpose |
|-----------|---------|
| Lucide React | Icon system (consistent, lightweight) |
| next-themes | Dark/Light mode with system detection |
| class-variance-authority | Component variant management |
| clsx + tailwind-merge | Conditional class merging |

<br />

---

<br />

## Commands

```bash
npm run dev          # Start dev server on port 5173
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

<br />

---

<br />

## Design Principles

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   Structure      over      Decoration                ║
║   Consistency    over      Creativity                ║
║   Clarity        over      Complexity                ║
║   Professionalism over     Personality               ║
║   Engineering    over      Marketing                 ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

### Rules

- Single brand color: Cyan (`#0891B2` / `#22D3EE`)
- 80% neutral colors + 20% accent colors
- No gradients, no neon, no glassmorphism
- Soft shadows only (`0 1px 2px rgba(0,0,0,0.05)`)
- 16px card radius, 12px button/input radius
- Inter typography (400, 500, 600, 700)
- 48px mobile spacing, 64px tablet, 96px desktop (landing sections)
- All currency in Indian Rupees (₹)

<br />

---

<br />

## Z-Index Hierarchy

| Layer | Z-Index | Element |
|-------|---------|---------|
| Page Content | `0` | Normal content |
| Navbar | `40` | Dashboard sticky navbar |
| Sheet (Landing) | `55` | Landing page mobile menu |
| Dropdowns | `50` | Notification/profile dropdowns |
| Sidebar Drawer | `60` | Dashboard mobile sidebar drawer |
| Command Palette | `100` | Global search modal |

<br />

---

<br />

## Accessibility

| Feature | Status |
|---------|--------|
| Keyboard Navigation | Supported across all interactive elements |
| Focus States | Visible (Cyan ring, `focus-visible`) |
| ARIA Labels | Implemented on all interactive elements |
| Semantic HTML | `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>` landmarks |
| Color Contrast | WCAG 2.1 AA |
| Screen Reader Support | Compatible (`sr-only` labels, `aria-hidden` decorative icons) |
| Reduced Motion | Respected (`prefers-reduced-motion: reduce` → `0s` duration) |
| Error Messages | `role="alert"` with `aria-describedby` |
| Password Toggle | `aria-label` toggles between Show/Hide, 44px touch target |
| Skip to Content | Dashboard skip-link for keyboard users |
| Form Labels | All inputs associated via `htmlFor`/`id` |
| Focus Traps | Command palette modal (`aria-modal`, `role="dialog"`) |
| Keyboard Shortcuts | `Ctrl+K` command palette with arrow navigation, `role="listbox"` |
| Tab ARIA | `role="tablist"`, `role="tab"`, `aria-selected` |
| Toggle Switches | `role="switch"`, `aria-checked`, `aria-label` |
| Password Meter | `role="meter"`, `aria-valuenow`, `aria-label` |
| Decorative Icons | `aria-hidden="true"` on non-interactive icons |
| Touch Targets | Minimum 44px on ALL interactive elements |
| Mobile Drawer | Escape key to close, body scroll lock, close on resize |
| Skeleton Loading | `role="status"`, `aria-label="Loading dashboard"` |

<br />

---

<br />

## Currency System

All monetary values use **Indian Rupees (₹)** with Indian number formatting:

| Format | Example |
|--------|---------|
| Lakhs | ₹12,45,000 |
| Crores | ₹4.2Cr |
| Thousands | ₹8,92,000 |

<br />

---

<br />

## Deployment

| Platform | URL |
|----------|-----|
| **Vercel (Production)** | https://assetrix.vercel.app |
| **GitHub** | https://github.com/Shubham-997800/assetrix |

<br />

---

<br />

## License

MIT License — Built for Enterprise ERP Solutions

<br />

<div align="center">

**[⬆ Back to Top](#top)**

</div>
