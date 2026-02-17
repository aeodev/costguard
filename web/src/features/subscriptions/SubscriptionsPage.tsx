import type { Subscription, Team, Tool, User } from '@aicostguard/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useToast } from '../../app/providers/toast-provider';
import { queryKeys } from '../../shared/constants/query-keys';
import { apiFetch } from '../../shared/lib/api-client';
import { formatCurrency, formatDate } from '../../shared/lib/format';
import { toApiClientError } from '../../shared/types/errors';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { EmptyState } from '../../shared/ui/empty-state';
import { ErrorState } from '../../shared/ui/error-state';
import { Input } from '../../shared/ui/input';
import { PageHeader } from '../../shared/ui/page-header';
import { Select } from '../../shared/ui/select';
import { Skeleton } from '../../shared/ui/skeleton';
import { Table, TableBody, TableHead, TD, TH } from '../../shared/ui/table';

type TeamResponse = {
  teams: Team[];
  users: User[];
  subscriptions: Subscription[];
};

type SubscriptionFilters = {
  toolId: string;
  teamId: string;
  status: string;
  personal: string;
  q: string;
};

const buildQuery = (filters: SubscriptionFilters): string => {
  const params = new URLSearchParams();
  if (filters.toolId) params.set('toolId', filters.toolId);
  if (filters.teamId) params.set('teamId', filters.teamId);
  if (filters.status) params.set('status', filters.status);
  if (filters.personal) params.set('personal', filters.personal);
  if (filters.q) params.set('q', filters.q);
  return params.toString();
};

export const SubscriptionsPage = () => {
  const [filters, setFilters] = useState<SubscriptionFilters>({
    toolId: '',
    teamId: '',
    status: '',
    personal: '',
    q: ''
  });

  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const queryString = useMemo(() => buildQuery(filters), [filters]);

  const toolsQuery = useQuery({
    queryKey: queryKeys.tools,
    queryFn: () => apiFetch<Tool[]>('/tools')
  });

  const teamQuery = useQuery({
    queryKey: queryKeys.team,
    queryFn: () => apiFetch<TeamResponse>('/team')
  });

  const subscriptionsQuery = useQuery({
    queryKey: queryKeys.subscriptions(queryString),
    queryFn: () => apiFetch<Subscription[]>(`/subscriptions${queryString ? `?${queryString}` : ''}`)
  });

  const mutateSubscription = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'cancel' | 'mark-personal' | 'request-sso' }) =>
      apiFetch<Subscription | { status: string; subscriptionId: string }>(`/subscriptions/${id}/${action}`, {
        method: 'POST'
      }),
    onSuccess: async () => {
      pushToast({ title: 'Subscription updated', variant: 'success' });
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      const apiError = toApiClientError(error);
      pushToast({ title: 'Action failed', description: apiError?.message ?? 'Unable to update subscription.', variant: 'error' });
    }
  });

  if (toolsQuery.isLoading || teamQuery.isLoading || subscriptionsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (toolsQuery.isError || teamQuery.isError || subscriptionsQuery.isError) {
    const apiError = toApiClientError(toolsQuery.error) || toApiClientError(teamQuery.error) || toApiClientError(subscriptionsQuery.error);

    return (
      <ErrorState
        description={apiError?.message ?? 'Unable to load subscriptions.'}
        requestId={apiError?.requestId}
        onRetry={() => {
          void toolsQuery.refetch();
          void teamQuery.refetch();
          void subscriptionsQuery.refetch();
        }}
      />
    );
  }

  const tools = toolsQuery.data ?? [];
  const teams = teamQuery.data?.teams ?? [];
  const users = teamQuery.data?.users ?? [];
  const subscriptions = subscriptionsQuery.data ?? [];

  const userMap = new Map(users.map((user) => [user.id, user]));
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const toolMap = new Map(tools.map((tool) => [tool.id, tool]));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Search and manage AI subscriptions with policy-aware actions."
        primaryAction={<Button onClick={() => void subscriptionsQuery.refetch()}>Refresh List</Button>}
        secondaryAction={<Button variant="secondary">Export CSV</Button>}
      />

      <Card>
        <div className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Search</label>
            <Input
              value={filters.q}
              onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
              placeholder="Search by tool or user"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Tool</label>
            <Select value={filters.toolId} onChange={(event) => setFilters((current) => ({ ...current, toolId: event.target.value }))}>
              <option value="">All tools</option>
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>{tool.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Team</label>
            <Select value={filters.teamId} onChange={(event) => setFilters((current) => ({ ...current, teamId: event.target.value }))}>
              <option value="">All teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Status</label>
            <Select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="canceled">Canceled</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Personal</label>
            <Select value={filters.personal} onChange={(event) => setFilters((current) => ({ ...current, personal: event.target.value }))}>
              <option value="">All</option>
              <option value="true">Personal</option>
              <option value="false">Company</option>
            </Select>
          </div>
        </div>
      </Card>

      {subscriptions.length === 0 ? (
        <EmptyState
          title="No subscriptions match these filters"
          description="Adjust filters or run a new sync to discover additional subscriptions."
          ctaLabel="Clear Filters"
          onCtaClick={() => setFilters({ toolId: '', teamId: '', status: '', personal: '', q: '' })}
        />
      ) : (
        <Card>
          <Table>
            <TableHead>
              <tr>
                <TH>User</TH>
                <TH>Team</TH>
                <TH>Tool</TH>
                <TH>Plan</TH>
                <TH>Seat Cost</TH>
                <TH>Status</TH>
                <TH>Started</TH>
                <TH>Actions</TH>
              </tr>
            </TableHead>
            <TableBody>
              {subscriptions.map((subscription) => {
                const user = userMap.get(subscription.userId);
                const team = teamMap.get(user?.teamId ?? '');
                const tool = toolMap.get(subscription.toolId);

                return (
                  <tr key={subscription.id}>
                    <TD>
                      <div>
                        <p>{user?.name ?? subscription.userId}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                    </TD>
                    <TD>{team?.name ?? '-'}</TD>
                    <TD>{tool?.name ?? subscription.toolId}</TD>
                    <TD>{subscription.plan}</TD>
                    <TD>{formatCurrency(subscription.seatCostMonthly)}</TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <Badge tone={subscription.status === 'active' ? 'success' : 'warning'}>{subscription.status}</Badge>
                        {subscription.isPersonal ? <Badge tone="danger">personal</Badge> : null}
                      </div>
                    </TD>
                    <TD>{formatDate(subscription.startedAt)}</TD>
                    <TD>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" onClick={() => mutateSubscription.mutate({ id: subscription.id, action: 'cancel' })}>Cancel</Button>
                        <Button variant="secondary" onClick={() => mutateSubscription.mutate({ id: subscription.id, action: 'mark-personal' })}>Toggle Personal</Button>
                        <Button variant="ghost" onClick={() => mutateSubscription.mutate({ id: subscription.id, action: 'request-sso' })}>Request SSO</Button>
                      </div>
                    </TD>
                  </tr>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};
