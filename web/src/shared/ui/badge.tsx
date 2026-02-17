import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export const Badge = ({ className, tone = 'default', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
      tone === 'default' && 'bg-slate-800 text-slate-200',
      tone === 'success' && 'bg-emerald-500/20 text-emerald-200',
      tone === 'warning' && 'bg-amber-500/20 text-amber-200',
      tone === 'danger' && 'bg-rose-500/20 text-rose-200',
      tone === 'info' && 'bg-sky-500/20 text-sky-200',
      className
    )}
    {...props}
  />
);
