import { cn } from '../lib/cn';

type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn('animate-pulse rounded-xl bg-surface-soft/70', className)} />
);
