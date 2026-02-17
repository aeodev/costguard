import type { Policy, Tool } from '@aicostguard/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '../../app/providers/toast-provider';
import { queryKeys } from '../../shared/constants/query-keys';
import { apiFetch } from '../../shared/lib/api-client';
import { formatDate } from '../../shared/lib/format';
import { toApiClientError } from '../../shared/types/errors';
import { Badge } from '../../shared/ui/badge';
import { Button } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { ErrorState } from '../../shared/ui/error-state';
import { Input } from '../../shared/ui/input';
import { PageHeader } from '../../shared/ui/page-header';
import { Skeleton } from '../../shared/ui/skeleton';

type PoliciesResponse = {
  policies: Policy[];
  tools: Tool[];
};

export const PoliciesPage = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  const policiesQuery = useQuery({
    queryKey: queryKeys.policies,
    queryFn: () => apiFetch<PoliciesResponse>('/policies')
  });

  const [policyName, setPolicyName] = useState('');
  const [allowlistedToolIds, setAllowlistedToolIds] = useState<string[]>([]);
  const [requireSSO, setRequireSSO] = useState(true);
  const [banPersonalAccounts, setBanPersonalAccounts] = useState(true);
  const [monthlySpendCap, setMonthlySpendCap] = useState('0');

  const activePolicy = policiesQuery.data?.policies[0] ?? null;

  useEffect(() => {
    if (!activePolicy) return;
    setPolicyName(activePolicy.name);
    setAllowlistedToolIds(activePolicy.rules.allowlistedToolIds);
    setRequireSSO(activePolicy.rules.requireSSO);
    setBanPersonalAccounts(activePolicy.rules.banPersonalAccounts);
    setMonthlySpendCap(String(activePolicy.rules.monthlySpendCap ?? 0));
  }, [activePolicy]);

  const saveMutation = useMutation({
    mutationFn: () =>
      apiFetch<Policy>('/policies', {
        method: 'POST',
        body: JSON.stringify({
          name: policyName,
          rules: {
            allowlistedToolIds,
            requireSSO,
            banPersonalAccounts,
            monthlySpendCap: Number(monthlySpendCap)
          }
        })
      }),
    onSuccess: async () => {
      pushToast({ title: 'Policy saved', description: 'Governance rules updated successfully.', variant: 'success' });
      await queryClient.invalidateQueries({ queryKey: queryKeys.policies });
      await queryClient.invalidateQueries({ queryKey: queryKeys.audit('') });
    },
    onError: (error) => {
      const apiError = toApiClientError(error);
      pushToast({ title: 'Save failed', description: apiError?.message, variant: 'error' });
    }
  });

  const dirty = useMemo(() => {
    if (!activePolicy) return false;
    const existing = activePolicy.rules;
    const normalizedAllowlist = [...allowlistedToolIds].sort().join(',');
    const existingAllowlist = [...existing.allowlistedToolIds].sort().join(',');

    return (
      activePolicy.name !== policyName ||
      normalizedAllowlist !== existingAllowlist ||
      existing.requireSSO !== requireSSO ||
      existing.banPersonalAccounts !== banPersonalAccounts ||
      Number(existing.monthlySpendCap ?? 0) !== Number(monthlySpendCap)
    );
  }, [activePolicy, allowlistedToolIds, banPersonalAccounts, monthlySpendCap, policyName, requireSSO]);

  if (policiesQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (policiesQuery.isError || !policiesQuery.data) {
    const apiError = toApiClientError(policiesQuery.error);
    return (
      <ErrorState
        description={apiError?.message ?? 'Unable to load policies.'}
        requestId={apiError?.requestId}
        onRetry={() => void policiesQuery.refetch()}
      />
    );
  }

  const tools = policiesQuery.data.tools;

  const toggleTool = (toolId: string): void => {
    setAllowlistedToolIds((current) =>
      current.includes(toolId) ? current.filter((entry) => entry !== toolId) : [...current, toolId]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policies"
        description="Configure guardrails for approved tools, identity controls, and spend limits."
        primaryAction={
          <Button onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} disabled={!dirty || !policyName}>
            Save policy
          </Button>
        }
        secondaryAction={
          <Button variant="secondary" onClick={() => void policiesQuery.refetch()}>
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-lg font-semibold">Active policy editor</h2>
          <p className="mt-2 text-sm text-slate-400">Changes apply to future sync analysis and remediation recommendations.</p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Policy name</label>
              <Input value={policyName} onChange={(event) => setPolicyName(event.target.value)} />
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Allowlisted tools</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {tools.map((tool) => (
                  <label
                    key={tool.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm"
                  >
                    <span>{tool.name}</span>
                    <input
                      type="checkbox"
                      checked={allowlistedToolIds.includes(tool.id)}
                      onChange={() => toggleTool(tool.id)}
                      className="h-4 w-4 accent-emerald-400"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm">
                Require SSO
                <input
                  type="checkbox"
                  checked={requireSSO}
                  onChange={(event) => setRequireSSO(event.target.checked)}
                  className="h-4 w-4 accent-emerald-400"
                />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm">
                Ban personal accounts
                <input
                  type="checkbox"
                  checked={banPersonalAccounts}
                  onChange={(event) => setBanPersonalAccounts(event.target.checked)}
                  className="h-4 w-4 accent-emerald-400"
                />
              </label>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Monthly spend cap</label>
                <Input value={monthlySpendCap} onChange={(event) => setMonthlySpendCap(event.target.value)} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Policy status</h2>
          {activePolicy ? (
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <p>
                Current policy: <span className="font-semibold text-slate-100">{activePolicy.name}</span>
              </p>
              <p>
                Last updated: <span className="font-semibold text-slate-100">{formatDate(activePolicy.updatedAt)}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge tone={activePolicy.rules.requireSSO ? 'success' : 'warning'}>
                  SSO {activePolicy.rules.requireSSO ? 'required' : 'optional'}
                </Badge>
                <Badge tone={activePolicy.rules.banPersonalAccounts ? 'success' : 'warning'}>
                  Personal accounts {activePolicy.rules.banPersonalAccounts ? 'banned' : 'allowed'}
                </Badge>
              </div>
              <p>
                Allowlisted tools: <span className="font-semibold text-slate-100">{activePolicy.rules.allowlistedToolIds.length}</span>
              </p>
              <p>
                Spend cap: <span className="font-semibold text-slate-100">${activePolicy.rules.monthlySpendCap ?? 0}</span>
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No active policy loaded.</p>
          )}
        </Card>
      </div>
    </div>
  );
};
