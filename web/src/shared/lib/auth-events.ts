const AUTH_UNAUTHORIZED_EVENT = 'aicostguard:auth-unauthorized';

export const dispatchAuthUnauthorized = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
};

export const subscribeToAuthUnauthorized = (handler: () => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handler);
  return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handler);
};
