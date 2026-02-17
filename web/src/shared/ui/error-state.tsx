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
  <Card className="bg-rose-500/12">
    <h3 className="text-lg font-semibold text-rose-200">{title}</h3>
    <p className="mt-2 text-sm text-slate-200">{description}</p>
    {requestId ? <p className="mt-2 text-xs text-slate-400">Request ID: {requestId}</p> : null}
    <Button className="mt-4" variant="secondary" onClick={onRetry}>
      Retry
    </Button>
  </Card>
);
