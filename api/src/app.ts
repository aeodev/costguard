import { randomBytes } from 'node:crypto';
import {
  auditQuerySchema,
  loginRequestSchema,
  policyUpsertRequestSchema,
  riskQuerySchema,
  spendSummaryQuerySchema,
  subscriptionsQuerySchema
} from '@aicostguard/shared';
import type { Policy, RiskFinding, SpendEvent, Subscription } from '@aicostguard/shared';
import { cors } from 'hono/cors';
import { Hono } from 'hono';
import { db, nextId, pushAudit, sessions } from './data/store';
import { env } from './lib/env';
import { fail, ok, parseBody, parseQuery } from './lib/http';
import { authMiddleware } from './middleware/auth';
import { requestIdMiddleware } from './middleware/request-id';
import type { AppEnv } from './types';

export const app = new Hono<AppEnv>();

const dayMs = 24 * 60 * 60 * 1000;
const toDay = (isoDate: string): string => isoDate.slice(0, 10);

const daysSince = (isoDate: string): number => {
  const delta = Date.now() - new Date(isoDate).getTime();
  return Math.floor(delta / dayMs);
};

const sumBy = <T>(items: T[], getKey: (item: T) => string, getValue: (item: T) => number): Record<string, number> => {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + getValue(item);
    return acc;
  }, {});
};

const getSpendInRange = (rangeDays: number): SpendEvent[] => db.spendEvents.filter((event) => daysSince(event.occurredAt) <= rangeDays);

app.use('*', cors({ origin: env.CORS_ORIGIN }));
app.use('*', requestIdMiddleware);

app.get('/health', (c) =>
  ok(c, {
    status: 'ok',
    service: 'aicostguard-api',
    timestamp: new Date().toISOString()
  })
);

app.post('/auth/login', async (c) => {
  const parsedBody = await parseBody(c, loginRequestSchema);
  if (parsedBody.error || !parsedBody.data) return parsedBody.error as Response;

  const { email, password } = parsedBody.data;
  const user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!user || password !== 'password123') {
    return fail(c, 'INVALID_CREDENTIALS', 'Email or password is incorrect', 401);
  }

  const token = `mock.${user.id}.${randomBytes(12).toString('hex')}`;
  sessions.set(token, {
    userId: user.id,
    createdAt: new Date().toISOString()
  });

  pushAudit(user.id, 'auth.login', 'user', user.id, { email: user.email });

  return ok(c, {
    token,
    user
  });
});

app.use('*', authMiddleware);

app.get('/me', (c) => {
  const user = db.users.find((item) => item.id === c.get('authUserId'));
  if (!user) return fail(c, 'NOT_FOUND', 'User not found', 404);

  const spend30d = getSpendInRange(30).reduce((sum, event) => sum + event.amount, 0);

  return ok(c, {
    user,
    org: db.org,
    basics: {
      activeSubscriptions: db.subscriptions.filter((item) => item.status === 'active').length,
      openFindings: db.riskFindings.filter((item) => item.status === 'open').length,
      monthlySpend: Number(spend30d.toFixed(2))
    }
  });
});

