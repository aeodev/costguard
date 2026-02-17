import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { z } from 'zod';
import { errorEnvelope, successEnvelope } from '@aicostguard/shared';

export const ok = <T>(c: Context, data: T, status: ContentfulStatusCode = 200): Response =>
  c.json(successEnvelope(c.get('requestId'), data), status);

export const fail = (
  c: Context,
  code: string,
  message: string,
  status: ContentfulStatusCode = 400
): Response =>
  c.json(errorEnvelope(c.get('requestId'), code, message), status);

export const parseBody = async <S extends z.ZodTypeAny>(
  c: Context,
  schema: S
): Promise<{ data: z.infer<S> | null; error: Response | null }> => {
  const json = await c.req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return {
      data: null,
      error: fail(c, 'VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid request body', 422)
    };
  }

  return { data: parsed.data, error: null };
};

export const parseQuery = <S extends z.ZodTypeAny>(
  c: Context,
  schema: S
): { data: z.infer<S> | null; error: Response | null } => {
  const parsed = schema.safeParse(c.req.query());
  if (!parsed.success) {
    return {
      data: null,
      error: fail(c, 'VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid query', 422)
    };
  }

  return { data: parsed.data, error: null };
};
