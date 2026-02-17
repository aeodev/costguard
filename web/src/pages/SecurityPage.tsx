import { Link } from 'react-router-dom';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';

const controls = [
  {
    title: 'Data handling',
    body: 'AICostGuard stores governance metadata such as subscriptions, spend events, risk findings, and audit logs. Sensitive actions are traced with request IDs.'
  },
  {
    title: 'Access controls',
    body: 'Role-based access uses admin/member roles with bearer-token sessions and route protection for app pages and mutation endpoints.'
  },
  {
    title: 'Audit logging',
    body: 'Every policy update, sync mutation, and remediation action is written to an immutable audit event stream with actor, action, target, and context.'
  },
  {
    title: 'Retention controls',
    body: 'Tool records include retention windows so security teams can evaluate vendors against internal governance requirements.'
  }
];

export const SecurityPage = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">Security</h1>
        <p className="max-w-3xl text-sm text-slate-400">
          AICostGuard is designed to support secure AI governance operations. Our approach emphasizes transparent controls,
          auditable workflows, and predictable handling of subscription intelligence.
        </p>
        <div className="flex gap-3">
          <Link to="/contact">
            <Button>Request security review</Button>
          </Link>
          <Link to="/docs">
            <Button variant="secondary">Read technical docs</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {controls.map((item) => (
          <Card key={item.title}>
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{item.body}</p>
          </Card>
        ))}
      </section>

      <Card>
        <h2 className="text-xl font-semibold">Compliance posture</h2>
        <p className="mt-2 text-sm text-slate-400">
          We are aligned with common enterprise governance expectations for access controls, auditability, and operational
          incident readiness. We do not claim formal certifications on this demo environment.
        </p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Incident response</h2>
        <p className="mt-2 text-sm text-slate-400">
          Governance incidents are triaged by severity with ownership, timeline, and corrective actions captured in the audit feed.
          Teams can filter recent changes and replay high-risk decisions using request IDs.
        </p>
      </Card>
    </div>
  );
};
