import type { IntegrationSyncDiff, OrgOverview } from '@aicostguard/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useState } from 'react';
import { useToast } from '../../app/providers/toast-provider';
import { queryKeys } from '../../shared/constants/query-keys';
import { apiFetch } from '../../shared/lib/api-client';
import { formatCurrency, formatDate } from '../../shared/lib/format';
import { toApiClientError } from '../../shared/types/errors';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { ErrorState } from '../../shared/ui/error-state';
import { Modal } from '../../shared/ui/modal';
import { PageHeader } from '../../shared/ui/page-header';
import { Skeleton } from '../../shared/ui/skeleton';
import { Table, TableBody, TableHead, TD, TH } from '../../shared/ui/table';

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const [syncDiff, setSyncDiff] = useState<IntegrationSyncDiff | null>(null);

  const overviewQuery = useQuery({
    queryKey: queryKeys.overview,
    queryFn: () => apiFetch<OrgOverview>('/org/overview')
  });

  const syncMutation = useMutation({
    mutationFn: () => apiFetch<IntegrationSyncDiff>('/integrations/mock-sync', { method: 'POST' }),
    onSuccess: async (diff) => {
      setSyncDiff(diff);
      pushToast({ title: 'Mock sync completed', variant: 'success' });
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      const apiError = toApiClientError(error);
      pushToast({ title: 'Sync failed', description: apiError?.message, variant: 'error' });
    }
  });

  if (overviewQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-80" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (overviewQuery.isError || !overviewQuery.data) {
    const apiError = toApiClientError(overviewQuery.error);
    return (
      <ErrorState
        description={apiError?.message ?? 'Unable to load dashboard overview.'}
        requestId={apiError?.requestId}
        onRetry={() => void overviewQuery.refetch()}
      />
    );
  }

  const data = overviewQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Governance Dashboard"
        description="Monitor spend, risk posture, and policy execution across Acme Labs."
        primaryAction={
          <Button onClick={() => syncMutation.mutate()} loading={syncMutation.isPending}>
            Run Mock Sync
          </Button>
        }
        secondaryAction={
          <Button variant="secondary" onClick={() => void overviewQuery.refetch()}>
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Total spend (30d)</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.kpis.totalSpend30d)}</p>
          <p className="mt-1 text-xs text-slate-500">Seat + API + overage</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Active subscriptions</p>
          <p className="mt-2 text-2xl font-semibold">{data.kpis.activeSubscriptions}</p>
          <p className="mt-1 text-xs text-slate-500">Across engineering, product, growth, data</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Open findings</p>
          <p className="mt-2 text-2xl font-semibold">{data.kpis.openFindings}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge tone="danger">High: {data.kpis.highSeverityFindings}</Badge>
            <Badge tone="warning">Personal: {data.kpis.personalSubscriptions}</Badge>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Spend trend (30 days)</h2>
          <p className="text-xs text-slate-500">SSO coverage: {data.kpis.ssoCoveragePercent}%</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.spendSeries}>
              <defs>
                <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.96)', border: '0', borderRadius: '12px', boxShadow: '0 16px 30px rgba(2, 6, 23, 0.42)' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area type="monotone" dataKey="amount" stroke="#2dd4bf" fill="url(#spendFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Top tools by spend</h2>
          <Table className="mt-3">
            <TableHead>
              <tr>
                <TH>Tool</TH>
                <TH>Spend</TH>
              </tr>
            </TableHead>
            <TableBody>
              {data.topToolsBySpend.map((tool) => (
                <tr key={tool.toolId}>
                  <TD>{tool.toolName}</TD>
                  <TD>{formatCurrency(tool.amount)}</TD>
                </tr>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Recent findings</h2>
          <Table className="mt-3">
            <TableHead>
              <tr>
                <TH>Finding</TH>
                <TH>Severity</TH>
                <TH>Detected</TH>
              </tr>
            </TableHead>
            <TableBody>
              {data.recentFindings.map((finding) => (
                <tr key={finding.id}>
                  <TD>
                    <p>{finding.title}</p>
                    <p className="text-xs text-slate-500">{finding.type}</p>
                  </TD>
                  <TD>
                    <Badge tone={finding.severity === 'high' ? 'danger' : finding.severity === 'med' ? 'warning' : 'info'}>
                      {finding.severity}
                    </Badge>
                  </TD>
                  <TD>{formatDate(finding.detectedAt)}</TD>
                </tr>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Recommended actions</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {data.recommendedActions.map((action) => (
            <div key={action.id} className="rounded-lg bg-surface-soft/35 p-3 shadow-soft ">
              <p className="font-semibold text-slate-100">{action.title}</p>
              <p className="mt-1 text-sm text-slate-300">{action.reason}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-brand">{action.cta}</p>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={Boolean(syncDiff)} title="Mock sync completed" onClose={() => setSyncDiff(null)}>
        {syncDiff ? (
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              Added subscriptions: <span className="font-semibold text-slate-100">{syncDiff.addedSubscriptions}</span>
            </p>
            <p>
              Added spend events: <span className="font-semibold text-slate-100">{syncDiff.addedSpendEvents}</span>
            </p>
            <p>
              Added risk findings: <span className="font-semibold text-slate-100">{syncDiff.addedRiskFindings}</span>
            </p>
            <p>
              Audit entries created: <span className="font-semibold text-slate-100">{syncDiff.auditEntriesCreated}</span>
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
