import { Link } from 'react-router-dom';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';

const features = [
  {
    title: 'Automated subscription discovery',
    description: 'Pull AI subscription signals from identity, finance, and engineering systems into one inventory.'
  },
  {
    title: 'Spend visibility by team and tool',
    description: 'Track seat, API, and overage costs with trend and concentration analysis.'
  },
  {
    title: 'Risk findings with severity scoring',
    description: 'Surface shadow AI, SSO gaps, and retention risks with clear ownership paths.'
  },
  {
    title: 'Policy controls that teams can follow',
    description: 'Enforce allowlists, SSO requirements, personal account bans, and budget guardrails.'
  },
  {
    title: 'Integrations with sync diagnostics',
    description: 'Run mock or live syncs and review exactly what changed across subscriptions and findings.'
  },
  {
    title: 'Audit-ready governance timeline',
    description: 'Every action is logged with actor, target, and metadata for compliance reviews.'
  }
];

const testimonials = [
  {
    quote:
      'We uncovered overlapping AI licenses in two weeks and reallocated budget before renewal season.',
    author: 'Dana Wu, CFO, Northline Systems'
  },
  {
    quote:
      'AICostGuard gave security and engineering a shared language: risk, owner, deadline, and evidence.',
    author: 'Arjun Nair, CISO, Beacon Cloud'
  },
  {
    quote:
      'Instead of blocking tools, we now run policy exceptions with accountability and keep developer momentum high.',
    author: 'Maya Ortiz, VP Engineering, Arcbyte'
  }
];

const faqs = [
  {
    q: 'Do you block tools automatically?',
    a: 'No. The default workflow is visibility first, then policy-driven remediation with owner assignments and audit logging.'
  },
  {
    q: 'Can we enforce SSO and ban personal billing?',
    a: 'Yes. Policy rules support SSO requirements, personal account bans, allowlists, and monthly spend caps.'
  },
  {
    q: 'Is this only for engineering teams?',
    a: 'No. The product is designed for finance, security, and engineering to collaborate on one governance system.'
  },
  {
    q: 'How quickly can we see value?',
    a: 'Most teams surface duplicative subscriptions and high-risk exceptions within the first week of syncs.'
  },
  {
    q: 'Do you require full employee monitoring?',
    a: 'No. We focus on subscription, spend, and policy signals rather than invasive productivity tracking.'
  },
  {
    q: 'What if we are early in AI governance maturity?',
    a: 'Start with discovery and auditability, then phase in policy guardrails as your data quality improves.'
  }
];

export const LandingPage = () => {
  return (
    <div className="space-y-20">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-5">
          <p className="inline-block rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
            AI subscription governance for modern teams
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            See every AI subscription. Control spend. Reduce risk.
          </h1>
          <p className="max-w-3xl text-base text-slate-300 md:text-lg">
            AICostGuard gives CFOs, CISOs, and VP Engineering leaders one command center for AI tool discovery,
            spend tracking, policy enforcement, and audit-ready governance.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth/login">
              <Button>Open Product</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="secondary">View Pricing</Button>
            </Link>
          </div>
        </div>
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950">
          <p className="text-xs uppercase tracking-wide text-slate-500">Live governance snapshot</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Active subscriptions</p>
              <p className="text-2xl font-semibold text-slate-100">29</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Open findings</p>
              <p className="text-2xl font-semibold text-rose-300">11</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">SSO coverage</p>
              <p className="text-2xl font-semibold text-emerald-300">72%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Spend (30d)</p>
              <p className="text-2xl font-semibold text-slate-100">$18.4k</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Trusted by teams scaling AI adoption</p>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {['Northline', 'Beacon', 'Arcbyte', 'Monarch', 'Talos', 'Vector Labs'].map((name) => (
            <div key={name} className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-center text-sm text-slate-300">
              {name}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold">Governance capabilities built for execution</h2>
          <p className="mt-2 max-w-3xl text-slate-400">
            AICostGuard connects visibility, policy, and remediation so teams can act on AI risk and spend, not just report on it.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="text-xl font-semibold">For CFO</h3>
          <p className="mt-2 text-sm text-slate-400">
            Consolidate AI spend, compare cost by team, and prioritize savings opportunities before renewal cycles.
          </p>
          <Link to="/app/analytics" className="mt-4 inline-block text-sm text-emerald-300 hover:text-emerald-200">
            See spend analytics
          </Link>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold">For CISO</h3>
          <p className="mt-2 text-sm text-slate-400">
            Track SSO gaps, personal-account risk, and retention controls with severity-based remediation workflows.
          </p>
          <Link to="/app/risk" className="mt-4 inline-block text-sm text-emerald-300 hover:text-emerald-200">
            Open risk center
          </Link>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold">For VP Engineering</h3>
          <p className="mt-2 text-sm text-slate-400">
            Maintain developer velocity while enforcing practical guardrails and transparent exception handling.
          </p>
          <Link to="/app/policies" className="mt-4 inline-block text-sm text-emerald-300 hover:text-emerald-200">
            Review policies
          </Link>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Security preview</p>
          <h3 className="mt-2 text-2xl font-semibold">Governance with auditability by default</h3>
          <p className="mt-3 text-sm text-slate-400">
            Every subscription mutation, risk resolution, and policy update creates an auditable event with actor, target, and metadata.
            Security teams can investigate quickly without reconstructing context from fragmented systems.
          </p>
          <Link to="/security" className="mt-4 inline-block text-sm text-emerald-300 hover:text-emerald-200">
            Read security approach
          </Link>
        </Card>
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author}>
              <p className="text-sm text-slate-200">“{testimonial.quote}”</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{testimonial.author}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">FAQ</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-sky-500/10 p-8 text-center">
        <h2 className="text-3xl font-semibold">Ready to operationalize AI governance?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300">
          Connect your stack, discover hidden subscriptions, and act on risk and spend in one workflow.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/contact">
            <Button>Request Demo</Button>
          </Link>
          <Link to="/docs">
            <Button variant="secondary">Explore Docs</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
