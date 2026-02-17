import type { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Select = ({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      'w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none',
      className
    )}
    {...props}
  />
);
