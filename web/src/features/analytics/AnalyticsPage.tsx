import type { SpendSummary } from '@aicostguard/shared';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useState } from 'react';
import { queryKeys } from '../../shared/constants/query-keys';
import { apiFetch } from '../../shared/lib/api-client';
import { formatCurrency } from '../../shared/lib/format';
import { toApiClientError } from '../../shared/types/errors';
import { Button } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { EmptyState } from '../../shared/ui/empty-state';
import { ErrorState } from '../../shared/ui/error-state';
import { PageHeader } from '../../shared/ui/page-header';
import { Select } from '../../shared/ui/select';
import { Skeleton } from '../../shared/ui/skeleton';

const pieColors = ['#10b981', '#22d3ee', '#f59e0b', '#f43f5e', '#a78bfa'];

export const AnalyticsPage = () => {
  const [range, setRange] = useState<'30d' | '90d'>('30d');

  const spendQuery = useQuery({
    queryKey: queryKeys.spendSummary(range),
    queryFn: () => apiFetch<SpendSummary>(`/spend/summary?range=${range}`)
  });

  if (spendQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (spendQuery.isError || !spendQuery.data) {
    const apiError = toApiClientError(spendQuery.error);
    return (
      <ErrorState
        description={apiError?.message ?? 'Unable to load analytics.'}
        requestId={apiError?.requestId}
        onRetry={() => void spendQuery.refetch()}
      />
    );
  }

  const summary = spendQuery.data;
  const totalSpend = summary.timeSeries.reduce((sum, point) => sum + point.amount, 0);
  const topTools = summary.byTool.slice(0, 6);
  const topTeams = summary.byTeam.slice(0, 5);
  const costPerSavedHour = summary.estimatedHoursSaved === 0 ? 0 : totalSpend / summary.estimatedHoursSaved;

  let roiNote = 'Review spend allocation';
  if (costPerSavedHour < 20) roiNote = 'High efficiency zone';
  else if (costPerSavedHour < 40) roiNote = 'Moderate efficiency zone';

  if (summary.timeSeries.length === 0) {
    return (
      <EmptyState
        title="No spend data available"
        description="Run a sync to ingest spend events before opening analytics views."
        ctaLabel="Retry"
        onCtaClick={() => void spendQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Understand spend trajectory, distribution, and ROI proxies by team and tool."
        primaryAction={<Button onClick={() => void spendQuery.refetch()}>Refresh Analytics</Button>}
        secondaryAction={
          <Select className="w-28" value={range} onChange={(event) => setRange(event.target.value as '30d' | '90d')}>
            <option value="30d">30 days</option>
            <option value="90d">90 days</option>
          </Select>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Total spend ({range})</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(totalSpend)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Per-seat average</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.perSeatAverage)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Estimated hours saved</p>
          <p className="mt-2 text-2xl font-semibold">{summary.estimatedHoursSaved}h</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Cost per saved hour</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(costPerSavedHour)}</p>
          <p className="mt-1 text-xs text-slate-500">{roiNote}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Spend trend</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.96)', border: '0', borderRadius: '12px', boxShadow: '0 16px 30px rgba(2, 6, 23, 0.42)' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Line type="monotone" dataKey="amount" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Spend by tool</h2>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTools} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis type="category" dataKey="toolName" tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.96)', border: '0', borderRadius: '12px', boxShadow: '0 16px 30px rgba(2, 6, 23, 0.42)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="amount" fill="#34d399" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Spend by team</h2>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topTeams} dataKey="amount" nameKey="teamName" outerRadius={110} innerRadius={50}>
                  {topTeams.map((entry, index) => (
                    <Cell key={entry.teamId} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.96)', border: '0', borderRadius: '12px', boxShadow: '0 16px 30px rgba(2, 6, 23, 0.42)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid gap-1 text-xs text-slate-400">
            {topTeams.map((team) => (
              <p key={team.teamId}>
                {team.teamName}: {formatCurrency(team.amount)}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
