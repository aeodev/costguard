import type { AuditLog } from '@aicostguard/shared';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { queryKeys } from '../../shared/constants/query-keys';
import { apiFetch } from '../../shared/lib/api-client';
import { formatDate } from '../../shared/lib/format';
import { toApiClientError } from '../../shared/types/errors';
import { Button } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { EmptyState } from '../../shared/ui/empty-state';
import { ErrorState } from '../../shared/ui/error-state';
import { Input } from '../../shared/ui/input';
import { PageHeader } from '../../shared/ui/page-header';
import { Select } from '../../shared/ui/select';
import { Skeleton } from '../../shared/ui/skeleton';
import { Table, TableBody, TableHead, TD, TH } from '../../shared/ui/table';

type AuditFilters = {
  action: string;
  actor: string;
  range: string;
};

const buildAuditQuery = (filters: AuditFilters): string => {
  const params = new URLSearchParams();
  if (filters.action) params.set('action', filters.action);
  if (filters.actor) params.set('actor', filters.actor);
  if (filters.range) params.set('range', filters.range);
  return params.toString();
};

const renderMeta = (meta: Record<string, unknown>): string => {
  const entries = Object.entries(meta);
  if (entries.length === 0) return '-';
  return entries
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(' | ');
};

export const AuditPage = () => {
  const [filters, setFilters] = useState<AuditFilters>({ action: '', actor: '', range: '30d' });
  const filterQuery = useMemo(() => buildAuditQuery(filters), [filters]);

  const auditQuery = useQuery({
    queryKey: queryKeys.audit(filterQuery),
    queryFn: () => apiFetch<AuditLog[]>(`/audit${filterQuery ? `?${filterQuery}` : ''}`)
  });

  if (auditQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (auditQuery.isError || !auditQuery.data) {
    const apiError = toApiClientError(auditQuery.error);
    return (
      <ErrorState
        description={apiError?.message ?? 'Unable to load audit logs.'}
        requestId={apiError?.requestId}
        onRetry={() => void auditQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit"
        description="Review governance actions with filters for actor, action, and time range."
        primaryAction={<Button onClick={() => void auditQuery.refetch()}>Refresh feed</Button>}
      />

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Action</label>
            <Input
              placeholder="policy.updated"
              value={filters.action}
              onChange={(event) => setFilters((current) => ({ ...current, action: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Actor</label>
            <Input
              placeholder="name, email, or id"
              value={filters.actor}
              onChange={(event) => setFilters((current) => ({ ...current, actor: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Range</label>
            <Select
              value={filters.range}
              onChange={(event) => setFilters((current) => ({ ...current, range: event.target.value }))}
            >
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
            </Select>
          </div>
        </div>
      </Card>

      {auditQuery.data.length === 0 ? (
        <EmptyState
          title="No audit records match this filter"
          description="Try broadening filters or increasing the date range."
          ctaLabel="Reset filters"
          onCtaClick={() => setFilters({ action: '', actor: '', range: '30d' })}
        />
      ) : (
        <Card>
          <Table>
            <TableHead>
              <tr>
                <TH>Action</TH>
                <TH>Actor</TH>
                <TH>Target</TH>
                <TH>Meta</TH>
                <TH>Date</TH>
              </tr>
            </TableHead>
            <TableBody>
              {auditQuery.data.map((log) => (
                <tr key={log.id}>
                  <TD>{log.action}</TD>
                  <TD>{log.actorUserId}</TD>
                  <TD>
                    {log.targetType}:{log.targetId}
                  </TD>
                  <TD className="max-w-xs text-xs text-slate-400">{renderMeta(log.meta as Record<string, unknown>)}</TD>
                  <TD>{formatDate(log.createdAt)}</TD>
                </tr>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};
