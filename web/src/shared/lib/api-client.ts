import type { ApiEnvelope } from '@aicostguard/shared';
import { dispatchAuthUnauthorized } from './auth-events';
import { getStoredToken } from './storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

type ApiFetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export class ApiClientError extends Error {
  code: string;

  status: number;

  requestId: string;

  constructor(message: string, code: string, requestId: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

const shouldDispatchAuthUnauthorized = (
  error: ApiClientError,
  options: ApiFetchOptions
): boolean => !options.skipAuth && (error.code === 'UNAUTHORIZED' || error.status === 401);

export const apiFetch = async <T>(path: string, options: ApiFetchOptions = {}): Promise<T> => {
  const token = getStoredToken();
  const headers = new Headers(options.headers);

  headers.set('content-type', 'application/json');

  if (!options.skipAuth && token) {
    headers.set('authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.ok) {
    const error = !payload.ok
      ? new ApiClientError(
          `${payload.error.message} (Request ID: ${payload.requestId})`,
          payload.error.code,
          payload.requestId,
          response.status
        )
      : new ApiClientError('Unexpected API error', 'UNKNOWN_ERROR', 'unknown', response.status);

    if (shouldDispatchAuthUnauthorized(error, options)) {
      dispatchAuthUnauthorized();
    }

    throw error;
  }

  return payload.data;
};
