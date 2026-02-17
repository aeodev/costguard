import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
};

export const PageHeader = ({ title, description, primaryAction, secondaryAction }: PageHeaderProps) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
    <div>
      <h1 className="text-2xl font-semibold text-slate-100">{title}</h1>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
    <div className="flex items-center gap-2">
      {secondaryAction}
      {primaryAction}
    </div>
  </div>
);
