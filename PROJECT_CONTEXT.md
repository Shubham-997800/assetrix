# Nexus Platform - Complete Project Context

## Project Overview
**Name:** Nexus Platform (demo)
**Description:** Enterprise Business Operating System with workflow automation, AI insights, and real-time analytics
**Port:** 5173

---

## Tech Stack
| Technology | Version |
|------------|---------|
| Next.js | 16.2.10 |
| React | 19.2.4 |
| TypeScript | ^5 |
| Tailwind CSS | v4 |
| shadcn/ui | ^4.13.0 |
| recharts | ^3.9.2 |
| next-themes | ^0.4.6 |
| lucide-react | ^1.24.0 |

---

## Project Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout (Inter font, ThemeProvider, CommandPalette)
│   ├── page.tsx                 # Landing page (16 sections)
│   ├── globals.css              # Global styles
│   ├── not-found.tsx            # 404 page
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   ├── forgot-password/page.tsx # Forgot password
│   ├── reset-password/page.tsx  # Reset password
│   ├── verify-email/page.tsx    # Email verification
│   └── dashboard/               # Dashboard section
│       ├── layout.tsx           # Dashboard layout (DashboardShell wrapper)
│       ├── page.tsx             # Main dashboard page
│       ├── admin/               # Admin section
│       ├── notifications/       # Notifications page
│       ├── profile/             # User profile
│       ├── reports/             # Reports section
│       └── settings/            # Settings page
│
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── auth-divider.tsx
│   │   ├── auth-input.tsx
│   │   ├── password-strength.tsx
│   │   └── social-buttons.tsx
│   │
│   ├── dashboard/               # Dashboard components
│   │   ├── dashboard-shell.tsx  # Main dashboard layout (sidebar + navbar + content)
│   │   ├── dashboard-sidebar.tsx # Collapsible sidebar with navigation groups
│   │   └── dashboard-navbar.tsx  # Top navbar with search, notifications, profile
│   │
│   ├── landing/                 # Landing page sections (19 components)
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── trusted-by.tsx
│   │   ├── features.tsx
│   │   ├── architecture.tsx
│   │   ├── ai-intelligence.tsx
│   │   ├── dashboard-showcase.tsx
│   │   ├── workflow.tsx
│   │   ├── security.tsx
│   │   ├── developer-experience.tsx
│   │   ├── performance.tsx
│   │   ├── accessibility.tsx
│   │   ├── analytics.tsx
│   │   ├── analytics-preview.tsx
│   │   ├── customer-stories.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq.tsx
│   │   ├── cta-banner.tsx
│   │   └── footer.tsx
│   │
│   ├── shared/                  # Shared components
│   │   └── command-palette.tsx
│   │
│   ├── profile/                 # Profile components
│   │
│   ├── ui/                      # shadcn/ui components
│   │   ├── accordion.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── separator.tsx
│   │   └── sheet.tsx
│   │
│   ├── theme-provider.tsx       # next-themes provider
│   └── theme-toggle.tsx         # Dark/light mode toggle
│
├── contexts/
│   └── dashboard-context.tsx    # Dashboard state (sidebar, mobile drawer, command palette)
│
├── hooks/
│   ├── use-count-up.ts         # Animation hook
│   ├── use-in-view.ts          # Intersection observer hook
│   └── use-scroll-shadow.ts    # Scroll shadow hook
│
└── lib/
    └── utils.ts                # Utility functions (cn helper for classNames)
```

---

## Key Components Details

### DashboardShell (`components/dashboard/dashboard-shell.tsx`)
- Wraps entire dashboard with DashboardProvider context
- Layout: Fixed sidebar (left) + Flex column (right: navbar + main content)
- Has "Skip to content" accessibility link
- Content area: `max-w-7xl` with responsive padding

### DashboardSidebar (`components/dashboard/dashboard-sidebar.tsx`)
- **States:** Collapsible (desktop), Mobile drawer (with backdrop)
- **Navigation Groups:**
  - Main: Dashboard, Analytics, Reports
  - Operations: Notifications, Workflows, Audit Logs
  - System: Integrations, Admin, Settings, Profile
- **Features:**
  - Active state highlighting with primary color dot
  - Collapse toggle button (ChevronLeft icon)
  - User section at bottom (JD - John Doe)
  - Keyboard: Escape closes mobile drawer
  - Auto-close on resize to desktop

### DashboardNavbar (`components/dashboard/dashboard-navbar.tsx`)
- **Left:** Mobile menu button, Sidebar toggle, Breadcrumb (Nexus / Page)
- **Center:** Search input with suggestions dropdown
- **Right:** Command palette button, Help, Notifications (with badge), Theme toggle, Profile dropdown
- **Features:**
  - Ctrl+K opens command palette
  - Search suggestions: pages, records, users, workflows, reports
  - Notification dropdown with read/unread states
  - Profile dropdown: Profile, Settings, Security, Activity Log, Log out

### DashboardContext (`contexts/dashboard-context.tsx`)
- **State:**
  - `sidebarCollapsed: boolean` - Desktop sidebar collapse state
  - `mobileDrawerOpen: boolean` - Mobile drawer visibility
  - `commandOpen: boolean` - Command palette visibility
- **Methods:**
  - `toggleSidebar()` - Toggle sidebar collapse
  - `setMobileDrawerOpen(open)` - Set mobile drawer state
  - `setCommandOpen(open)` - Set command palette state

---

## Landing Page Sections (16 total)
1. Navbar - Navigation header
2. Hero - Main hero section
3. TrustedBy - Company logos/trust indicators
4. Features - Feature cards
5. PlatformArchitecture - Architecture diagram/section
6. AIIntelligence - AI features section
7. DashboardShowcase - Dashboard preview
8. Workflow - Workflow visualization
9. Security - Security features
10. DeveloperExperience - DX features
11. Performance - Performance metrics
12. Accessibility - Accessibility features
13. Analytics - Analytics preview
14. CustomerStories - Testimonials
15. FAQ - Frequently asked questions
16. CTABanner - Call to action
+ Footer

---

## Design Patterns & Conventions

### Styling
- Tailwind CSS v4 with `tailwind-merge` for class merging
- Uses `cn()` utility from `lib/utils.ts` for conditional classes
- Theme support via `next-themes` (light/dark mode)
- Color scheme: Primary (brand), Muted (subtle), Destructive (errors)

### Component Patterns
- Client components: `"use client"` directive
- Server components: Default (no directive)
- Props interfaces defined inline or at top of file
- Hooks for reusable logic (use-count-up, use-in-view, use-scroll-shadow)

### Accessibility
- ARIA labels on interactive elements
- `aria-hidden="true"` on decorative icons
- Skip to content link
- Keyboard navigation support
- Focus management

### State Management
- React Context for dashboard state
- Local state for UI interactions (dropdowns, search)
- No external state library (Redux, Zustand)

---

## Commands
```bash
npm run dev      # Start dev server on port 5173
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Important Notes
1. **Next.js 16 Breaking Changes:** Check `node_modules/next/dist/docs/` before writing code
2. **No Backend:** Currently frontend-only with mock data
3. **No Authentication:** Auth pages exist but no actual auth logic
4. **Hardcoded Data:** User info (John Doe), notifications, search suggestions are static

---

## Current State
- ✅ Landing page complete with 16 sections
- ✅ Dashboard layout with sidebar, navbar, shell
- ✅ Theme support (light/dark)
- ✅ Command palette
- ✅ Auth page UIs (login, register, forgot/reset password, verify email)
- ❌ No backend API integration
- ❌ No actual authentication
- ❌ No real data fetching
- ❌ Dashboard pages are placeholders
