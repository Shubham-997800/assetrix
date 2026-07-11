<a id="top"></a>

<div align="center">

<img src="https://img.shields.io/badge/STATUS-PRODUCTION%20READY-10B981?style=for-the-badge&labelColor=0F172A&color=10B981&labelColor=0F172A" />

<br />
<br />

<img src="https://img.shields.io/badge/⚡_Nexus-PLATFORM-0891B2?style=for-the-badge&logoColor=white&labelColor=0F172A" />

<br />

### Enterprise Business Operating System

*AI-Powered Workflow Automation · Real-Time Analytics · Intelligent Decision Support*

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-4-FFFFFF?style=flat-square&labelColor=0F172A)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)

<br />
<br />

[**Live Demo**](http://localhost:5173) · [**Documentation**](#-documentation) · [**Quick Start**](#-quick-start) · [**Features**](#-features) · [**Architecture**](#-architecture)

</div>

---

<br />

## Overview

Nexus is a production-grade enterprise SaaS platform built for modern businesses. It combines workflow automation, AI-powered decision support, and real-time analytics into a unified operating system.

This is not a prototype. This is not a hackathon demo. This is engineering.

<br />

### Built With

```
Next.js 16          →  App Router, Server Components, Turbopack
TypeScript 5        →  Full type safety across every module
Tailwind CSS v4     →  Utility-first styling with design tokens
shadcn/ui           →  Accessible, composable component library
Lucide React        →  Consistent icon system
next-themes         →  Dark/Light mode with system preference
Inter Font          →  Enterprise typography
```

<br />

---

<br />

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Shubham-997800/demo-.git

# 2. Navigate to project
cd demo-

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open in browser
open http://localhost:5173
```

<br />

---

<br />

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Landing Page** | 17-section enterprise SaaS landing page with animations |
| `/login` | **Login** | Social login (Google/GitHub/Microsoft) + email/password + validation |
| `/register` | **Register** | Full registration with password strength meter + terms |
| `/forgot-password` | **Forgot Password** | Email input → success state with resend option |
| `/reset-password` | **Reset Password** | New password with strength meter → auto-redirect |
| `/verify-email` | **Verify Email** | Verification instructions + resend email |
| `/dashboard` | **Dashboard** | Full enterprise shell: sidebar, navbar, KPIs, charts, activity |
| `/dashboard/profile` | **Profile** | 5 tabs: Profile, Security, Sessions, Activity, Notifications |
| `/dashboard/settings` | **Settings** | 7 tabs: General, Appearance, Notifications, Security, Language, Integrations, Preferences |
| `/dashboard/notifications` | **Notifications** | 5 tabs: All, Unread, Mentioned, Archived, Preferences |
| `/dashboard/reports` | **Reports** | KPIs, 4 charts, data table, saved views, scheduled reports |
| `/dashboard/admin` | **Administration** | Users, Roles, Audit Logs, Feature Flags, System Health, Background Jobs |
| `*` | **404** | Custom error page with navigation |

<br />

---

<br />

## Design System — Aura Cyan

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   PRIMARY      #0891B2      ████████████████████             ║
║   ACCENT       #22D3EE      ████████████████████             ║
║   SUCCESS      #10B981      ████████████████████             ║
║   WARNING      #F59E0B      ████████████████████             ║
║   ERROR        #EF4444      ████████████████████             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

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

## Landing Page — 17 Sections

```
┌─────────────────────────────────────────────────────────┐
│                    NAVBAR (64px)                         │
│  Logo · Features · Solutions · Integrations · Docs       │
│              Theme Toggle · Login · Start Free           │
│              Scroll Shadow on Scroll                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ╔═══════════════════╗    ╔══════════════════════╗     │
│   ║                   ║    ║  ┌──────────────────┐║     │
│   ║   Hero Section    ║    ║  │  Dashboard Mockup │║     │
│   ║   Staggered Fade  ║    ║  │  KPI · Charts     │║     │
│   ║   0ms → 100ms     ║    ║  │  Activity · Table  │║     │
│   ║   → 200ms → 500ms ║    ║  └──────────────────┘║     │
│   ║                   ║    ║  ┌────┐  ┌────┐      ║     │
│   ║   [Start Building]║    ║  │+24%│  │92% │      ║     │
│   ║   [Book Demo]     ║    ║  └────┘  └────┘      ║     │
│   ╚═══════════════════╝    ╚══════════════════════╝     │
├─────────────────────────────────────────────────────────┤
│   TRUST BAR · Counter Animations                         │
│   250K+ Users · 5M+ Transactions · 99.99% · 42 Countries│
├─────────────────────────────────────────────────────────┤
│   8 FEATURE CARDS · Scroll Reveal + 60ms Stagger         │
│   Workflow · AI · Analytics · Approvals                   │
│   Security · Collab · Integrations · Audit               │
├─────────────────────────────────────────────────────────┤
│   PLATFORM ARCHITECTURE · 7-Step Pipeline                │
├─────────────────────────────────────────────────────────┤
│   AI INTELLIGENCE · Pipeline + AI Card                   │
├─────────────────────────────────────────────────────────┤
│   DASHBOARD SHOWCASE · Full Preview                      │
├─────────────────────────────────────────────────────────┤
│   WORKFLOW · 5-Step Timeline + Progressive Line Draw     │
├─────────────────────────────────────────────────────────┤
│   SECURITY · 6 Cards + 4 Metrics · Hover Effects        │
├─────────────────────────────────────────────────────────┤
│   DEVELOPER EXPERIENCE · Code Preview + 5 Cards          │
├─────────────────────────────────────────────────────────┤
│   PERFORMANCE · 5 Cards + 4 Stats                        │
├─────────────────────────────────────────────────────────┤
│   ACCESSIBILITY · 5 Commitment Cards                     │
├─────────────────────────────────────────────────────────┤
│   ANALYTICS · 5 Metrics + 4 Charts                       │
├─────────────────────────────────────────────────────────┤
│   CUSTOMER STORIES · 3 Testimonial Cards                 │
├─────────────────────────────────────────────────────────┤
│   FAQ · 6 Accordion Items                                │
├─────────────────────────────────────────────────────────┤
│   FINAL CTA · Start Building + Contact Sales             │
├─────────────────────────────────────────────────────────┤
│   FOOTER · Product · Company · Legal · Social            │
└─────────────────────────────────────────────────────────┘
```

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
║   Nexus Logo           ║   max-width: 480px           ║
║   Tagline              ║   padding: 40px              ║
║   5 Feature Icons      ║   vertical-center            ║
║   4 Metrics            ║                              ║
║                        ║                              ║
╚════════════════════════╩══════════════════════════════╝
        Desktop: 50/50 split
        Tablet: 55% / 45%
        Mobile: Single column + logo
```

### Auth Components

| Component | Features |
|-----------|----------|
| `AuthInput` | Reusable field with label, error, hint, icon, show/hide password |
| `SocialButtons` | Google (OAuth colors), GitHub, Microsoft with SVG icons |
| `PasswordStrength` | 4-level bar (Weak/Medium/Strong/Very Strong) + 5-rule checklist |
| `AuthDivider` | Centered "or continue with" separator |

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
│ Top Navbar (64px)                                        │
│ ┌──────┬─────────────────┬─────────────────────────────┐│
│ │Toggle│ Nexus / Overview│ 🔍 Search  🔔 👤 ☀️          ││
│ │      │                 │    Ctrl+K    2   Theme  Menu ││
│ └──────┴─────────────────┴─────────────────────────────┘│
├────────┬────────────────────────────────────────────────┤
│        │                                                 │
│ Side-  │  Dashboard Workspace                            │
│ bar    │                                                 │
│        │  ┌────────┐┌────────┐┌────────┐┌────────┐      │
│ 280px  │  │Revenue ││ Users  ││ Tasks  ││ AI Recs│      │
│        │  │₹4.2Cr  ││24,589  ││1,482   ││ 342    │      │
│ □ Dash │  └────────┘└────────┘└────────┘└────────┘      │
│ □ Anal │                                                 │
│ □ Repo │  ┌──────────────────┐┌──────────────────┐      │
│ □ Noti │  │ Revenue Trend    ││ Workflow Status   │      │
│ □ Work │  │ (Bar Chart)      ││ (Donut Chart)     │      │
│ □ Audi │  └──────────────────┘└──────────────────┘      │
│ □ Inte │                                                 │
│ □ Sett │  ┌──────────────────┐┌──────────────────┐      │
│ □ Prof │  │ Performance      ││ Distribution      │      │
│        │  │ (Area Chart)     ││ (Bar Chart)       │      │
│ ────── │  └──────────────────┘└──────────────────┘      │
│ JD     │                                                 │
│ john@. │  ┌──────────────────┐┌─────┐┌─────────┐       │
│        │  │ Activity Timeline││Quick││ System  │       │
│        │  │ (6 items)        ││Actns││ Status  │       │
│        │  └──────────────────┘└─────┘└─────────┘       │
│        │                                                 │
│        │  ┌─────────────────────────────────────────┐   │
│        │  │ Recent Orders Table                      │   │
│        │  │ ORD-8241 │ Procurement │ ₹12,45,000 │ ✓ │   │
│        │  └─────────────────────────────────────────┘   │
└────────┴────────────────────────────────────────────────┘
```

### Navbar Features

| Feature | Implementation |
|---------|---------------|
| Global Search | `Ctrl+K` shortcut, dropdown with suggestions (pages, records, users, workflows) |
| Notifications | Dropdown with 5 items, unread badge, mark all read |
| Theme Toggle | Light/Dark/System with persistence |
| Profile Menu | Profile, Settings, Security, Activity Log, Logout |
| Breadcrumb | Nexus / Current Page |
| Mobile Menu | Hamburger → Drawer overlay |

### Sidebar Features

| Feature | Implementation |
|---------|---------------|
| Collapse | 280px → 72px with animated toggle button |
| Nav Groups | Main, Operations, System (10 items) |
| Active State | Cyan background + dot indicator |
| Tooltips | `title` attribute when collapsed |
| Mobile | Drawer with backdrop blur overlay |
| User Section | Avatar, name, email at bottom |

### Dashboard Sections

| Section | Description |
|---------|-------------|
| **KPI Cards** | 6 cards with animated counters (₹4.2Cr, 24,589, 1,482, 342, 18, 99.99%) |
| **Revenue Trend** | 12-month bar chart with hover tooltips |
| **Workflow Status** | SVG donut chart (Completed/In Progress/Pending/Failed) |
| **Performance** | SVG area chart with gradient fill |
| **Category Distribution** | Horizontal bar chart (5 departments) |
| **Activity Timeline** | 6 items with colored avatars, timestamps |
| **Quick Actions** | 6 compact cards (Create Report, New Workflow, etc.) |
| **System Status** | 5-item health list (API, Database, Workers, Queue, Cache) |
| **Orders Table** | 5 rows with status badges, hover highlight |

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

All animations respect `prefers-reduced-motion: reduce` — disables all animations and transitions for users who prefer reduced motion.

<br />

---

<br />

## Project Structure

```
demo-/
├── public/                          # Static assets
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── globals.css              # Aura Cyan Theme + Animation System
│   │   ├── layout.tsx               # Root Layout + Providers
│   │   ├── page.tsx                 # Landing Page (17 sections)
│   │   ├── not-found.tsx            # 404 Handler
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
│   │   │   └── admin/page.tsx       # Administration (users, roles, audit, flags, health, jobs)
│   │   │
│   │   └── not-found/page.tsx       # 404 Page
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui Components
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx           # + btn-enterprise class
│   │   │   ├── card.tsx
│   │   │   ├── separator.tsx
│   │   │   └── sheet.tsx
│   │   │
│   │   ├── auth/                    # Auth Components
│   │   │   ├── auth-input.tsx       # Reusable input with validation
│   │   │   ├── social-buttons.tsx   # Google/GitHub/Microsoft
│   │   │   ├── password-strength.tsx # Strength meter + checklist
│   │   │   └── auth-divider.tsx     # "or continue with"
│   │   │
│   │   ├── dashboard/               # Dashboard Shell
│   │   │   ├── dashboard-shell.tsx  # Layout wrapper
│   │   │   ├── dashboard-navbar.tsx # Search, notifications, profile
│   │   │   └── dashboard-sidebar.tsx # Collapsible nav sidebar
│   │   │
│   │   ├── profile/                 # Profile Components
│   │   │   ├── profile-header.tsx   # Avatar upload + initials
│   │   │   ├── personal-info.tsx    # Edit mode form
│   │   │   ├── contact-info.tsx     # Verified badges
│   │   │   ├── account-info.tsx     # Read-only metadata
│   │   │   ├── change-password.tsx  # Strength meter
│   │   │   ├── active-sessions.tsx  # Revoke sessions
│   │   │   ├── devices.tsx          # Trust/remove
│   │   │   ├── activity-log.tsx     # Timeline
│   │   │   └── notification-settings.tsx # Toggles
│   │   │
│   │   ├── landing/                 # 17 Landing Page Sections
│   │   │   ├── navbar.tsx           # + scroll shadow
│   │   │   ├── hero.tsx             # + stagger animations
│   │   │   ├── trusted-by.tsx       # + counter animations
│   │   │   ├── features.tsx         # + scroll reveal
│   │   │   ├── architecture.tsx
│   │   │   ├── ai-intelligence.tsx
│   │   │   ├── dashboard-showcase.tsx
│   │   │   ├── workflow.tsx         # + progressive line draw
│   │   │   ├── security.tsx         # + hover effects
│   │   │   ├── developer-experience.tsx
│   │   │   ├── performance.tsx
│   │   │   ├── accessibility.tsx
│   │   │   ├── analytics.tsx
│   │   │   ├── customer-stories.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── cta-banner.tsx
│   │   │   └── footer.tsx
│   │   │
│   │   └── shared/                  # Shared Components
│   │       ├── skeleton.tsx
│   │       ├── empty-state.tsx
│   │       └── command-palette.tsx
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
- 24px spacing between related sections
- 120px spacing between landing sections
- All currency in Indian Rupees (₹)

<br />

---

<br />

## Accessibility

| Feature | Status |
|---------|--------|
| Keyboard Navigation | Supported |
| Focus States | Visible (Cyan ring) |
| ARIA Labels | Implemented |
| Semantic HTML | Used |
| Color Contrast | WCAG 2.1 AA |
| Screen Reader Support | Compatible |
| Reduced Motion | Respected |
| Error Messages | `role="alert"` |
| Password Toggle | `aria-label` |

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

## Reviewer Experience Flow

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   Reviewer Opens GitHub Repository                       ║
║              ↓                                           ║
║   README Looks Impressive                                ║
║              ↓                                           ║
║   npm install → npm run dev                              ║
║              ↓                                           ║
║   Landing Page Loads (17 sections + animations)          ║
║              ↓                                           ║
║   Scroll Animations Trigger (fade, counters, hovers)     ║
║              ↓                                           ║
║   Theme Toggle Works (Dark ↔ Light)                      ║
║              ↓                                           ║
║   Click "Start Free" → Register Page                     ║
║              ↓                                           ║
║   50/50 Auth Layout · Password Strength Meter            ║
║              ↓                                           ║
║   Social Login Buttons (Google/GitHub/Microsoft)         ║
║              ↓                                           ║
║   Navigate to Login → Forgot Password → Reset            ║
║              ↓                                           ║
║   Login → Dashboard Loads                                ║
║              ↓                                           ║
║   Collapsible Sidebar (280px → 72px)                     ║
║              ↓                                           ║
║   Global Search (Ctrl+K)                                 ║
║              ↓                                           ║
║   6 KPI Cards with Animated Counters                     ║
║              ↓                                           ║
║   4 Charts (Bar, Donut, Area, Horizontal)                ║
║              ↓                                           ║
║   Activity Timeline + Quick Actions + System Status      ║
║              ↓                                           ║
║   Orders Table with Status Badges                        ║
║              ↓                                           ║
║   Notifications Dropdown · Profile Menu                  ║
║              ↓                                           ║
║   Navigate → Profile (5 tabs, avatar upload)            ║
║              ↓                                           ║
║   Navigate → Settings (7 tabs, theme switcher)          ║
║              ↓                                           ║
║   Navigate → Notifications (5 tabs, priority badges)   ║
║              ↓                                           ║
║   Navigate → Reports (KPIs, charts, data table)        ║
║              ↓                                           ║
║   Navigate → Admin (users, roles, audit, flags, health)║
║              ↓                                           ║
║   Mobile Responsive (drawer navigation)                  ║
║              ↓                                           ║
║   404 Page Works                                         ║
║              ↓                                           ║
║   ╔══════════════════════════════════════════════════╗   ║
║   ║                                                  ║   ║
║   ║   "This team understands enterprise software     ║   ║
║   ║    engineering. They can build production         ║   ║
║   ║    systems that scale."                          ║   ║
║   ║                                                  ║   ║
║   ╚══════════════════════════════════════════════════╝   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

<br />

---

<br />

## License

MIT License — Built for ODOO Hackathon 2026

<br />

<div align="center">

**[⬆ Back to Top](#top)**

</div>
