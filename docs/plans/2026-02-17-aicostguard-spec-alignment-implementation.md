# AICostGuard Spec Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver a spec-complete AICostGuard monorepo with exact required routes, API contracts, seed data volume, docs, and verification.

**Architecture:** Shared zod contracts define canonical request/response/data entities; API handlers operate on deterministic in-memory data; web app consumes typed envelopes with TanStack Query and protected routing.

**Tech Stack:** TypeScript, Hono, React 19, Vite, Tailwind, TanStack Query, react-hook-form, zod, recharts, ESLint.

---

### Task 1: Shared contract realignment

**Files:**
- Modify: `packages/shared/src/index.ts`
- Modify: `packages/shared/src/schemas/models.ts`
- Modify: `packages/shared/src/schemas/api.ts`
- Modify: `packages/shared/src/types/index.ts`
- Delete: `packages/shared/src/schemas/action-queue.ts`
- Delete: `packages/shared/src/schemas/experiments.ts`

**Step 1: Write failing contract test surface**
- Run `pnpm --filter @aicostguard/api typecheck` and confirm missing/invalid imports after removing legacy schemas.

**Step 2: Implement contract schemas**
- Add/adjust model schemas and endpoint schemas for exact required entities and responses.

**Step 3: Verify green**
- Run `pnpm --filter @aicostguard/shared typecheck`.

### Task 2: API scope + seed data

**Files:**
- Modify: `api/src/app.ts`
- Modify: `api/src/data/seed.ts`
- Modify: `api/src/data/store.ts`
- Modify: `api/src/lib/env.ts`
- Create: `api/scripts/smoke-test.mjs`
- Modify: `api/package.json`

**Step 1: Write failing smoke tests for required endpoints**
- Add smoke script to validate `/health`, `/auth/login`, `/me`, `/org/overview`, `/integrations/mock-sync`, and envelope shape.

**Step 2: Implement API handlers and seed counts**
- Ensure required endpoints, auth middleware behavior, deterministic ID generation, and mutation/audit side effects.

**Step 3: Verify green**
- Run `pnpm --filter @aicostguard/api typecheck` and `pnpm --filter @aicostguard/api test`.

### Task 3: Web route and page completion

**Files:**
- Modify: `web/src/app/router/index.tsx`
- Modify: `web/src/shared/constants/nav.ts`
- Modify: `web/src/shared/constants/query-keys.ts`
- Modify: `web/src/features/**`
- Modify: `web/src/pages/**`
- Modify: `web/src/shared/constants/blog-posts.ts`

**Step 1: Route map alignment**
- Set `/app` to dashboard, remove action-queue route/nav references.

**Step 2: Complete all marketing and app pages**
- Ensure each route has heading, subheading, primary CTA, secondary action where relevant, and meaningful content.
- Ensure loading/empty/error states exist on data-backed pages.

**Step 3: Verify green**
- Run `pnpm --filter @aicostguard/web typecheck` and `pnpm --filter @aicostguard/web build`.

### Task 4: Lint + env + docs completion

**Files:**
- Modify: `package.json`
- Modify: `web/package.json`
- Modify: `api/package.json`
- Modify: `packages/shared/package.json`
- Create/Modify: `.env.example`, `web/.env.example`, `api/.env.example`
- Create: `eslint.config.js`
- Rewrite: `docs/*.md`

**Step 1: Add lint config and scripts**
- Implement ESLint for web/api/shared and wire into workspace scripts.

**Step 2: Rewrite required docs**
- Produce complete content for architecture/data/API/UI/runbook/status/master plan.

**Step 3: Verify full workspace**
- Run `pnpm -r typecheck`, `pnpm -r lint`, `pnpm test`.

### Task 5: Final verification and summary

**Files:**
- N/A

**Step 1: Route coverage check**
- Verify all required routes are declared in router and navigation paths are valid.

**Step 2: Completion report**
- Provide tree, run commands, demo creds, first-click flow, and route list.
