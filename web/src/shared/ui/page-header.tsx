import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
};

export const PageHeader = ({ title, description, primaryAction, secondaryAction }: PageHeaderProps) => (
  <div className="relative rounded-3xl bg-surface-elev/96 px-6 py-5 shadow-panel dark:bg-gradient-to-r dark:from-surface-elev/98 dark:via-surface-elev/90 dark:to-surface-soft/34">
    <div className="hidden dark:absolute dark:inset-y-0 dark:left-0 dark:block dark:w-24 dark:bg-gradient-to-r dark:from-brand/18 dark:to-transparent" />
    <div className="relative flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold leading-tight text-slate-100">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-300">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {secondaryAction}
        {primaryAction}
      </div>
    </div>
  </div>
);
