import type { Integration, IntegrationSyncDiff } from '@aicostguard/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useToast } from '../../app/providers/toast-provider';
import { queryKeys } from '../../shared/constants/query-keys';
import { apiFetch } from '../../shared/lib/api-client';
import { formatDate } from '../../shared/lib/format';
import { toApiClientError } from '../../shared/types/errors';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { ErrorState } from '../../shared/ui/error-state';
import { Modal } from '../../shared/ui/modal';
import { PageHeader } from '../../shared/ui/page-header';
import { Skeleton } from '../../shared/ui/skeleton';

export const IntegrationsPage = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const [syncResult, setSyncResult] = useState<IntegrationSyncDiff | null>(null);

  const integrationsQuery = useQuery({
    queryKey: queryKeys.integrations,
    queryFn: () => apiFetch<Integration[]>('/integrations')
  });

  const syncMutation = useMutation({
    mutationFn: () => apiFetch<IntegrationSyncDiff>('/integrations/mock-sync', { method: 'POST' }),
    onSuccess: async (data) => {
      setSyncResult(data);
      pushToast({ title: 'Mock sync complete', variant: 'success' });
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      const apiError = toApiClientError(error);
      pushToast({ title: 'Sync failed', description: apiError?.message, variant: 'error' });
    }
  });

  if (integrationsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (integrationsQuery.isError || !integrationsQuery.data) {
    const apiError = toApiClientError(integrationsQuery.error);
    return (
      <ErrorState
        description={apiError?.message ?? 'Unable to load integrations.'}
        requestId={apiError?.requestId}
        onRetry={() => void integrationsQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Monitor connector health and run sync operations that refresh subscriptions, spend, and risk findings."
        primaryAction={
          <Button onClick={() => syncMutation.mutate()} loading={syncMutation.isPending}>
            Run Mock Sync
          </Button>
        }
        secondaryAction={<Button variant="secondary" onClick={() => void integrationsQuery.refetch()}>Refresh</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {integrationsQuery.data.map((integration) => (
          <Card key={integration.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" />
                  <h3 className="text-lg font-semibold">{integration.name}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-300">{integration.description}</p>
              </div>
              <Badge tone={integration.status === 'connected' ? 'success' : 'warning'}>{integration.status}</Badge>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Last sync: {integration.lastSyncAt ? formatDate(integration.lastSyncAt) : 'Never'}
            </p>
          </Card>
        ))}
      </div>

      <Modal open={Boolean(syncResult)} title="Sync summary" onClose={() => setSyncResult(null)}>
        {syncResult ? (
          <div className="space-y-2 text-sm text-slate-300">
            <p>Added subscriptions: {syncResult.addedSubscriptions}</p>
            <p>Added spend events: {syncResult.addedSpendEvents}</p>
            <p>Added risk findings: {syncResult.addedRiskFindings}</p>
            <p>Audit entries created: {syncResult.auditEntriesCreated}</p>
            <p className="text-xs text-slate-500">Subscription IDs: {syncResult.subscriptionIds.join(', ')}</p>
            <p className="text-xs text-slate-500">Finding IDs: {syncResult.findingIds.join(', ')}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
