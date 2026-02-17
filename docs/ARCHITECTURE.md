# AICostGuard Architecture

## Monorepo Layout (ASCII)
```text
COSTGUARD/
├─ web/              React 19 + Vite + Tailwind UI
├─ api/              Hono API server
├─ packages/shared/  Zod schemas + shared types/envelopes
└─ docs/             Product, API, model, and runbook docs
```

## Web Runtime (ASCII)
```text
Router -> Layouts -> Feature Pages
       -> Providers (Theme, Toast, Query, Auth)
       -> API Client (typed envelope parsing)
       -> React Query cache + invalidation
```

## API Runtime (ASCII)
```text
Request
  -> CORS middleware
  -> request-id middleware
  -> auth middleware (except /health + /auth/login)
  -> zod query/body validation
  -> handler -> in-memory store mutation/query
  -> envelope response { ok, data|error, requestId }
```

## Shared Contract (ASCII)
```text
packages/shared
  ├─ schemas/models.ts   (Tool/User/Team/Subscription/...)
  ├─ schemas/api.ts      (request + response schema shapes)
  ├─ types/index.ts      (zod-inferred TS types)
  └─ utils/envelopes.ts  (success/error envelope helpers)
```

## Data Flow
1. User authenticates via `POST /auth/login`.
2. Token stored in localStorage; API client attaches bearer token.
3. Pages fetch typed data through React Query.
4. Mutations (cancel subscription, resolve finding, save policy, mock sync) update API store and emit audit events.
5. Query invalidation refreshes dependent views (dashboard, analytics, audit, risk, subscriptions).

## Auth Flow
1. Login validates credentials against seeded users.
2. API mints a mock token and stores session in memory.
3. Protected routes require `Authorization: Bearer <token>`.
4. `authMiddleware` maps token -> session -> user and sets `authUserId` in context.
5. Web auto-logs out on 401/UNAUTHORIZED via auth event subscription.

## Query Invalidation Strategy
- Mutation handlers call `queryClient.invalidateQueries()` to refresh all dependent data where relationships are broad.
- High-frequency read pages use scoped query keys (`spend-summary`, `risk-findings`, `subscriptions`, `audit`) to avoid accidental stale data.
- Dashboard refreshes after integration sync because sync mutates subscriptions, spend events, risk findings, and audit logs simultaneously.
