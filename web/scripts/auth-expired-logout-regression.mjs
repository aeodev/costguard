import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mustContain = (file, snippets) => {
  const source = readFileSync(file, 'utf8');
  for (const snippet of snippets) {
    if (!source.includes(snippet)) {
      throw new Error(`Expected "${snippet}" in ${file}`);
    }
  }
};

const apiClientFile = resolve('src/shared/lib/api-client.ts');
const authEventsFile = resolve('src/shared/lib/auth-events.ts');
const authProviderFile = resolve('src/app/providers/auth-provider.tsx');
const apiAuthMiddlewareFile = resolve('../api/src/middleware/auth.ts');

mustContain(apiClientFile, [
  "error.code === 'UNAUTHORIZED' || error.status === 401",
  'dispatchAuthUnauthorized()'
]);

mustContain(authEventsFile, [
  "const AUTH_UNAUTHORIZED_EVENT = 'aicostguard:auth-unauthorized'",
  'window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))',
  'window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handler)',
  'window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handler)'
]);

mustContain(authProviderFile, [
  'return subscribeToAuthUnauthorized(() => {',
  'logout();',
  'clearStoredToken();',
  'clearStoredUser();'
]);

mustContain(apiAuthMiddlewareFile, ["return fail(c, 'UNAUTHORIZED', 'Invalid or expired token', 401);"]);

console.log('auth-expired-logout-regression: PASS');
