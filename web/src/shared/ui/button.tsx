import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold tracking-[0.01em] transition duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        size === 'sm' && 'h-8 rounded-lg px-3 text-xs',
        size === 'md' && 'h-10 rounded-lg px-4 text-sm',
        size === 'lg' && 'h-11 rounded-xl px-5 text-sm',
        variant === 'primary' &&
          'bg-brand text-white shadow-soft hover:brightness-105 dark:bg-gradient-to-r dark:from-brand dark:to-brand-strong dark:text-slate-950 dark:shadow-panel',
        variant === 'secondary' && 'bg-surface-elev/96 text-slate-100 shadow-soft hover:bg-surface-soft/76',
        variant === 'ghost' && 'text-slate-300 hover:bg-surface-soft/70 hover:text-slate-100',
        variant === 'danger' &&
          'bg-rose-600 text-white shadow-soft hover:brightness-105 dark:bg-gradient-to-r dark:from-rose-500 dark:to-rose-600 dark:shadow-panel',
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
