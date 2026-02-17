import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto rounded-2xl bg-surface-elev/88 shadow-soft">
    <table className={cn('min-w-full text-left text-sm', className)} {...props} />
  </div>
);

export const TableHead = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('bg-surface-soft/55 text-slate-300', className)} {...props} />
);

export const TableBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('divide-y divide-surface-line/30 [&_tr:hover]:bg-surface-soft/30', className)} {...props} />
);

export const TH = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('px-3 py-3 text-xs font-semibold uppercase tracking-wide', className)} {...props} />
);

export const TD = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-3 py-2.5 text-slate-100', className)} {...props} />
);
