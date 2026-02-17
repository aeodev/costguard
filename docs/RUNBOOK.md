# Runbook

## Local Development
1. Install dependencies:
   - `pnpm i`
2. Start web + API:
   - `pnpm dev`
3. Access:
   - Web: `http://localhost:5173`
   - API: `http://localhost:4000`

## Build and Verification
- Typecheck: `pnpm -r typecheck`
- Lint: `pnpm -r lint`
- API smoke tests: `pnpm test`
- Production build: `pnpm build`

## Demo Credentials
- `admin@aicostguard.dev / password123`
- `member1@aicostguard.dev / password123`

## Troubleshooting
- 401 on protected routes:
  - Log out and back in (`/auth/logout` then `/auth/login`).
- API not reachable from web:
  - Confirm `web/.env.example` value: `VITE_API_BASE_URL=http://localhost:4000`.
- CORS issues:
  - Confirm `api/.env.example` value: `CORS_ORIGIN=http://localhost:5173`.
- Data unexpectedly changed:
  - Restart API to reset in-memory seed state.
