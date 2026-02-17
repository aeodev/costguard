import { Link } from 'react-router-dom';
import { blogPosts } from '../shared/constants/blog-posts';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';

const steps = [
  'Connect integrations to discover subscriptions and identity posture.',
  'Aggregate seat, API, and overage spend signals across teams.',
  'Detect policy and risk findings, then assign remediation owners.',
  'Track actions through audit logs and governance dashboards.'
];

const integrations = ['Google Workspace', 'Okta', 'Ramp / Brex', 'GitHub'];

export const DocsPage = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">Documentation</h1>
        <p className="max-w-3xl text-sm text-slate-400">
          Learn how AICostGuard discovers AI subscriptions, computes spend visibility, and operationalizes governance policy.
        </p>
        <div className="flex gap-3">
          <Link to="/auth/login">
            <Button>Launch demo</Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary">Talk to product team</Button>
          </Link>
        </div>
      </section>

      <Card>
        <h2 className="text-xl font-semibold">How it works</h2>
        <ol className="mt-4 space-y-2 text-sm text-slate-300">
          {steps.map((step, index) => (
            <li key={step}>
              <span className="mr-2 text-emerald-300">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Integration coverage</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {integrations.map((name) => (
            <div key={name} className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-300">
              {name}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">API quick start</h2>
        <p className="mt-2 text-sm text-slate-400">Authenticate first, then call protected endpoints with the bearer token.</p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
{`curl -X POST http://localhost:4000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@aicostguard.dev","password":"password123"}'

curl http://localhost:4000/org/overview \\
  -H "Authorization: Bearer <token>"`}
        </pre>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Governance deep dives</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 hover:border-emerald-400/40">
              <p className="text-sm font-semibold text-slate-100">{post.title}</p>
              <p className="mt-1 text-xs text-slate-500">{post.readingTime}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};
