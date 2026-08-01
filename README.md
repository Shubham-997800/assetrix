<a id="top"></a>

<!-- ===================== ANIMATED HEADER ===================== -->
<div align="center">

![Assetrix](public/banner.svg)

</div>

<div align="center">

# <img src="public/logo.svg" width="36" align="center" /> **Assetrix** — Enterprise Asset Intelligence Platform

### Track assets. Automate maintenance. Optimize allocations. Audit compliance.

*From registration to retirement — one platform that transforms asset management from manual tracking into operational intelligence.*

<br/>

<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-0891B2?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="MIT License"/></a>
<a href="https://github.com/Shubham-997800/assetrix/releases"><img src="https://img.shields.io/github/v/release/Shubham-997800/assetrix?style=for-the-badge&label=Release&color=10B981" alt="Release"/></a>
<img src="https://img.shields.io/badge/Build-Passing-10B981?style=for-the-badge&logo=github&logoColor=white" alt="Build"/>
<a href="https://vercel.com"><img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/></a>
<a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/></a>
<a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node"/></a>
<a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/></a>
<a href="https://github.com/Shubham-997800/assetrix"><img src="https://img.shields.io/badge/PRs-Welcome-22D3EE?style=for-the-badge&logo=github&logoColor=white" alt="PRs Welcome"/></a>

<br/>

