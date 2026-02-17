import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '../../shared/lib/cn';

type ToastVariant = 'success' | 'error' | 'info';

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastEntry = ToastInput & {
  id: string;
};

type ToastContextValue = {
  pushToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantLabel: Record<ToastVariant, string> = {
  success: 'SUCCESS',
  error: 'ERROR',
  info: 'INFO'
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const pushToast = useCallback((toast: ToastInput) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { ...toast, id }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((entry) => entry.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const tone = toast.variant ?? 'info';

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto rounded-2xl px-4 py-3 shadow-soft backdrop-blur',
                tone === 'success' && 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/14 dark:text-emerald-100',
                tone === 'error' && 'bg-rose-50 text-rose-900 dark:bg-rose-500/14 dark:text-rose-100',
                tone === 'info' && 'bg-sky-50 text-sky-900 dark:bg-sky-500/14 dark:text-sky-100'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-current/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-current">
                  {variantLabel[tone]}
                </span>
                <div>
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? <p className="text-xs opacity-90">{toast.description}</p> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
};
