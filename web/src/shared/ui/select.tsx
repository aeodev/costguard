import type { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Select = ({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      'h-10 w-full appearance-none rounded-lg bg-surface-soft/70 px-3 text-sm text-slate-100 shadow-soft transition',
      'focus:outline-none focus:ring-2 focus:ring-brand/45 focus:ring-offset-2 focus:ring-offset-surface-base',
      className
    )}
    {...props}
  />
);
