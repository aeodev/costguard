import {
  auditLogsSeed,
  integrationsSeed,
  orgSeed,
  policiesSeed,
  riskFindingsSeed,
  spendEventsSeed,
  subscriptionsSeed,
  teamsSeed,
  toolsSeed,
  usersSeed
} from './seed';

export const db = {
  org: structuredClone(orgSeed),
  teams: structuredClone(teamsSeed),
  users: structuredClone(usersSeed),
  tools: structuredClone(toolsSeed),
  subscriptions: structuredClone(subscriptionsSeed),
  spendEvents: structuredClone(spendEventsSeed),
  riskFindings: structuredClone(riskFindingsSeed),
  policies: structuredClone(policiesSeed),
  integrations: structuredClone(integrationsSeed),
  auditLogs: structuredClone(auditLogsSeed)
};

export const sessions = new Map<string, { userId: string; createdAt: string }>();

const counters = new Map<string, number>([
  ['sub', db.subscriptions.length],
  ['spend', db.spendEvents.length],
  ['risk', db.riskFindings.length],
  ['audit', db.auditLogs.length]
]);

export const nextId = (prefix: string): string => {
  const next = (counters.get(prefix) ?? 0) + 1;
  counters.set(prefix, next);
  return `${prefix}_${String(next).padStart(3, '0')}`;
};

export const pushAudit = (
  actorUserId: string,
  action: string,
  targetType: string,
  targetId: string,
  meta: Record<string, unknown>
): void => {
  db.auditLogs.unshift({
    id: nextId('audit'),
    actorUserId,
    action,
    targetType,
    targetId,
    createdAt: new Date().toISOString(),
    meta
  });
};
