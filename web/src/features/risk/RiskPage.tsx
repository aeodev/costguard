import type { RiskFinding, Tool, User } from '@aicostguard/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useToast } from '../../app/providers/toast-provider';
import { queryKeys } from '../../shared/constants/query-keys';
import { apiFetch } from '../../shared/lib/api-client';
import { formatDate } from '../../shared/lib/format';
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

type RiskFilters = {
  severity: string;
  status: string;
  q: string;
};

type TeamResponse = {
  users: User[];
};

const buildRiskQuery = (filters: RiskFilters): string => {
  const params = new URLSearchParams();
  if (filters.severity) params.set('severity', filters.severity);
  if (filters.status) params.set('status', filters.status);
  if (filters.q) params.set('q', filters.q);
  return params.toString();
};

export const RiskPage = () => {
  const [filters, setFilters] = useState<RiskFilters>({ severity: '', status: '', q: '' });
  const [selectedFinding, setSelectedFinding] = useState<RiskFinding | null>(null);

  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const filterQuery = useMemo(() => buildRiskQuery(filters), [filters]);

  const findingsQuery = useQuery({
    queryKey: queryKeys.riskFindings(filterQuery),
    queryFn: () => apiFetch<RiskFinding[]>(`/risk/findings${filterQuery ? `?${filterQuery}` : ''}`)
  });

  const toolsQuery = useQuery({
    queryKey: queryKeys.tools,
    queryFn: () => apiFetch<Tool[]>('/tools')
  });

  const usersQuery = useQuery({
    queryKey: queryKeys.team,
    queryFn: () => apiFetch<TeamResponse>('/team')
  });

  const resolveMutation = useMutation({
    mutationFn: (id: string) => apiFetch<RiskFinding>(`/risk/${id}/resolve`, { method: 'POST' }),
    onSuccess: async () => {
      pushToast({ title: 'Finding resolved', variant: 'success' });
      setSelectedFinding(null);
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      const apiError = toApiClientError(error);
      pushToast({ title: 'Resolve failed', description: apiError?.message, variant: 'error' });
    }
  });

  if (findingsQuery.isLoading || toolsQuery.isLoading || usersQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (findingsQuery.isError || toolsQuery.isError || usersQuery.isError || !findingsQuery.data || !toolsQuery.data || !usersQuery.data) {
    const apiError =
      toApiClientError(findingsQuery.error) ||
      toApiClientError(toolsQuery.error) ||
      toApiClientError(usersQuery.error);

    return (
      <ErrorState
        description={apiError?.message ?? 'Unable to load risk findings.'}
        requestId={apiError?.requestId}
        onRetry={() => {
          void findingsQuery.refetch();
          void toolsQuery.refetch();
          void usersQuery.refetch();
        }}
      />
    );
  }

  const findings = findingsQuery.data;
  const tools = toolsQuery.data;
  const users = usersQuery.data.users;
  const toolById = new Map(tools.map((tool) => [tool.id, tool]));
  const userById = new Map(users.map((user) => [user.id, user]));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk"
        description="Prioritize and resolve governance findings by severity, status, and business context."
        primaryAction={<Button onClick={() => void findingsQuery.refetch()}>Refresh Findings</Button>}
        secondaryAction={<Button variant="secondary">Export register</Button>}
      />

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Severity</label>
            <Select value={filters.severity} onChange={(event) => setFilters((current) => ({ ...current, severity: event.target.value }))}>
              <option value="">All severities</option>
              <option value="high">High</option>
              <option value="med">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Status</label>
            <Select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">All statuses</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Search</label>
            <Input
              value={filters.q}
              onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
              placeholder="Type, title, user, or tool"
            />
          </div>
        </div>
      </Card>

      {findings.length === 0 ? (
        <EmptyState
          title="No findings for this filter set"
          description="Try broader filters or run a sync to discover new findings."
          ctaLabel="Reset Filters"
          onCtaClick={() => setFilters({ severity: '', status: '', q: '' })}
        />
      ) : (
        <Card>
          <Table>
            <TableHead>
              <tr>
                <TH>Title</TH>
                <TH>Tool</TH>
                <TH>Severity</TH>
                <TH>Status</TH>
                <TH>Detected</TH>
                <TH>Action</TH>
              </tr>
            </TableHead>
            <TableBody>
              {findings.map((finding) => (
                <tr key={finding.id}>
                  <TD>
                    <p>{finding.title}</p>
                    <p className="text-xs text-slate-500">{finding.type}</p>
                  </TD>
                  <TD>{toolById.get(finding.toolId ?? '')?.name ?? '-'}</TD>
                  <TD>
                    <Badge tone={finding.severity === 'high' ? 'danger' : finding.severity === 'med' ? 'warning' : 'info'}>
                      {finding.severity}
                    </Badge>
                  </TD>
                  <TD>
                    <Badge tone={finding.status === 'open' ? 'warning' : 'success'}>{finding.status}</Badge>
                  </TD>
                  <TD>{formatDate(finding.detectedAt)}</TD>
                  <TD>
                    <Button variant="secondary" onClick={() => setSelectedFinding(finding)}>
                      Open drawer
                    </Button>
                  </TD>
                </tr>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {selectedFinding ? (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-slate-950/60" onClick={() => setSelectedFinding(null)} />
          <aside className="h-full w-full max-w-lg overflow-auto border-l border-slate-800 bg-slate-950 p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Risk detail</p>
                <h3 className="mt-1 text-xl font-semibold">{selectedFinding.title}</h3>
              </div>
              <Button variant="ghost" onClick={() => setSelectedFinding(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <p><span className="text-slate-500">Type:</span> {selectedFinding.type}</p>
              <p><span className="text-slate-500">Description:</span> {selectedFinding.description}</p>
              <p><span className="text-slate-500">Tool:</span> {toolById.get(selectedFinding.toolId ?? '')?.name ?? '-'}</p>
              <p><span className="text-slate-500">User:</span> {userById.get(selectedFinding.userId ?? '')?.email ?? '-'}</p>
              <p><span className="text-slate-500">Detected:</span> {formatDate(selectedFinding.detectedAt)}</p>
              <div className="flex items-center gap-2">
                <Badge tone={selectedFinding.severity === 'high' ? 'danger' : selectedFinding.severity === 'med' ? 'warning' : 'info'}>
                  {selectedFinding.severity}
                </Badge>
                <Badge tone={selectedFinding.status === 'open' ? 'warning' : 'success'}>{selectedFinding.status}</Badge>
              </div>
            </div>

            {selectedFinding.status === 'open' ? (
              <Button className="mt-5" onClick={() => resolveMutation.mutate(selectedFinding.id)} loading={resolveMutation.isPending}>
                Resolve finding
              </Button>
            ) : null}
          </aside>
        </div>
      ) : null}
    </div>
  );
};
