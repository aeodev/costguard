import type { MiddlewareHandler } from 'hono';
import { fail } from '../lib/http';
import { db, sessions } from '../data/store';
import type { AppEnv } from '../types';

export const authMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const header = c.req.header('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return fail(c, 'UNAUTHORIZED', 'Missing bearer token', 401);
  }

  const token = header.replace('Bearer ', '').trim();
  const session = sessions.get(token);
  if (!session) {
    return fail(c, 'UNAUTHORIZED', 'Invalid or expired token', 401);
  }

  const user = db.users.find((item) => item.id === session.userId);
  if (!user) {
    return fail(c, 'UNAUTHORIZED', 'Session user not found', 401);
  }

  c.set('authUserId', user.id);
  await next();
};
