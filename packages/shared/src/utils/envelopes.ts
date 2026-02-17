import type { ApiEnvelope, ApiError, ApiSuccess } from '../types';

export const successEnvelope = <T>(requestId: string, data: T): ApiSuccess<T> => ({
  ok: true,
  data,
  requestId
});

export const errorEnvelope = (
  requestId: string,
  code: string,
  message: string
): ApiError => ({
  ok: false,
  error: {
    code,
    message
  },
  requestId
});

export const unwrapEnvelope = <T>(envelope: ApiEnvelope<T>): T => {
  if (!envelope.ok) {
    throw new Error(`${envelope.error.code}: ${envelope.error.message} (${envelope.requestId})`);
  }

  return envelope.data;
};
