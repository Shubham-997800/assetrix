<div align="center">

# Nexus Platform

### Enterprise Business Operating System

**The AI-powered platform for workflow automation, real-time analytics, and intelligent decision support.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](#)

</div>

---

## Live Preview

```
http://localhost:3000
```

| Page | Route |
|------|-------|
| Landing Page | `/` |
| Login | `/login` |
| Register | `/register` |
| Forgot Password | `/forgot-password` |
| Dashboard | `/dashboard` |
| 404 | Any invalid route |

---

## Design System — Aura Cyan Edition

<div align="center">

| Light Mode | Dark Mode |
|-----------|-----------|
| `#F8FAFC` Background | `#020617` Background |
| `#FFFFFF` Card | `#0F172A` Card |
| `#E2E8F0` Border | `#1E293B` Border |
| `#0891B2` Primary | `#22D3EE` Primary |
| `#0F172A` Text | `#F8FAFC` Text |
| `#64748B` Secondary | `#94A3B8` Secondary |

</div>

### Brand Colors

```
Primary:    #0891B2    ████    Actions, Links, Focus
Accent:     #22D3EE    ████    Active States, AI Highlights
Success:    #10B981    ████    Approvals, Positive Metrics
Warning:    #F59E0B    ████    Pending, Attention
Error:      #EF4444    ████    Destructive, Alerts
```

---

## Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css               # Aura Cyan Theme (Light + Dark)
│   ├── layout.tsx                # Root Layout + ThemeProvider + Command Palette
│   ├── page.tsx                  # Landing Page (17 sections)
│   ├── login/page.tsx            # Authentication — Login
│   ├── register/page.tsx         # Authentication — Register
│   ├── forgot-password/page.tsx  # Authentication — Reset
│   ├── dashboard/page.tsx        # Enterprise Dashboard
│   └── not-found.tsx             # 404 Error Page
│
├── components/
│   ├── ui/                       # shadcn/ui Components
│   │   ├── accordion.tsx         # Accordion (FAQ)
│   │   ├── avatar.tsx            # Avatar
│   │   ├── badge.tsx             # Badge
│   │   ├── button.tsx            # Button System
│   │   ├── card.tsx              # Card
│   │   ├── separator.tsx         # Separator
│   │   └── sheet.tsx             # Sheet (Mobile Nav)
│   │
│   ├── landing/                  # Landing Page Sections
│   │   ├── navbar.tsx            # Sticky Navigation Bar
│   │   ├── hero.tsx              # Hero + Dashboard Preview
│   │   ├── trusted-by.tsx        # Enterprise Trust Bar
│   │   ├── features.tsx          # 8-Card Feature Grid
│   │   ├── architecture.tsx      # Platform Architecture Pipeline
│   │   ├── ai-intelligence.tsx   # AI Recommendation Showcase
│   │   ├── dashboard-showcase.tsx# Full Dashboard Preview
│   │   ├── workflow.tsx          # 5-Step Workflow Timeline
│   │   ├── security.tsx          # Security + Compliance Cards
│   │   ├── developer-experience.tsx # APIs, SDKs, Webhooks
│   │   ├── performance.tsx       # Performance Stats
│   │   ├── accessibility.tsx     # Accessibility Commitment
│   │   ├── analytics.tsx         # Charts + Analytics Preview
│   │   ├── customer-stories.tsx  # Enterprise Testimonials
│   │   ├── faq.tsx               # FAQ Accordion
│   │   ├── cta-banner.tsx        # Final CTA
│   │   └── footer.tsx            # Footer
│   │
│   └── shared/                   # Shared Components
│       ├── skeleton.tsx          # Skeleton Loading States
│       ├── empty-state.tsx       # Empty State Components
│       ├── command-palette.tsx   # Command Palette (Ctrl+K)
│       └── auth-layout.tsx       # Auth Page Layout
│
└── lib/
    └── utils.ts                  # cn() Utility
```

---

## Landing Page Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | **Navbar** | Sticky, 64px, solid background, theme toggle, mobile sheet |
| 2 | **Hero** | Left/right split with live dashboard mockup + floating KPI cards |
| 3 | **Trust Bar** | 5 company placeholders + 4 global metrics |
| 4 | **Features Grid** | 8 enterprise feature cards with icons |
| 5 | **Platform Architecture** | 7-step visual pipeline diagram |
| 6 | **AI Intelligence** | Pipeline visualization + AI recommendation card |
| 7 | **Dashboard Showcase** | Full browser-frame dashboard with KPIs, charts, table |
| 8 | **Workflow** | 5-step horizontal timeline |
| 9 | **Security** | 6 security cards + 4 compliance metrics |
| 10 | **Developer Experience** | REST APIs, Webhooks, SDK, Docs + code preview |
| 11 | **Performance** | 5 performance cards + 4 stats |
| 12 | **Accessibility** | 5 accessibility commitment cards |
| 13 | **Analytics** | 5 metrics + 4 chart types |
| 14 | **Customer Stories** | 3 enterprise testimonial cards |
| 15 | **FAQ** | 6 accordion items |
| 16 | **Final CTA** | Call-to-action banner |
| 17 | **Footer** | Product, Company, Legal + social links |

---

## Enterprise Features

### Authentication System
- Login with email/password
- Register with company details
- Forgot password flow
- Show/hide password toggle
- Form validation states

### Dashboard
- Sidebar navigation (280px)
- KPI cards with metrics
- Revenue chart with 12 months
- Activity feed
- Notification center
- Data table with status badges
- Export CSV action
- Mobile responsive sidebar

### Productivity
- Command Palette (Ctrl+K)
- Dark/Light theme toggle
- Skeleton loading states
- Empty state components
- 404 error page

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety across codebase |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Pre-built accessible components |
| Lucide React | Consistent icon system |
| next-themes | Dark/light mode persistence |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/nexus-platform.git

# Navigate to project
cd nexus-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

---

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## Design Principles

```
Structure over decoration
Consistency over creativity
Clarity over complexity
Professionalism over personality
```

### Rules

- Single brand color: Cyan (`#0891B2` / `#22D3EE`)
- 80% neutral colors + 20% accent colors
- No gradients, no neon, no glassmorphism
- Soft shadows only (`0 1px 2px rgba(0,0,0,0.05)`)
- 16px border radius for cards
- 12px border radius for buttons/inputs
- Inter typography (400, 500, 600, 700)
- 24px spacing between related sections
- 120px spacing between landing sections

---

## Reviewer Experience Flow

```
Reviewer Opens Project
        ↓
Landing Page Looks Premium
        ↓
Dashboard Feels Professional
        ↓
Navigation Feels Natural
        ↓
Authentication Works
        ↓
Theme Toggle Works
        ↓
Command Palette Works
        ↓
Loading States Exist
        ↓
Empty States Exist
        ↓
Everything Feels Consistent
        ↓
Reviewer Thinks:
"This team understands enterprise software engineering."
```

---

<div align="center">

**Built for ODOO Hackathon 2026**

</div>
