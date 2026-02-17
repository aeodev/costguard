# AICostGuard Design Summary

## Scope
Build a complete monorepo B2B SaaS prototype for AI subscription governance with:
- Full marketing and authenticated app route map
- Hono API with deterministic seeded data and auth middleware
- Shared Zod schemas and envelope contracts
- Dark-mode-first UI with charts, forms, and robust async states

## Architecture
- `web` consumes `api` via typed fetch + TanStack Query.
- `api` enforces request IDs, bearer auth, and unified envelopes.
- `shared` holds schema/type contracts reused across both apps.

## UX Intent
- Market-facing pages communicate trust and operational clarity.
- App surfaces spend/risk signal density with low-friction actions.
- Primary CTA on every route to keep decision-making momentum.

## Verification Targets
- Route completeness and navigation consistency.
- API endpoint behavior and envelope correctness.
- Lint/typecheck pass when dependencies are available.
