# AICostGuard Spec Alignment Design

## Objective
Align the existing monorepo with the full AICostGuard product contract: exact route map, exact API envelope and endpoint surface, required seeded data volume, consistent UX structure, and runnable verification commands.

## Constraints
- Keep stack unchanged: React 19 + Vite + Tailwind on web, Hono on API, shared zod contracts in `packages/shared`.
- No empty pages or placeholder routes.
- Keep auth/session model simple and deterministic.
- Implement in-place without creating a new workspace.

## Chosen Approach
1. Replace shared contracts with exact model + endpoint schemas required by the spec.
2. Replace API route handlers and seed data to conform exactly to the requested behavior.
3. Keep existing UI component primitives but rewrite route pages and app features to guarantee meaningful content on every route.
4. Add real ESLint tooling and smoke tests to satisfy quality gates.
5. Rewrite docs package to reflect implemented behavior and operational usage.

## Tradeoffs
- In-memory persistence is retained for fast local iteration; this is explicitly documented as a limitation.
- Existing unused "action queue" domain is removed from routing and shared contracts to avoid dead scope.
- UI styling remains within current design system but upgraded with stronger content density and charts/tables/forms per page.

## Validation Plan
- `pnpm -r typecheck`
- `pnpm -r lint`
- `pnpm test` (API smoke test)
- Route inventory script + manual route map check against required list