app.get('/org/overview', (c) => {
  const spend30d = getSpendInRange(30);
  const totalSpend30d = spend30d.reduce((sum, event) => sum + event.amount, 0);

  const spendSeries = Object.entries(sumBy(spend30d, (event) => toDay(event.occurredAt), (event) => event.amount))
    .map(([date, amount]) => ({ date, amount: Number(amount.toFixed(2)) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const topToolsBySpend = Object.entries(sumBy(spend30d, (event) => event.toolId, (event) => event.amount))
    .map(([toolId, amount]) => ({
      toolId,
      toolName: db.tools.find((tool) => tool.id === toolId)?.name ?? toolId,
      amount: Number(amount.toFixed(2))
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const recentFindings = [...db.riskFindings]
    .sort((a, b) => b.detectedAt.localeCompare(a.detectedAt))
    .slice(0, 6);

  const activeSubscriptions = db.subscriptions.filter((item) => item.status === 'active');
  const activeSSOCount = activeSubscriptions.filter((sub) => db.tools.find((tool) => tool.id === sub.toolId)?.supportsSSO).length;
  const ssoCoveragePercent =
    activeSubscriptions.length === 0 ? 0 : Math.round((activeSSOCount / activeSubscriptions.length) * 100);

  const highSeverityFindings = db.riskFindings.filter((finding) => finding.severity === 'high' && finding.status === 'open').length;
  const personalSubscriptions = activeSubscriptions.filter((subscription) => subscription.isPersonal).length;

  return ok(c, {
    kpis: {
      totalSpend30d: Number(totalSpend30d.toFixed(2)),
      activeSubscriptions: activeSubscriptions.length,
      openFindings: db.riskFindings.filter((finding) => finding.status === 'open').length,
      highSeverityFindings,
      personalSubscriptions,
      ssoCoveragePercent
    },
    spendSeries,
    topToolsBySpend,
    recentFindings,
    recommendedActions: [
      {
        id: 'rec_001',
        title: 'Consolidate duplicate coding assistants',
        reason: 'Multiple teams run overlapping licenses with similar features.',
        cta: 'Review subscriptions'
      },
      {
        id: 'rec_002',
        title: 'Resolve high-severity findings this week',
        reason: `${highSeverityFindings} open high findings are increasing exposure.`,
        cta: 'Open risk center'
      },
      {
        id: 'rec_003',
        title: 'Expand SSO coverage to non-compliant tools',
        reason: `${ssoCoveragePercent}% of active subscriptions are on SSO-capable tools.`,
        cta: 'Update policy'
      }
    ]
  });
});

app.get('/tools', (c) => ok(c, db.tools));

app.get('/subscriptions', (c) => {
  const parsedQuery = parseQuery(c, subscriptionsQuerySchema);
  if (parsedQuery.error || !parsedQuery.data) return parsedQuery.error as Response;

  const { toolId, teamId, status, personal, q } = parsedQuery.data;

  const filtered = db.subscriptions
    .filter((subscription) => {
      const user = db.users.find((item) => item.id === subscription.userId);
      const tool = db.tools.find((item) => item.id === subscription.toolId);

      if (toolId && subscription.toolId !== toolId) return false;
      if (teamId && user?.teamId !== teamId) return false;
      if (status && subscription.status !== status) return false;

      if (personal !== undefined) {
        const wantsPersonal = personal === 'true';
        if ((subscription.isPersonal ?? false) !== wantsPersonal) return false;
      }

      if (q) {
        const needle = q.toLowerCase();
        const matchesUser = user?.name.toLowerCase().includes(needle) || user?.email.toLowerCase().includes(needle);
        const matchesTool = tool?.name.toLowerCase().includes(needle);
        if (!matchesUser && !matchesTool) return false;
      }

      return true;
    })
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  return ok(c, filtered);
});

app.post('/subscriptions/:id/cancel', (c) => {
  const subscription = db.subscriptions.find((item) => item.id === c.req.param('id'));
  if (!subscription) return fail(c, 'NOT_FOUND', 'Subscription not found', 404);

  subscription.status = 'canceled';
  pushAudit(c.get('authUserId'), 'subscription.canceled', 'subscription', subscription.id, {
    status: subscription.status
  });

  return ok(c, subscription);
});

app.post('/subscriptions/:id/mark-personal', (c) => {
  const subscription = db.subscriptions.find((item) => item.id === c.req.param('id'));
  if (!subscription) return fail(c, 'NOT_FOUND', 'Subscription not found', 404);

  subscription.isPersonal = !(subscription.isPersonal ?? false);
  pushAudit(c.get('authUserId'), 'subscription.mark_personal', 'subscription', subscription.id, {
    isPersonal: subscription.isPersonal
  });

  return ok(c, subscription);
});

app.post('/subscriptions/:id/request-sso', (c) => {
  const subscription = db.subscriptions.find((item) => item.id === c.req.param('id'));
  if (!subscription) return fail(c, 'NOT_FOUND', 'Subscription not found', 404);

  pushAudit(c.get('authUserId'), 'subscription.request_sso', 'subscription', subscription.id, {
    toolId: subscription.toolId,
    note: 'Vendor follow-up requested by governance admin'
  });

  return ok(c, {
    status: 'logged',
    subscriptionId: subscription.id
  });
});

app.get('/spend/summary', (c) => {
  const parsedQuery = parseQuery(c, spendSummaryQuerySchema);
  if (parsedQuery.error || !parsedQuery.data) return parsedQuery.error as Response;

  const rangeDays = parsedQuery.data.range === '90d' ? 90 : 30;
  const events = getSpendInRange(rangeDays);

  const totalSpend = events.reduce((sum, event) => sum + event.amount, 0);
  const timeSeries = Object.entries(sumBy(events, (event) => toDay(event.occurredAt), (event) => event.amount))
    .map(([date, amount]) => ({ date, amount: Number(amount.toFixed(2)) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const byTool = Object.entries(sumBy(events, (event) => event.toolId, (event) => event.amount))
    .map(([toolId, amount]) => ({
      toolId,
      toolName: db.tools.find((tool) => tool.id === toolId)?.name ?? toolId,
      amount: Number(amount.toFixed(2))
    }))
    .sort((a, b) => b.amount - a.amount);

  const byTeam = Object.entries(
    sumBy(
      events.filter((event) => event.teamId),
      (event) => event.teamId ?? 'unknown',
      (event) => event.amount
    )
  )
    .map(([teamId, amount]) => ({
      teamId,
      teamName: db.teams.find((team) => team.id === teamId)?.name ?? teamId,
      amount: Number(amount.toFixed(2))
    }))
    .sort((a, b) => b.amount - a.amount);

  const seatSpend = events.filter((event) => event.type === 'seat').reduce((sum, event) => sum + event.amount, 0);
  const activeCount = db.subscriptions.filter((sub) => sub.status === 'active').length;

  return ok(c, {
    timeSeries,
    byTool,
    byTeam,
    perSeatAverage: Number((seatSpend / Math.max(1, activeCount)).toFixed(2)),
    estimatedHoursSaved: Math.round(totalSpend / 55)
  });
});

app.get('/risk/findings', (c) => {
  const parsedQuery = parseQuery(c, riskQuerySchema);
  if (parsedQuery.error || !parsedQuery.data) return parsedQuery.error as Response;

  const { severity, status, q } = parsedQuery.data;

  const findings = db.riskFindings
    .filter((finding) => {
      if (severity && finding.severity !== severity) return false;
      if (status && finding.status !== status) return false;

      if (q) {
        const needle = q.toLowerCase();
        const toolName = db.tools.find((tool) => tool.id === finding.toolId)?.name.toLowerCase() ?? '';
        const userEmail = db.users.find((user) => user.id === finding.userId)?.email.toLowerCase() ?? '';

        if (
          !finding.title.toLowerCase().includes(needle) &&
          !finding.description.toLowerCase().includes(needle) &&
          !finding.type.toLowerCase().includes(needle) &&
          !toolName.includes(needle) &&
          !userEmail.includes(needle)
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));

  return ok(c, findings);
});

app.post('/risk/:id/resolve', (c) => {
  const finding = db.riskFindings.find((item) => item.id === c.req.param('id'));
  if (!finding) return fail(c, 'NOT_FOUND', 'Risk finding not found', 404);

  finding.status = 'resolved';
  pushAudit(c.get('authUserId'), 'risk.resolved', 'risk', finding.id, {
    severity: finding.severity,
    type: finding.type
  });

  return ok(c, finding);
});

app.get('/policies', (c) =>
  ok(c, {
    policies: db.policies,
    tools: db.tools
  })
);

app.post('/policies', async (c) => {
  const parsedBody = await parseBody(c, policyUpsertRequestSchema);
  if (parsedBody.error || !parsedBody.data) return parsedBody.error as Response;

  const incoming = parsedBody.data;
  const existing = db.policies[0];

  const nextPolicy: Policy = {
    id: existing?.id ?? 'policy_001',
    name: incoming.name,
    rules: incoming.rules,
    updatedAt: new Date().toISOString()
  };

  if (existing) db.policies[0] = nextPolicy;
  else db.policies.push(nextPolicy);

  pushAudit(c.get('authUserId'), 'policy.updated', 'policy', nextPolicy.id, {
    allowlistedToolIds: nextPolicy.rules.allowlistedToolIds.length,
    requireSSO: nextPolicy.rules.requireSSO,
    banPersonalAccounts: nextPolicy.rules.banPersonalAccounts,
    monthlySpendCap: nextPolicy.rules.monthlySpendCap
  });

  return ok(c, nextPolicy);
});

app.get('/integrations', (c) => ok(c, db.integrations));

app.post('/integrations/mock-sync', (c) => {
  const actorUserId = c.get('authUserId');
  const syncStartedAuditCount = db.auditLogs.length;

  const addedSubscriptions: Subscription[] = [];
  const addedFindings: RiskFinding[] = [];

  for (let i = 0; i < 3; i += 1) {
    const user = db.users[(db.subscriptions.length + i) % db.users.length];
    const tool = db.tools[(db.subscriptions.length + i * 2) % db.tools.length];
    const subscription: Subscription = {
      id: nextId('sub'),
      toolId: tool.id,
      userId: user.id,
      plan: i === 2 ? 'Enterprise' : 'Business',
      seatCostMonthly: i === 2 ? 95 : 65,
      status: 'active',
      startedAt: new Date().toISOString(),
      isPersonal: false
    };

    db.subscriptions.unshift(subscription);
    addedSubscriptions.push(subscription);
    pushAudit(actorUserId, 'subscription.created', 'subscription', subscription.id, {
      source: 'mock-sync',
      toolId: subscription.toolId,
      userId: subscription.userId
    });
  }

  for (let i = 0; i < 10; i += 1) {
    const tool = db.tools[(db.spendEvents.length + i) % db.tools.length];
    const team = db.teams[(db.spendEvents.length + i) % db.teams.length];

    const spendEvent: SpendEvent = {
      id: nextId('spend'),
      toolId: tool.id,
      amount: 120 + (i % 5) * 40,
      currency: 'USD',
      occurredAt: new Date(Date.now() - i * dayMs).toISOString(),
      type: i % 3 === 0 ? 'overage' : i % 2 === 0 ? 'api' : 'seat',
      teamId: team.id
    };

    db.spendEvents.unshift(spendEvent);
    pushAudit(actorUserId, 'spend.imported', 'spend_event', spendEvent.id, {
      source: 'mock-sync',
      toolId: spendEvent.toolId,
      amount: spendEvent.amount
    });
  }

  for (let i = 0; i < 2; i += 1) {
    const tool = db.tools[(db.riskFindings.length + i) % db.tools.length];
    const user = db.users[(db.riskFindings.length + i) % db.users.length];

    const finding: RiskFinding = {
      id: nextId('risk'),
      severity: i === 0 ? 'high' : 'med',
      type: i === 0 ? 'sso_gap' : 'personal_account',
      title: `${tool.name} sync-discovered governance issue`,
      description: `${tool.name} produced a new governance signal during connector sync.`,
      toolId: tool.id,
      userId: user.id,
      detectedAt: new Date().toISOString(),
      status: 'open'
    };

    db.riskFindings.unshift(finding);
    addedFindings.push(finding);
    pushAudit(actorUserId, 'risk.created', 'risk', finding.id, {
      source: 'mock-sync',
      severity: finding.severity
    });
  }

  db.integrations = db.integrations.map((integration) => ({
    ...integration,
    status: integration.status === 'not_connected' ? 'connected' : integration.status,
    lastSyncAt: new Date().toISOString()
  }));

  pushAudit(actorUserId, 'integration.mock_sync', 'integration', 'all', {
    addedSubscriptions: addedSubscriptions.length,
    addedSpendEvents: 10,
    addedRiskFindings: addedFindings.length
  });

  return ok(c, {
    addedSubscriptions: addedSubscriptions.length,
    addedSpendEvents: 10,
    addedRiskFindings: addedFindings.length,
    auditEntriesCreated: db.auditLogs.length - syncStartedAuditCount,
    subscriptionIds: addedSubscriptions.map((item) => item.id),
    findingIds: addedFindings.map((item) => item.id)
  });
});

app.get('/audit', (c) => {
  const parsedQuery = parseQuery(c, auditQuerySchema);
  if (parsedQuery.error || !parsedQuery.data) return parsedQuery.error as Response;

  const { action, actor, range } = parsedQuery.data;

  const rangeDays = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : null;

  const logs = db.auditLogs
    .filter((log) => {
      if (action && !log.action.toLowerCase().includes(action.toLowerCase())) return false;

      if (actor) {
        const needle = actor.toLowerCase();
        const actorUser = db.users.find((user) => user.id === log.actorUserId);
        const matches =
          log.actorUserId.toLowerCase().includes(needle) ||
          actorUser?.name.toLowerCase().includes(needle) ||
          actorUser?.email.toLowerCase().includes(needle);

        if (!matches) return false;
      }

      if (rangeDays !== null && daysSince(log.createdAt) > rangeDays) return false;

      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return ok(c, logs);
});

app.get('/team', (c) =>
  ok(c, {
    teams: db.teams,
    users: db.users,
    subscriptions: db.subscriptions
  })
);

app.notFound((c) => fail(c, 'NOT_FOUND', `Route ${c.req.path} not found`, 404));

app.onError((error, c) => {
  console.error(error);
  return fail(c, 'INTERNAL_ERROR', 'Unexpected server error', 500);
});
