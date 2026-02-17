import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-panel backdrop-blur-sm',
      className
    )}
    {...props}
  />
);
