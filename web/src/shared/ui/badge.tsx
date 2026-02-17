import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export const Badge = ({ className, tone = 'default', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm',
      tone === 'default' && 'bg-slate-100 text-slate-700 dark:bg-surface-soft/55 dark:text-slate-100',
      tone === 'success' && 'bg-emerald-100 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-100',
      tone === 'warning' && 'bg-amber-100 text-amber-900 dark:bg-amber-400/20 dark:text-amber-100',
      tone === 'danger' && 'bg-rose-100 text-rose-900 dark:bg-rose-400/20 dark:text-rose-100',
      tone === 'info' && 'bg-sky-100 text-sky-900 dark:bg-sky-400/20 dark:text-sky-100',
      className
    )}
    {...props}
  />
);
