import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
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
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto rounded-lg border px-4 py-3 shadow-panel backdrop-blur',
              toast.variant === 'success' && 'border-emerald-500/50 bg-emerald-500/15 text-emerald-100',
              toast.variant === 'error' && 'border-rose-500/50 bg-rose-500/15 text-rose-100',
              (toast.variant === 'info' || !toast.variant) &&
                'border-sky-500/50 bg-sky-500/15 text-sky-100'
            )}
          >
            <div className="flex items-start gap-3">
              {toast.variant === 'success' ? (
                <CheckCircle2 size={16} className="mt-0.5" />
              ) : toast.variant === 'error' ? (
                <AlertTriangle size={16} className="mt-0.5" />
              ) : (
                <Info size={16} className="mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? <p className="text-xs opacity-90">{toast.description}</p> : null}
              </div>
            </div>
          </div>
        ))}
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