[**Live Platform**](https://assetrix-nu.vercel.app) · [**API Docs**](https://assetrix-backend-production-9a94.up.railway.app/api-docs) · [**GitHub**](https://github.com/Shubham-997800/assetrix) · [**Report a Bug**](https://github.com/Shubham-997800/assetrix/issues/new/choose)

</div>

<br/>

> ## ⚠️ Deployment status (verified 1 Aug 2026)
> The **frontend is live** at [assetrix-nu.vercel.app](https://assetrix-nu.vercel.app) and builds cleanly.
> The **backend API** domain (`assetrix-backend-production-9a94.up.railway.app`) currently **does not resolve** — the API is offline. The platform will not be fully functional until the backend is redeployed. See [Deployment](#deployment) and [Known Issues](#known-issues).

<br/>

---

## 📚 Table of Contents

<details>
<summary><b>Click to expand</b></summary>

1. [What This Platform Does](#what-this-platform-does)
2. [Why This Exists](#why-this-exists)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Project Flow](#project-flow)
6. [Architecture](#architecture)
7. [Folder Structure](#folder-structure)
8. [Database Schema](#database-schema)
9. [Installation](#installation)
10. [Environment Variables](#environment-variables)
11. [Deployment](#deployment)
12. [API Documentation](#api-documentation)
13. [User Roles & Permissions](#user-roles--permissions)
14. [Project Timeline](#project-timeline)
15. [Roadmap](#roadmap)
16. [Known Issues](#known-issues)
17. [Future Improvements](#future-improvements)
18. [Contributing](#contributing)
19. [Coding Standards](#coding-standards)
20. [License](#license)
21. [Acknowledgements](#acknowledgements)
22. [Contact](#contact)

</details>

<br/>

---

## What This Platform Does

Assetrix is a **full-stack enterprise ERP platform** for organizations that manage physical assets at scale — hospitals tracking medical equipment, universities managing lab instruments, enterprises governing IT infrastructure, and manufacturers monitoring production tools.

It replaces spreadsheets, email chains, and fragmented tools with a **unified operational system** providing real-time visibility into every asset's lifecycle.

```
 REGISTRATION  →  ALLOCATION  →  TRANSFER  →  MAINTENANCE  →  AUDIT  →  ANALYTICS
```

### Why This Exists

| The Problem | The Reality | The Impact |
|:-----------:|:-----------:|:----------:|
| Spreadsheet Tracking | Many enterprises still use Excel for asset management | Significant annual loss from asset mismanagement |
| Email-based Approvals | Average 3+ days to process allocation requests | Productivity loss during waiting periods |
| Reactive Maintenance | Unplanned downtime costs far more than planned | Most equipment failures are preventable |
| Manual Audit Cycles | Audit preparation takes 2–4 weeks per cycle | Auditor time spent on data gathering |

Assetrix exists because **asset management should not be an operational bottleneck.**

<br/>

---

## Features

<details open>
<summary><b>Core modules</b></summary>

### 📊 Dashboard
Real-time operational command center with KPI cards, 12-month utilization trends, maintenance queue, activity timeline, and upcoming-return alerts.

### 🏛️ Organization Setup
Department hierarchy with parent–child relationships, department heads, and an employee directory with role assignments.

### 🖥️ Asset Directory
Register assets with purchase details, warranty, and location; auto-generate asset tags and QR codes; track condition, depreciation, and current value across 15+ attributes.

### 🔁 Allocation & Transfer
Conflict-free asset assignment with real-time availability checks, multi-level approval workflows, and a complete allocation history audit trail.

### 📅 Resource Booking
Shared-resource scheduling with automatic overlap validation, calendar view, and approval workflows.

### 🔧 Maintenance Operations
Preventive and reactive maintenance with priority levels, automatic technician assignment, and a `SCHEDULED → IN_PROGRESS → COMPLETED` workflow with cost tracking.

### 🛡️ Audit Management
Audit cycles with defined scope, auditor assignments, physical verification, discrepancy reports, and compliance scoring.

### 📈 Reports & Analytics
Utilization reports, maintenance trends, booking heatmaps, idle-asset detection, and CSV/PDF/Excel export.

### 🔔 Notifications
Multi-channel alerts (in-app + email) with per-channel preferences and customizable templates.

### 🧠 AI Operational Intelligence
Rule-based health scoring, maintenance predictions, idle-asset detection, and resource-optimization recommendations.

</details>

> **Note on the "AI" layer:** the intelligence engine is **rule-based/heuristic** (health-score formulas, condition penalty tables, age-based recommendations) — it does not call an external ML model.

<br/>

---

## Tech Stack

> All versions below are pinned in the repository (`package.json` / `backend/package.json`) — nothing is invented.

### Frontend

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| [Next.js](https://nextjs.org) | `16.2.10` | App Router, Server Components, Turbopack bundler, Edge Middleware |
| [React](https://react.dev) | `19.2.4` | UI library (concurrent rendering) |
| [TypeScript](https://www.typescriptlang.org) | `^5` | Strict type safety across the whole frontend |
| [Tailwind CSS](https://tailwindcss.com) | `^4` | Utility-first styling with the **Aura Cyan** design-token system |
| [@base-ui/react](https://base-ui.com) | `^1.6.0` | Headless, accessible primitives (Button, Dialog/Sheet, Render) |
| [shadcn/ui](https://ui.shadcn.com) | `^4.13.0` (CLI) | Component scaffolding + style conventions |
| [class-variance-authority](https://cva.style) | `^0.7.1` | Variant API for `button` / `badge` (cva `variants`) |
| [clsx](https://github.com/lukeed/clsx) | `^2.1.1` | Conditional class joining |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | `^3.6.0` | Dedupes conflicting Tailwind classes (`cn()` helper) |
| [Recharts](https://recharts.org) | `^3.9.2` | Dashboard data visualization (charts) |
| [Lucide React](https://lucide.dev) | `^1.24.0` | Icon system (500+ stroke icons) |
| [next-themes](https://github.com/pacocoursey/next-themes) | `^0.4.6` | Dark / Light / System theme provider |
| [tw-animate-css](https://github.com/CosmoDevDev/tw-animate-css) | `^1.4.0` | Tailwind-compatible animation utilities (fade, bounce, pulse) |
| [ESLint](https://eslint.org) + `eslint-config-next` | `^9` / `16.2.10` | Linting (`npm run lint`) |
| [@tailwindcss/postcss](https://tailwindcss.com) | `^4` | Tailwind v4 PostCSS plugin |

### Backend

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| [Node.js](https://nodejs.org) | `^22` (types) | Runtime |
| [Express.js](https://expressjs.com) | `^4.21.2` | REST API framework (`/api/v1`) |
| [Prisma ORM](https://www.prisma.io) | `^6.9.0` | Type-safe schema-first database access (27 models, 15 enums) |
| [PostgreSQL](https://www.postgresql.org) | — (schema: `postgresql`) | Primary database |
| [Redis](https://redis.io) + [ioredis](https://github.com/redis/ioredis) | `^5.6.0` | Sessions, refresh-token store, cache, rate-limit backing |
| [BullMQ](https://docs.bullmq.io) | `^5.25.0` | Background job queues (email, notifications, reports, AI, audit, cleanup, maintenance, images) |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | `^9.0.2` | JWT access tokens (15 min) + refresh-token rotation (7 d) |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | `^5.1.1` | Password hashing (12 salt rounds) |
| [Zod](https://zod.dev) | `^3.24.4` | Runtime request validation (10 validator modules) |
| [Helmet](https://helmetjs.github.io) | `^8.0.0` | Security HTTP headers |
| [express-rate-limit](https://express-rate-limit.github.io) | `^7.5.0` | Rate limiting (global 100/15 min, auth 10/15 min) |
| [cors](https://github.com/expressjs/cors) | `^2.8.5` | Cross-origin resource sharing (allow-list) |
| [cookie-parser](https://github.com/expressjs/cookie-parser) | `^1.4.7` | Refresh-token httpOnly cookies |
| [compression](https://github.com/expressjs/compression) | `^1.7.5` | Gzip response compression |
| [multer](https://github.com/expressjs/multer) | `^1.4.5-lts.1` | Multipart file upload middleware (10 MB, MIME allow-list) |
| [Nodemailer](https://nodemailer.com) | `^9.0.3` | Transactional email (welcome, verification, reset, alerts) |
| [Pino](https://getpino.io) | `^9.6.0` | Structured logging (`pino-pretty` in dev) |
| [Swagger / OpenAPI](https://swagger.io) | `swagger-jsdoc ^6.2.8`, `swagger-ui-express ^5.0.1` | Auto-generated API docs at `/api-docs` (dev) |
| [ExcelJS](https://github.com/exceljs/exceljs) | `^4.4.0` | `.xlsx` report export |
| [PDFKit](https://pdfkit.org) | `^0.19.1` | PDF report generation |
| [uuid](https://github.com/uuidjs/uuid) | `^11.1.0` | ID + token generation |
| [dotenv](https://github.com/motdotla/dotenv) | `^16.4.7` | Environment variable loading |

**Backend tooling** — `tsx` (dev runner), `ts-node` (seed runner), `jest ^29` + `supertest` + `ts-jest` (unit/integration tests), `eslint ^9` + `typescript-eslint`, `prettier ^3.5`, `husky ^9` + `lint-staged` (pre-commit hooks).

### Infrastructure

| Technology | Purpose |
|:-----------|:--------|
| [Vercel](https://vercel.com) | Frontend hosting + Edge Network (live: `assetrix-nu.vercel.app`) |
| [Railway](https://railway.app) | Backend hosting + managed PostgreSQL + Redis |
| [Docker](https://www.docker.com) | Multi-stage backend build (`backend/Dockerfile` + `docker-compose.yml`) |
| [GitHub](https://github.com/Shubham-997800/assetrix) | Source control, issues, PR templates |

<br/>

---

## Project Flow

### End-to-end lifecycle

```mermaid
flowchart LR
    A[Register Asset] --> B[Allocate to Employee]
    B --> C[Book / Schedule]
    C --> D[Maintenance]
    D --> E[Audit Verification]
    E --> F[Analytics & Reports]
    F --> G[Retire / Dispose]
    G -.-> A
```

### Asset Allocation

```mermaid
sequenceDiagram
    participant E as Employee
    participant M as Manager
    participant S as System
    E->>S: Request allocation
    S->>S: Availability + conflict check
    alt Available
        S-->>M: Approval request
        M-->>S: Approve
        S-->>E: Allocated + notification
    else Conflict
        S-->>E: Conflict detected
    end
```

### Maintenance Workflow

```mermaid
graph LR
    A[Issue Reported] --> B[SCHEDULED]
    B --> C[APPROVED]
    C --> D[ASSIGN Technician]
    D --> E[IN_PROGRESS]
    E --> F[COMPLETED]
    F --> G[Asset Available]
```

### Booking Overlap Check

```mermaid
graph LR
    A[Book Resource] --> B{Overlap Check}
    B -->|No Conflict| C[APPROVED]
    B -->|Conflict| D[REJECTED]
```

<br/>

---

## Architecture

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Next[Next.js 16 · React 19 · Tailwind]
        Mid[Edge Middleware<br/>JWT gate · CSP · headers]
    end
    subgraph API["API Layer"]
        Express[Express 4 REST API]
        Prisma[Prisma ORM]
        Bull[BullMQ Workers]
        Swagger[Swagger/OpenAPI]
    end
    subgraph Data["Data Layer"]
        PG[(PostgreSQL)]
        Redis[(Redis)]
        Files[Uploads / Documents]
    end
    Next --> Mid
    Mid -->|/api/v1| Express
    Express --> Prisma
    Express --> Bull
    Prisma --> PG
    Bull --> Redis
    Express --> Redis
    Express --> Files
```

### Security layers

| Layer | Implementation |
|:------|:---------------|
| Authentication | JWT access (15 min) + rotating refresh (7 d), Redis-backed sessions |
| Authorization | Role-based access control (`SUPER_ADMIN`, `ADMIN`, `DEPARTMENT_MANAGER`, `TECHNICIAN`, `EMPLOYEE`) |
| Password security | bcrypt (12 rounds), lockout after 5 failed attempts |
| Session management | Device tracking, concurrency limit (5), revocation, login history |
| Input validation | Zod schemas on all endpoints |
| Headers | Helmet + CSP + HSTS + X-Frame-Options + Permissions-Policy |
| Rate limiting | Global + stricter auth limits |
| Audit trail | Full activity logging with IP + user attribution |

<br/>

---

## Folder Structure

```
assetrix/
├── src/                          # Next.js App Router frontend
│   ├── app/
│   │   ├── layout.tsx            # Root layout, fonts, theme, providers
│   │   ├── page.tsx              # Landing page (force-static)
│   │   ├── login/ register/ forgot-password/ reset-password/
│   │   ├── verify-email/ session-expired/
│   │   └── dashboard/            # 11 operational modules
│   │       ├── assets/ · allocations/ · bookings/ · maintenance/
│   │       ├── audit/ · reports/ · notifications/ · organization/
│   │       ├── profile/ · settings/ · logs/
│   │       └── **/_components/   # tabs · forms · tables · data · types
│   ├── components/
│   │   ├── ui/ · auth/ · profile/
│   │   ├── dashboard/            # shell, navbar, sidebar, charts/
│   │   ├── landing/              # hero, features, workflow, analytics…
│   │   └── shared/               # ai-panel, command-palette, global-search…
│   ├── contexts/                 # auth-context, dashboard-context
│   ├── hooks/ · lib/             # api.ts (13 API modules), types.ts
│   └── app/globals.css
│
├── backend/                      # Express 4 + Prisma 6 + BullMQ
│   ├── prisma/
│   │   ├── schema.prisma         # 27 models + 17 enums
│   │   ├── migrations/           # initial migration
│   │   └── seed.ts               # demo users + data
│   ├── src/
│   │   ├── app.ts                # bootstrap
│   │   ├── config/               # env · db · redis · logger · swagger
│   │   ├── controllers/          # 16 route handlers
│   │   ├── services/             # 16 business-logic modules
│   │   ├── routes/               # 16 route definitions
│   │   ├── middleware/           # auth · error · rateLimit · upload · validate
│   │   ├── validators/           # Zod schemas
│   │   ├── queues/               # BullMQ queues + workers
│   │   ├── notifications/ · audit/ · utils/ · constants/
│   │   └── tests/                # Jest (unit + integration)
│   ├── Dockerfile · docker-compose.yml · .env.example
│   └── package.json
│
├── docs/                         # Health & final reports
├── .github/                      # Issue + PR templates
├── middleware.ts · next.config.ts · vercel.json · railway.json
├── package.json · tsconfig.json · eslint.config.mjs
└── README.md
```

<br/>

---

## Database Schema

27 Prisma models. ER overview:

```mermaid
erDiagram
    USER ||--o{ SESSION : owns
    USER ||--o{ DEPARTMENT : heads
    DEPARTMENT ||--o{ USER : contains
    DEPARTMENT ||--o{ ASSET : owns
    ASSETCATEGORY ||--o{ ASSET : classifies
    ASSET ||--o{ ALLOCATION : allocated
    USER ||--o{ ALLOCATION : receives
    ASSET ||--o{ BOOKING : booked
    USER ||--o{ BOOKING : books
    ASSET ||--o{ MAINTENANCETASK : maintained
    MAINTENANCESCHEDULE ||--o{ MAINTENANCETASK : schedules
    AUDITCYCLE ||--o{ AUDITVERIFICATION : verifies
    AUDITCYCLE ||--o{ AUDITDISCREPANCY : flags
    AUDITCYCLE ||--o{ AUDITASSIGNMENT : assigns
    ASSET ||--o{ AUDITVERIFICATION : audited
    USER ||--o{ AUDITDISCREPANCY : reports
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ REPORT : generates
    ASSET ||--o{ AIRECOMMENDATION : suggested
    USER ||--o{ LOGINHISTORY : logs
    USER ||--o{ REFRESHTOKEN : refresh
```

**Model list:** `User` · `Session` · `RefreshToken` · `VerificationToken` · `PasswordResetToken` · `LoginHistory` · `Department` · `AssetCategory` · `Asset` · `AssetDocument` · `AssetHistory` · `Allocation` · `Booking` · `MaintenanceSchedule` · `MaintenanceTask` · `MaintenanceAttachment` · `Notification` · `AuditLog` · `ActivityLog` · `AIRecommendation` · `SystemSetting` · `Report` · `AuditCycle` · `AuditAssignment` · `AuditVerification` · `AuditDiscrepancy` · `NotificationPreference`

> Full schema: [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma)

<br/>

---

## Installation

### Prerequisites

| Tool | Version |
|:-----|:--------|
| Node.js | **20+** (recommended LTS, tested on 22/24) |
| npm | 10+ |
| PostgreSQL | 16+ |
| Redis | 7+ |

> **Optional:** Docker Compose can provision PostgreSQL + Redis (`backend/docker-compose.yml`).

### 1. Clone

```bash
git clone https://github.com/Shubham-997800/assetrix.git
cd assetrix
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend && npm install && cd ..
```

### 3. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env — database URL, Redis, JWT secrets, SMTP
```

### 4. Initialize the database

```bash
cd backend
npx prisma db push        # create/update schema
npx tsx prisma/seed.ts    # optional: demo users + data
cd ..
```

### 5. Run locally

```bash
# Terminal 1 — backend  → http://localhost:5000
cd backend && npm run dev

# Terminal 2 — frontend → http://localhost:5173
cd .. && npm run dev
```

The frontend proxies `/api/*` to the backend automatically via `next.config.ts`.

### Demo credentials (after seeding)

| Role | Email | Password |
|:-----|:------|:---------|
| Admin | `admin@assetrix.com` | `Admin@123` |
| Asset Manager | `asset.manager@assetrix.com` | `Manager@123` |
| Department Head | `dept.head@assetrix.com` | `DeptHead@123` |
| Employee | `employee1@assetrix.com` | `Employee@123` |
| Employee | `employee2@assetrix.com` | `Employee@123` |
| Auditor | `auditor@assetrix.com` | `Auditor@123` |
| Technician | `technician@assetrix.com` | `Tech@123` |
| HR Manager | `hr@assetrix.com` | `Hr@123` |

### Useful commands

| Command | Purpose |
|:--------|:--------|
| `npm run dev` | Frontend dev server (port 5173) |
| `npm run build` | Production build |
| `npm run lint` | Frontend ESLint |
| `npm run typecheck` | Frontend TypeScript check |
| `cd backend && npm run dev` | Backend dev server (port 5000) |
| `cd backend && npm test` | Backend Jest suite |
| `cd backend && npx prisma studio` | Visual DB browser |

<br/>

---

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
# In production, point at your deployed backend:
# NEXT_PUBLIC_API_URL=https://<your-railway-domain>
```

### Backend (`.env`)

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/assetrix?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=change-this-to-a-strong-random-secret
JWT_REFRESH_SECRET=change-this-to-another-strong-random-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@assetrix.com

# Uploads
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend origin (CORS)
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

<br/>

---

## Deployment

### Frontend → Vercel

1. Push the repo to GitHub and import it into [Vercel](https://vercel.com).
2. Vercel auto-detects the Next.js framework (see `vercel.json`).
3. Set the environment variable:
   - `NEXT_PUBLIC_API_URL` → your deployed backend URL.
4. Deploy. Every `git push origin main` redeploys.

### Backend → Railway

`railway.json` and `backend/Dockerfile` provide the containerized config.

1. Push the repo to GitHub and create a Railway project from it.
2. Add a **PostgreSQL** and **Redis** plugin.
3. Set env vars: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, `SMTP_*`.
4. Run `npx prisma db push` against the production DB.
5. Deploy. Health check: `GET /health`.

> **⚠️ Current deployment status:** the frontend is live, but the backend URL `assetrix-backend-production-9a94.up.railway.app` **does not resolve** (verified 1 Aug 2026). The backend must be redeployed before the platform is fully operational.

### Local production

```bash
cd backend && npm run build && npm start        # backend :5000
cd .. && npm run build && npm start             # frontend :3000
```

<br/>

---

## API Documentation

All endpoints are served under **`/api/v1`** and return:

```json
{
  "success": true,
  "message": "…",
  "data": { },
  "meta": { "totalItems": 0, "totalPages": 0, "currentPage": 1 }
}
```

Interactive docs are auto-generated with Swagger (`/api-docs` in dev mode).

<details>
<summary><b>🔐 Authentication</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| POST | `/api/v1/auth/register` | Register a new user | — |
| POST | `/api/v1/auth/login` | Login, returns JWT + sets refresh cookie | — |
| POST | `/api/v1/auth/refresh` | Rotate access token | Cookie |
| POST | `/api/v1/auth/logout` | Revoke current session | ✔ |
| POST | `/api/v1/auth/logout-all` | Revoke all sessions | ✔ |
| POST | `/api/v1/auth/forgot-password` | Request password reset email | — |
| POST | `/api/v1/auth/reset-password` | Reset password with token | — |
| GET/POST | `/api/v1/auth/verify-email` | Verify email (link / token) | — |
| POST | `/api/v1/auth/resend-verification` | Resend verification email | — |
| GET | `/api/v1/auth/me` | Current user profile | ✔ |
| GET | `/api/v1/auth/sessions` | List active sessions | ✔ |
| DELETE | `/api/v1/auth/sessions/:id` | Revoke a session | ✔ |
| GET | `/api/v1/auth/login-history` | Login history (paginated) | ✔ |

</details>

<details>
<summary><b>👥 Users</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/users` | List users | Admin |
| GET | `/api/v1/users/:id` | User details | ✔ |
| GET | `/api/v1/users/email/:email` | Lookup by email | Admin |
| POST | `/api/v1/users` | Create user | Admin |
| PUT | `/api/v1/users/:id` | Update user | Admin |
| PUT | `/api/v1/users/profile` | Update own profile | ✔ |
| PATCH | `/api/v1/users/:id/role` | Change role | SUPER_ADMIN |
| PATCH | `/api/v1/users/:id/status` | Change status | Admin |
| DELETE | `/api/v1/users/:id` | Soft-delete user | Admin |
| GET | `/api/v1/users/:id/reports` | User's reports | Admin |

</details>

<details>
<summary><b>🏛️ Departments & Categories</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/departments` | List departments | ✔ |
| GET | `/api/v1/departments/tree` | Department hierarchy | ✔ |
| GET | `/api/v1/departments/:id` | Department details | ✔ |
| GET | `/api/v1/departments/:id/stats` | Department stats | ✔ |
| POST | `/api/v1/departments` | Create department | Admin |
| PUT | `/api/v1/departments/:id` | Update department | Admin |
| DELETE | `/api/v1/departments/:id` | Delete department | Admin |
| GET | `/api/v1/asset-categories` | List categories | ✔ |
| GET | `/api/v1/asset-categories/tree` | Category hierarchy | ✔ |
| POST | `/api/v1/asset-categories` | Create category | Admin |
| PUT | `/api/v1/asset-categories/:id` | Update category | Admin |
| DELETE | `/api/v1/asset-categories/:id` | Delete category | Admin |

</details>

<details>
<summary><b>🖥️ Assets</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/assets` | List assets (filters, pagination) | ✔ |
| GET | `/api/v1/assets/stats` | Asset statistics | ✔ |
| GET | `/api/v1/assets/search` | Search assets | ✔ |
| GET | `/api/v1/assets/qr/:qrCode` | Lookup by QR code | ✔ |
| GET | `/api/v1/assets/:id` | Asset details | ✔ |
| GET | `/api/v1/assets/:id/history` | Lifecycle history | ✔ |
| POST | `/api/v1/assets` | Create asset (auto tag + QR) | Admin |
| PUT | `/api/v1/assets/:id` | Update asset | Admin |
| DELETE | `/api/v1/assets/:id` | Soft-delete asset | Admin |
| POST | `/api/v1/assets/:id/assign` | Assign asset to user | Manager |
| POST | `/api/v1/assets/:id/unallocate` | Unallocate asset | Manager |
| PATCH | `/api/v1/assets/:id/status` | Update status | Manager |
| PATCH | `/api/v1/assets/:id/condition` | Update condition | Manager |

</details>

<details>
<summary><b>🔁 Allocations & Transfers</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/allocations` | List allocations | ✔ |
| GET | `/api/v1/allocations/active` | Active allocations | ✔ |
| GET | `/api/v1/allocations/:id` | Allocation details | ✔ |
| POST | `/api/v1/allocations` | Create allocation | Manager |
| POST | `/api/v1/allocations/:id/return` | Return asset | ✔ |
| GET | `/api/v1/allocations/transfers/pending` | Pending transfers | ✔ |
| POST | `/api/v1/allocations/:id/transfer` | Request transfer | ✔ |
| POST | `/api/v1/allocations/:id/transfer/approve` | Approve transfer | Manager |
| POST | `/api/v1/allocations/:id/transfer/reject` | Reject transfer | Manager |

</details>

<details>
<summary><b>📅 Bookings</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/bookings` | List bookings | ✔ |
| GET | `/api/v1/bookings/upcoming` | Upcoming bookings | ✔ |
| GET | `/api/v1/bookings/:id` | Booking details | ✔ |
| POST | `/api/v1/bookings` | Create booking (overlap check) | ✔ |
| POST | `/api/v1/bookings/:id/approve` | Approve booking | Manager |
| POST | `/api/v1/bookings/:id/reject` | Reject booking | Manager |
| POST | `/api/v1/bookings/:id/cancel` | Cancel booking | ✔ |
| POST | `/api/v1/bookings/:id/complete` | Mark complete | ✔ |
| PUT | `/api/v1/bookings/:id` | Update booking | ✔ |

</details>

<details>
<summary><b>🔧 Maintenance</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/maintenance` | List maintenance tasks | ✔ |
| GET | `/api/v1/maintenance/stats` | Maintenance stats | ✔ |
| GET | `/api/v1/maintenance/overdue` | Overdue tasks | ✔ |
| GET | `/api/v1/maintenance/:id` | Task details | ✔ |
| POST | `/api/v1/maintenance` | Raise maintenance request | ✔ |
| PUT | `/api/v1/maintenance/:id` | Update task | ✔ |
| PUT | `/api/v1/maintenance/:id/assign` | Assign technician | Manager |
| PUT | `/api/v1/maintenance/:id/start` | Start work | Technician |
| PUT | `/api/v1/maintenance/:id/complete` | Complete work | Technician |
| PUT | `/api/v1/maintenance/:id/cancel` | Cancel task | Manager |
| POST | `/api/v1/maintenance/:id/approve` | Approve request | Manager |
| POST | `/api/v1/maintenance/:id/reject` | Reject request | Manager |
| DELETE | `/api/v1/maintenance/:id` | Delete task | Admin |
| GET/POST/PUT/DELETE | `/api/v1/maintenance/schedules…` | Preventive schedules CRUD | Manager |

</details>

<details>
<summary><b>🛡️ Audit</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/audit-cycles` | List cycles | ✔ |
| GET | `/api/v1/audit-cycles/:id` | Cycle details | ✔ |
| GET | `/api/v1/audit-cycles/:id/history` | Cycle history | ✔ |
| POST | `/api/v1/audit-cycles` | Create cycle | Admin |
| PUT | `/api/v1/audit-cycles/:id` | Update cycle | Admin |
| DELETE | `/api/v1/audit-cycles/:id` | Delete cycle | Admin |
| POST | `/api/v1/audit-cycles/:id/auditors` | Assign auditors | Admin |
| POST | `/api/v1/audit-cycles/:id/verify` | Verify an asset | Auditor |
| POST | `/api/v1/audit-cycles/:id/discrepancies` | Report discrepancy | Auditor |
| PATCH | `/api/v1/audit-cycles/discrepancies/:id/resolve` | Resolve discrepancy | Admin |
| POST | `/api/v1/audit-cycles/:id/close` | Close cycle | Admin |

</details>

<details>
<summary><b>📈 Analytics & Reports</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/analytics/dashboard` | Dashboard KPIs | ✔ |
| GET | `/api/v1/analytics/assets` | Asset analytics | ✔ |
| GET | `/api/v1/analytics/maintenance` | Maintenance analytics | ✔ |
| GET | `/api/v1/analytics/bookings` | Booking analytics | ✔ |
| GET | `/api/v1/analytics/financial` | Financial analytics | ✔ |
| GET | `/api/v1/analytics/departments` | Department analytics | ✔ |
| POST | `/api/v1/reports` | Generate report | ✔ |
| GET | `/api/v1/reports` | List reports | ✔ |
| GET | `/api/v1/reports/:id` | Report details | ✔ |
| GET | `/api/v1/reports/:id/download` | Download (CSV/PDF/Excel) | ✔ |
| DELETE | `/api/v1/reports/:id` | Delete report | ✔ |

</details>

<details>
<summary><b>🔔 Notifications</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/notifications` | List notifications | ✔ |
| GET | `/api/v1/notifications/unread-count` | Unread count | ✔ |
| PATCH | `/api/v1/notifications/read-all` | Mark all read | ✔ |
| PATCH | `/api/v1/notifications/:id/read` | Mark one read | ✔ |
| DELETE | `/api/v1/notifications/read` | Clear read notifications | ✔ |
| DELETE | `/api/v1/notifications/:id` | Delete notification | ✔ |
| GET/PUT | `/api/v1/notification-preferences` | Per-channel preferences | ✔ |

</details>

<details>
<summary><b>🧠 AI Intelligence</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/ai/health/:assetId` | Asset health score | ✔ |
| GET | `/api/v1/ai/recommendations/:assetId` | Recommendations for asset | ✔ |
| POST | `/api/v1/ai/recommendations/generate` | Generate batch recommendations | Manager |
| GET | `/api/v1/ai/recommendations/stats` | Recommendation stats | ✔ |
| PATCH | `/api/v1/ai/recommendations/:id/action` | Mark recommendation actioned | ✔ |
| GET | `/api/v1/ai/predictive-maintenance` | Predictive maintenance list | ✔ |

</details>

<details>
<summary><b>🛠️ Admin</b></summary>

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:----:|
| GET | `/api/v1/admin/stats` | Platform stats | Admin |
| GET | `/api/v1/admin/stats/users` | User stats | Admin |
| GET | `/api/v1/admin/stats/assets` | Asset stats | Admin |
| GET | `/api/v1/admin/health` | Admin health | Admin |
| GET/PUT | `/api/v1/admin/settings` | System settings | Admin |
| GET | `/api/v1/admin/activity` | Activity log | Admin |
| POST | `/api/v1/admin/users/:id/force-logout` | Force-logout a user | Admin |
| POST | `/api/v1/admin/backup` | Trigger DB backup | Admin |

</details>

<br/>

---

## User Roles & Permissions

| Module | Super Admin | Admin | Dept. Manager | Technician | Employee |
|:-------|:-----------:|:-----:|:-------------:|:----------:|:--------:|
| Dashboard | Full | Full | Department | Personal | Personal |
| Organization | CRUD | CRUD | Read (Dept) | — | — |
| Assets | Full | Full | Department | Read | Read only |
| Allocation | Full | Full | Approve | — | Request |
| Transfers | Approve all | Approve all | Approve dept | — | Request |
| Booking | Full | Full | Department | Personal | Personal |
| Maintenance | Full | Full | Approve | Execute | Request |
| Audit | Full | Full | Verify | — | Read only |
| Reports | Full | Full | Department | Personal | Personal |
| Notifications | Full | Full | Full | Full | Personal |
| Admin Panel | Full | Full | — | — | — |
| AI Insights | Full | Full | Department | — | Personal |

<br/>

---

## Project Timeline

| Phase | Milestone | Status |
|:------|:----------|:------:|
| 0.1 · May 2026 | Scaffold: Next.js + Express + Prisma schema | ✅ |
| 0.9 · Jul 2026 | Dashboard, landing, auth flows | ✅ |
| 1.0 · Jul 2026 | Full modules, security, deployment config | ✅ |
| 1.0.x · Aug 2026 | Audit fixes, docs rebuild, security remediation | 🔄 |

<br/>

---

## Roadmap

- [x] Asset lifecycle core (register → allocate → retire)
- [x] RBAC + JWT refresh rotation
- [x] Audit cycles + discrepancies
- [x] Reports & CSV/PDF/Excel export
- [ ] Frontend test suite (Vitest/Testing Library)
- [ ] GitHub Actions CI (lint + typecheck + test + build)
- [ ] Real ML-powered predictive maintenance
- [ ] WebSocket real-time notifications
- [ ] Bulk import (CSV) for assets
- [ ] Asset depreciation schedules & financial reporting
- [ ] Mobile app / PWA support
- [ ] Multi-organization (tenant) support

<br/>

---

## Known Issues

1. **Backend API is offline** (as of 1 Aug 2026) — the Railway domain does not resolve. Frontend builds and runs; full platform functionality requires the backend to be redeployed.
2. **Mock data in production UI** — the dashboard navbar notifications/task list and several module tabs render static demo data instead of API data.
3. **Report generation is incomplete** — only asset/maintenance/booking exports generate real files; financial/audit/department downloads fall back to a placeholder row, and queue-backed exports (audit) are not retrievable.
4. **Batch AI generation is a no-op** — the worker returns empty results; per-asset recommendations work.
5. **`assetrix.vercel.app` (canonical domain) redirects** without settling, while the working deployment is at `assetrix-nu.vercel.app`.

<br/>

---

## Future Improvements

- Replace heuristic AI with a model-backed recommendation engine.
- Add proper queue-backed report generation with polling + download URLs.
- Full test coverage for all services (currently auth-only).
- Frontend SSR/ISR tuning and route-level caching for dashboard data.
- Rate limiting via Redis for multi-instance deployments.
- `HttpOnly` refresh-token cookie hardening.
- Sitemap, robots.txt, and OG image for SEO.

<br/>

---

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org).
4. Push and open a Pull Request using the [PR template](.github/PULL_REQUEST_TEMPLATE.md).

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

<br/>

---

## Coding Standards

- **TypeScript strict** everywhere; no `any` without justification.
- **Server Components by default**; `"use client"` only for interactivity.
- **Layered backend:** controller → service → validator; shared `successResponse`/`errorResponse`.
- **Validation:** Zod schemas on every endpoint; Swagger annotations on every route.
- **Commits:** Conventional Commits (`feat(scope): message`).
- **Style:** Prettier + ESLint configured in both packages.
- **Testing:** Jest (backend). Add tests for new services.

<br/>

---

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE).

<br/>

---

## Acknowledgements

- [Next.js](https://nextjs.org) · [React](https://react.dev) · [Tailwind CSS](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com)
- [Express](https://expressjs.com) · [Prisma](https://www.prisma.io) · [PostgreSQL](https://www.postgresql.org) · [Redis](https://redis.io) · [BullMQ](https://docs.bullmq.io)
- [Vercel](https://vercel.com) · [Railway](https://railway.app) · [Swagger](https://swagger.io)
- [lucide-react](https://lucide.dev) icons · [shields.io](https://shields.io) badges

<br/>

---

## Contact

**Maintainer:** Shubham Kumar
- GitHub: [@Shubham-997800](https://github.com/Shubham-997800)
- Project: [github.com/Shubham-997800/assetrix](https://github.com/Shubham-997800/assetrix)
- Security issues: see [SECURITY.md](SECURITY.md)

<br/>

---

<div align="center">

<img src="public/logo.svg" width="48" alt="Assetrix logo" />

**Assetrix transforms asset management from manual tracking into operational intelligence.**

*The platform enables organizations to move from spreadsheets and fragmented workflows to centralized visibility, automation, accountability, and intelligent decision-making.*

<br/>

<a href="#top">⬆ Back to top</a> · Built with TypeScript, Next.js & Express

<br/>

<small>© 2026 Assetrix. Released under the MIT License.</small>

</div>
