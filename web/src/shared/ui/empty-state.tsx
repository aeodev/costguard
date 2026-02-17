import { Button } from './button';
import { Card } from './card';

type EmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

export const EmptyState = ({ title, description, ctaLabel, onCtaClick }: EmptyStateProps) => (
  <Card className="text-center">
    <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
    <p className="mt-2 text-sm text-slate-300">{description}</p>
    {ctaLabel && onCtaClick ? (
      <Button className="mt-4" variant="secondary" onClick={onCtaClick}>
        {ctaLabel}
      </Button>
    ) : null}
  </Card>
);
