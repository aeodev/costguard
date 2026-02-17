import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-2xl bg-surface-elev/96 p-5 shadow-panel transition dark:bg-gradient-to-b dark:from-surface-elev/96 dark:to-surface-elev/84',
      className
    )}
    {...props}
  />
);
