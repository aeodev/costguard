import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
};

export const Button = ({
  className,
  variant = 'primary',
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition',
        variant === 'primary' && 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400',
        variant === 'secondary' &&
          'border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800',
        variant === 'ghost' && 'text-slate-200 hover:bg-slate-800',
        variant === 'danger' && 'bg-rose-500 text-white hover:bg-rose-400',
        (disabled || loading) && 'cursor-not-allowed opacity-60',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Working...' : children}
    </button>
  );
};
