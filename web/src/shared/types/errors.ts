import { ApiClientError } from '../lib/api-client';

export const toApiClientError = (error: unknown): ApiClientError | null =>
  error instanceof ApiClientError ? error : null;
