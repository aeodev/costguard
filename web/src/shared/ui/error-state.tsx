import { Button } from './button';
import { Card } from './card';

type ErrorStateProps = {
  title?: string;
  description: string;
  requestId?: string;
  onRetry: () => void;
};

export const ErrorState = ({
  title = 'Something went wrong',
  description,
  requestId,
  onRetry
}: ErrorStateProps) => (
  <Card className="border-rose-500/30">
    <h3 className="text-lg font-semibold text-rose-300">{title}</h3>
    <p className="mt-2 text-sm text-slate-300">{description}</p>
    {requestId ? <p className="mt-2 text-xs text-slate-500">Request ID: {requestId}</p> : null}
    <Button className="mt-4" variant="secondary" onClick={onRetry}>
      Retry
    </Button>
  </Card>
);
