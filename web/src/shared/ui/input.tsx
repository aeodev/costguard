import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'h-10 w-full rounded-lg bg-surface-soft/70 px-3 text-sm text-slate-100 shadow-soft transition',
      'placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/45 focus:ring-offset-2 focus:ring-offset-surface-base',
      className
    )}
    {...props}
  />
);
