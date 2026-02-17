import assert from 'node:assert/strict';
import { app } from '../src/app';

type SuccessEnvelope<T> = {
  ok: true;
  data: T;
  requestId: string;
};

type ErrorEnvelope = {
  ok: false;
  error: { code: string; message: string };
  requestId: string;
};

const request = async <T>(path: string, init?: RequestInit): Promise<{ status: number; body: SuccessEnvelope<T> | ErrorEnvelope }> => {
  const response = await app.request(`http://localhost${path}`, init);
  const body = (await response.json()) as SuccessEnvelope<T> | ErrorEnvelope;
  return { status: response.status, body };
};

const expectSuccess = <T>(response: { status: number; body: SuccessEnvelope<T> | ErrorEnvelope }): SuccessEnvelope<T> => {
  assert.equal(response.body.ok, true);
  assert.equal(typeof response.body.requestId, 'string');
  return response.body as SuccessEnvelope<T>;
};

const authHeaders = (token: string): HeadersInit => ({
  authorization: `Bearer ${token}`,
  'content-type': 'application/json'
});

const run = async (): Promise<void> => {
  const health = await request<{ status: string; service: string }>('/health');
  assert.equal(health.status, 200);
  const healthBody = expectSuccess(health);
  assert.equal(healthBody.data.status, 'ok');
  assert.equal(healthBody.data.service, 'aicostguard-api');

  const unauthorizedMe = await request('/me');
  assert.equal(unauthorizedMe.status, 401);
  assert.equal(unauthorizedMe.body.ok, false);
  assert.equal((unauthorizedMe.body as ErrorEnvelope).error.code, 'UNAUTHORIZED');

  const login = await request<{ token: string; user: { email: string } }>('/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@aicostguard.dev',
      password: 'password123'
    })
  });
  assert.equal(login.status, 200);
  const loginBody = expectSuccess(login);
  assert.equal(loginBody.data.user.email, 'admin@aicostguard.dev');
  const token = loginBody.data.token;

  const me = await request('/me', { headers: authHeaders(token) });
  assert.equal(me.status, 200);
  expectSuccess(me);

  const overview = await request<{ recommendedActions: unknown[] }>('/org/overview', {
    headers: authHeaders(token)
  });
  assert.equal(overview.status, 200);
  const overviewBody = expectSuccess(overview);
  assert.equal(overviewBody.data.recommendedActions.length, 3);

  const subscriptions = await request<
    Array<{
      id: string;
      status: string;
    }>
  >('/subscriptions', {
    headers: authHeaders(token)
  });
  assert.equal(subscriptions.status, 200);
  const subscriptionsBody = expectSuccess(subscriptions);
  assert.ok(subscriptionsBody.data.length >= 35);

  const targetSub = subscriptionsBody.data.find((item) => item.status === 'active') ?? subscriptionsBody.data[0];
  assert.ok(targetSub);

  const toggledPersonal = await request(`/subscriptions/${targetSub.id}/mark-personal`, {
    method: 'POST',
    headers: authHeaders(token)
  });
  assert.equal(toggledPersonal.status, 200);
  expectSuccess(toggledPersonal);

  const requestedSso = await request<{ status: string }>(`/subscriptions/${targetSub.id}/request-sso`, {
    method: 'POST',
    headers: authHeaders(token)
  });
  assert.equal(requestedSso.status, 200);
  const requestedSsoBody = expectSuccess(requestedSso);
  assert.equal(requestedSsoBody.data.status, 'logged');

  const canceled = await request<{ status: string }>(`/subscriptions/${targetSub.id}/cancel`, {
    method: 'POST',
    headers: authHeaders(token)
  });
  assert.equal(canceled.status, 200);
  const canceledBody = expectSuccess(canceled);
  assert.equal(canceledBody.data.status, 'canceled');

  const spend30 = await request<{ timeSeries: unknown[]; byTool: unknown[]; byTeam: unknown[] }>('/spend/summary?range=30d', {
    headers: authHeaders(token)
  });
  assert.equal(spend30.status, 200);
  const spend30Body = expectSuccess(spend30);
  assert.ok(spend30Body.data.timeSeries.length > 0);
  assert.ok(spend30Body.data.byTool.length > 0);
  assert.ok(spend30Body.data.byTeam.length > 0);

  const spend90 = await request<{ timeSeries: unknown[] }>('/spend/summary?range=90d', {
    headers: authHeaders(token)
  });
  assert.equal(spend90.status, 200);
  const spend90Body = expectSuccess(spend90);
  assert.ok(spend90Body.data.timeSeries.length >= spend30Body.data.timeSeries.length);

  const riskFindings = await request<Array<{ id: string; status: string; severity: string }>>('/risk/findings?severity=high', {
    headers: authHeaders(token)
  });
  assert.equal(riskFindings.status, 200);
  const riskBody = expectSuccess(riskFindings);
  assert.ok(riskBody.data.length > 0);

  const openRisk = riskBody.data.find((item) => item.status === 'open') ?? riskBody.data[0];
  const resolveRisk = await request<{ status: string }>(`/risk/${openRisk.id}/resolve`, {
    method: 'POST',
    headers: authHeaders(token)
  });
  assert.equal(resolveRisk.status, 200);
  const resolveRiskBody = expectSuccess(resolveRisk);
  assert.equal(resolveRiskBody.data.status, 'resolved');

  const policies = await request<{ policies: Array<{ id: string }>; tools: Array<{ id: string }> }>('/policies', {
    headers: authHeaders(token)
  });
  assert.equal(policies.status, 200);
  const policiesBody = expectSuccess(policies);
  assert.equal(policiesBody.data.policies.length, 1);
  assert.equal(policiesBody.data.tools.length, 10);

  const updatedPolicy = await request<{ id: string; name: string }>('/policies', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      name: 'Acme AI Governance Baseline',
      rules: {
        allowlistedToolIds: policiesBody.data.tools.slice(0, 6).map((tool) => tool.id),
        requireSSO: true,
        banPersonalAccounts: true,
        monthlySpendCap: 45000
      }
    })
  });
  assert.equal(updatedPolicy.status, 200);
  const updatedPolicyBody = expectSuccess(updatedPolicy);
  assert.equal(updatedPolicyBody.data.id, 'policy_001');

  const integrations = await request<Array<{ id: string }>>('/integrations', {
    headers: authHeaders(token)
  });
  assert.equal(integrations.status, 200);
  const integrationsBody = expectSuccess(integrations);
  assert.equal(integrationsBody.data.length, 4);

  const mockSync = await request<{
    addedSubscriptions: number;
    addedSpendEvents: number;
    addedRiskFindings: number;
    auditEntriesCreated: number;
  }>('/integrations/mock-sync', {
    method: 'POST',
    headers: authHeaders(token)
  });
  assert.equal(mockSync.status, 200);
  const mockSyncBody = expectSuccess(mockSync);
  assert.equal(mockSyncBody.data.addedSubscriptions, 3);
  assert.equal(mockSyncBody.data.addedSpendEvents, 10);
  assert.equal(mockSyncBody.data.addedRiskFindings, 2);
  assert.ok(mockSyncBody.data.auditEntriesCreated >= 4);

  const audit = await request<Array<{ id: string }>>('/audit?range=30d', {
    headers: authHeaders(token)
  });
  assert.equal(audit.status, 200);
  const auditBody = expectSuccess(audit);
  assert.ok(auditBody.data.length > 0);

  const team = await request<{ teams: unknown[]; users: unknown[]; subscriptions: unknown[] }>('/team', {
    headers: authHeaders(token)
  });
  assert.equal(team.status, 200);
  const teamBody = expectSuccess(team);
  assert.equal(teamBody.data.teams.length, 4);
  assert.equal(teamBody.data.users.length, 12);
  assert.ok(teamBody.data.subscriptions.length >= 35);

  console.log('API smoke tests passed');
};

void run();
