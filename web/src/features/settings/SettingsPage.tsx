import type { MeResponse, Policy, SpendSummary, Tool } from '@aicostguard/shared';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../shared/constants/query-keys';
import { apiFetch } from '../../shared/lib/api-client';
import { formatCurrency, formatDate } from '../../shared/lib/format';
import { toApiClientError } from '../../shared/types/errors';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { ErrorState } from '../../shared/ui/error-state';
import { PageHeader } from '../../shared/ui/page-header';
import { Skeleton } from '../../shared/ui/skeleton';

type PoliciesResponse = {
  policies: Policy[];
  tools: Tool[];
};

export const SettingsPage = () => {
  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: () => apiFetch<MeResponse>('/me')
  });

  const policiesQuery = useQuery({
    queryKey: queryKeys.policies,
    queryFn: () => apiFetch<PoliciesResponse>('/policies')
  });

  const spendQuery = useQuery({
    queryKey: queryKeys.spendSummary('30d'),
    queryFn: () => apiFetch<SpendSummary>('/spend/summary?range=30d')
  });

  if (meQuery.isLoading || policiesQuery.isLoading || spendQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (meQuery.isError || policiesQuery.isError || spendQuery.isError || !meQuery.data || !policiesQuery.data || !spendQuery.data) {
    const apiError = toApiClientError(meQuery.error) || toApiClientError(policiesQuery.error) || toApiClientError(spendQuery.error);
    return (
      <ErrorState
        description={apiError?.message ?? 'Unable to load settings.'}
        requestId={apiError?.requestId}
        onRetry={() => {
          void meQuery.refetch();
          void policiesQuery.refetch();
          void spendQuery.refetch();
        }}
      />
    );
  }

  const activePolicy = policiesQuery.data.policies[0];
  const invoiceMtd = spendQuery.data.timeSeries.reduce((sum, point) => sum + point.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage organization profile, billing posture, and policy-backed security defaults."
        primaryAction={<Button onClick={() => void meQuery.refetch()}>Refresh settings</Button>}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <h2 className="text-lg font-semibold">Organization profile</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p>
              Name: <span className="font-semibold text-slate-100">{meQuery.data.org.name}</span>
            </p>
            <p>
              Plan: <span className="font-semibold text-slate-100">{meQuery.data.org.plan}</span>
            </p>
            <p>
              Renewal date: <span className="font-semibold text-slate-100">{formatDate(meQuery.data.org.renewalDate)}</span>
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Billing</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p>
              Invoice total (MTD): <span className="font-semibold text-slate-100">{formatCurrency(invoiceMtd)}</span>
            </p>
            <p>
              Active subscriptions: <span className="font-semibold text-slate-100">{meQuery.data.basics.activeSubscriptions}</span>
            </p>
            <p>
              Open findings impacting spend: <span className="font-semibold text-slate-100">{meQuery.data.basics.openFindings}</span>
            </p>
            <Badge tone="info">Demo billing view</Badge>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Security settings</h2>
          {activePolicy ? (
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p>
                SSO required:{' '}
                <Badge tone={activePolicy.rules.requireSSO ? 'success' : 'warning'}>
                  {activePolicy.rules.requireSSO ? 'enabled' : 'disabled'}
                </Badge>
              </p>
              <p>
                Personal accounts:{' '}
                <Badge tone={activePolicy.rules.banPersonalAccounts ? 'success' : 'warning'}>
                  {activePolicy.rules.banPersonalAccounts ? 'blocked' : 'allowed'}
                </Badge>
              </p>
              <p>Security posture follows active policy rules and is managed from the Policies page.</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No active policy loaded.</p>
          )}
        </Card>
      </div>
    </div>
  );
};
