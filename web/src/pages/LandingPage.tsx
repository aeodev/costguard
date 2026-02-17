import { Link } from 'react-router-dom';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';

const features = [
  {
    title: 'Complete AI subscription inventory',
    description: 'Discover paid and personal AI tools across finance, identity, and engineering systems.'
  },
  {
    title: 'Spend intelligence by team',
    description: 'Track seat, API, and overage spend with clear tool-level and team-level attribution.'
  },
  {
    title: 'Risk findings with ownership',
    description: 'Surface shadow AI, SSO gaps, and retention risk with assignable remediation actions.'
  },
  {
    title: 'Policy controls that scale',
    description: 'Configure allowlists, SSO requirements, personal-account bans, and monthly spend caps.'
  },
  {
    title: 'Integration sync with change diffs',
    description: 'Run sync jobs and inspect exactly what changed in subscriptions, spend, and findings.'
  },
  {
    title: 'Audit-ready governance trail',
    description: 'Every policy and remediation action is logged with actor, target, metadata, and time.'
  }
];

const testimonials = [
  {
    quote: 'We uncovered overlapping AI licenses in two weeks and reallocated budget before renewal season.',
    author: 'Dana Wu, CFO, Northline Systems'
  },
  {
    quote: 'Security and engineering finally work from one source of truth for AI governance.',
    author: 'Arjun Nair, CISO, Beacon Cloud'
  },
  {
    quote: 'Guardrails are now practical, measurable, and far less disruptive for developers.',
    author: 'Maya Ortiz, VP Engineering, Arcbyte'
  }
];

const faqs = [
  {
    q: 'Do you block tools automatically?',
    a: 'No. The default model is visibility plus policy-guided remediation with accountable ownership.'
  },
  {
    q: 'Can we enforce SSO and ban personal billing?',
    a: 'Yes. Policy rules support SSO requirements, allowlists, personal-account bans, and spend caps.'
  },
  {
    q: 'Is this only for engineering teams?',
    a: 'No. AICostGuard is built for finance, security, and engineering to operate together.'
  },
  {
    q: 'How quickly can we show value?',
    a: 'Most organizations identify duplicate spend and high-risk subscriptions in the first week.'
  },
  {
    q: 'Do you monitor employee activity?',
    a: 'No. Governance is based on subscription, spend, and policy signals, not intrusive surveillance.'
  },
  {
    q: 'Can we start with a small rollout?',
    a: 'Yes. Teams can begin with discovery and expand to controls and enforcement in phases.'
  }
];

const proofLogos = ['Northline', 'Beacon', 'Arcbyte', 'Monarch', 'Talos', 'Vector Labs'];

export const LandingPage = () => {
  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden rounded-[2rem] bg-surface-elev/96 px-6 py-10 shadow-floating dark:bg-gradient-to-br dark:from-surface-elev dark:via-surface-elev dark:to-surface-soft/40 md:px-10">
        <div className="pointer-events-none absolute -right-12 -top-16 hidden h-52 w-52 rounded-full bg-brand/22 blur-3xl dark:block" />
        <div className="pointer-events-none absolute -bottom-20 left-6 hidden h-56 w-56 rounded-full bg-sky-400/18 blur-3xl dark:block" />

        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/14 px-3 py-1 text-xs font-semibold text-brand">
              Enterprise AI governance platform
            </div>

            <h1 className="font-display max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              See every AI subscription. Control spend. Reduce risk.
            </h1>

            <p className="max-w-2xl text-base text-slate-300 md:text-lg">
              AICostGuard gives CFOs, CISOs, and VP Engineering teams one operating system for AI discovery, policy controls,
              spend governance, and auditability.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/auth/login">
                <Button size="lg">Open Product</Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="secondary">
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div>
                <p className="text-xl font-semibold text-slate-100">29</p>
                <p>Active subscriptions tracked</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-100">$18.4k</p>
                <p>Spend monitored in last 30d</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-100">72%</p>
                <p>SSO coverage visible live</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-surface-soft/24 p-4 shadow-panel md:p-5">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
              <span>Governance snapshot</span>
              <span>Updated now</span>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-surface-soft/44 p-3 shadow-soft">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <span>High-risk findings</span>
                  <span>5 open</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800/60">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-rose-400 to-amber-300" />
                </div>
              </div>

              <div className="rounded-xl bg-surface-soft/44 p-3 shadow-soft">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <span>Allowlisted tool compliance</span>
                  <span>83%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800/60">
                  <div className="h-full w-[83%] rounded-full bg-gradient-to-r from-brand to-sky-400" />
                </div>
              </div>

              <div className="rounded-xl bg-surface-soft/44 p-3 shadow-soft">
                <p className="text-xs uppercase tracking-wide text-slate-500">Recommended action</p>
                <p className="mt-1 text-sm text-slate-100">Consolidate Midjourney personal plans into enterprise workspace.</p>
                <p className="mt-2 text-xs text-brand">Estimated savings: $2,160/year</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Trusted by modern operating teams</p>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {proofLogos.map((name) => (
            <div key={name} className="rounded-xl bg-surface-elev/60 px-3 py-2 text-center text-sm font-medium text-slate-300 shadow-soft">
              {name}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-semibold">Governance capabilities designed for execution</h2>
          <p className="mt-2 max-w-3xl text-slate-400">
            AICostGuard connects discovery, policy, and remediation so teams can act on AI risk and spend, not just report on it.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="transition hover:-translate-y-0.5 hover:brightness-105">
              <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">CFO</p>
          <h3 className="font-display mt-2 text-xl font-semibold">Consolidate AI spend before renewals</h3>
          <p className="mt-2 text-sm text-slate-400">Benchmark tool efficiency, identify duplicate licenses, and plan budget with confidence.</p>
          <Link to="/app/analytics" className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand/80">
            See spend analytics
          </Link>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">CISO</p>
          <h3 className="font-display mt-2 text-xl font-semibold">Manage policy and identity posture</h3>
          <p className="mt-2 text-sm text-slate-400">Track SSO gaps, retention risk, and personal-account exposure with remediation ownership.</p>
          <Link to="/app/risk" className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand/80">
            Open risk center
          </Link>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">VP Engineering</p>
          <h3 className="font-display mt-2 text-xl font-semibold">Govern without slowing developers</h3>
          <p className="mt-2 text-sm text-slate-400">Enforce practical guardrails while preserving team autonomy and productivity.</p>
          <Link to="/app/policies" className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand/80">
            Review policies
          </Link>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Security preview</p>
          <h3 className="font-display mt-2 text-2xl font-semibold">Governance with auditability by default</h3>
          <p className="mt-3 text-sm text-slate-400">
            Every subscription mutation, risk resolution, and policy update creates a complete audit event with actor,
            target, and metadata, making reviews faster and evidence stronger.
          </p>
          <Link to="/security" className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand/80">
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
        <h2 className="font-display text-3xl font-semibold">FAQ</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <h3 className="font-display font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand/14 via-brand/10 to-sky-500/10 p-8 text-center shadow-panel">
        <div className="pointer-events-none absolute -top-20 left-1/2 hidden h-44 w-44 -translate-x-1/2 rounded-full bg-white/20 blur-3xl dark:block" />
        <h2 className="font-display relative text-3xl font-semibold">Ready to operationalize AI governance?</h2>
        <p className="relative mx-auto mt-3 max-w-2xl text-slate-300">
          Connect your stack, discover hidden subscriptions, and act on risk and spend in one workflow.
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/contact">
            <Button size="lg">Request Demo</Button>
          </Link>
          <Link to="/docs">
            <Button size="lg" variant="secondary">
              Explore Docs
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
