# Contributing to Assetrix

First off, thank you for taking the time to contribute! :heart:

Assetrix is an enterprise asset and resource management platform. This document outlines how to set up your environment, the conventions we follow, and how to get your changes merged.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Style Guide](#style-guide)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js **20+** (recommended LTS)
- PostgreSQL **16+**
- Redis **7+**
- npm **10+**

### Local Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/assetrix.git
cd assetrix

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend && npm install && cd ..

# 4. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your local database and Redis credentials

# 5. Create the database schema
cd backend
npx prisma db push
npx tsx prisma/seed.ts   # optional: seed demo data
cd ..

# 6. Start both servers
npm run dev              # Frontend → http://localhost:5173
cd backend && npm run dev  # Backend  → http://localhost:5000
```

> **Note:** the frontend proxies `/api/*` to `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`) via `next.config.ts`. The backend serves all routes under `/api/v1`.

## Development Workflow

1. Create a branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

   Branch naming conventions:
   - `feature/...` — new functionality
   - `fix/...` — bug fixes
   - `docs/...` — documentation only
   - `refactor/...` — code restructuring with no behavior change
   - `chore/...` — tooling, CI, dependencies

2. Make your changes. Keep them **focused** — one logical change per PR.

3. Run checks before pushing:

   ```bash
   npm run lint          # Frontend ESLint
   npm run typecheck     # Frontend TypeScript
   cd backend
   npm run lint          # Backend ESLint
   npm run test          # Backend Jest suite
   cd ..
   ```

## Project Structure

```
assetrix/
├── src/                  # Next.js App Router frontend
│   ├── app/              # Pages & layouts (landing + dashboard)
│   ├── components/       # React components (ui, auth, dashboard, landing, shared)
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom hooks
│   └── lib/              # API client, types, utilities
├── backend/              # Express.js REST API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # auth, validation, error handling
│   │   ├── validators/   # Zod schemas
│   │   ├── queues/       # BullMQ job queues & workers
│   │   ├── config/       # environment, db, redis, swagger
│   │   └── tests/        # Jest unit & integration tests
│   └── prisma/           # schema.prisma, migrations, seed
├── docs/                 # Project documentation
└── .github/              # Issue & PR templates
```

## Coding Standards

### TypeScript / React
- Strict TypeScript everywhere (`strict: true`). No `any` without an explicit justification.
- Server Components by default; add `"use client"` only when interactivity is required.
- Prefer `import type { ... }` for type-only imports.
- Use the `@/` path alias for `src/` imports in the frontend.
- Hooks rules: `useMemo`/`useCallback` for expensive or frequently-re-created values.

### Styling
- Tailwind CSS v4 utility classes. Follow existing design tokens (Aura Cyan accent).
- No new color tokens without review — keep to the established palette.
- Prefer `px-` spacing scale over arbitrary values where possible.

### Backend
- Controllers stay thin — business logic lives in `services/`.
- All request payloads are validated with Zod schemas in `validators/`.
- All responses use the shared `successResponse` / `errorResponse` helpers.
- Prefer Prisma transactions for multi-step writes.
- Add Swagger/OpenAPI annotations to every new endpoint.

### Testing
- Unit tests for services and validators.
- Integration tests for critical auth flows.
- Tests must not depend on a live database or network.

## Submitting a Pull Request

1. Make sure your branch is up to date:

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Push and open a PR:

   ```bash
   git push -u origin your-branch
   ```

3. Use the [Pull Request template](.github/PULL_REQUEST_TEMPLATE.md) — fill in all sections.
4. Link any related issues with `Closes #123`.
5. A maintainer will review. Address review feedback in follow-up commits (do not squash until merge).

### PR Requirements
- [ ] Code builds (`npm run build` in frontend, `npm run build` in backend).
- [ ] Lint passes in both packages.
- [ ] Tests pass (`npm test` in backend).
- [ ] No secrets or `.env*` files committed.
- [ ] Documentation updated if behavior changed (README, Swagger).
- [ ] CHANGELOG entry added under "Unreleased".

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

Examples:
- `feat(assets): add QR code generation for new assets`
- `fix(auth): clear session on token refresh failure`
- `docs(readme): update deployment URLs`
- `refactor(api): extract notification service`

Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `ci`, `style`, `revert`.

## Style Guide

- Prettier is configured for both packages (`npm run format` in backend).
- Keep functions small and single-purpose.
- Name things clearly; avoid abbreviations beyond standard ones.
- No `console.log` in committed code — use the `logger` (pino) in the backend.

## Questions?

Open a [discussion](https://github.com/Shubham-997800/assetrix/discussions) or reach out in the issue tracker.
