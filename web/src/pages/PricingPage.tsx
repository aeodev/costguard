import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';
import { Input } from '../shared/ui/input';
import { Modal } from '../shared/ui/modal';

const requestDemoSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  workEmail: z.string().email('Valid work email required'),
  company: z.string().min(2, 'Company is required'),
  teamSize: z.string().min(1, 'Team size is required')
});

type RequestDemoInput = z.infer<typeof requestDemoSchema>;

const tierData = {
  monthly: [
    {
      name: 'Starter',
      price: '$499',
      blurb: 'For teams establishing AI visibility and baseline controls.',
      features: ['Up to 100 employees', 'Basic integrations', 'Monthly governance reports']
    },
    {
      name: 'Growth',
      price: '$1,499',
      blurb: 'For growing companies that need policy enforcement and audit-ready workflows.',
      features: ['Up to 1000 employees', 'Policy controls + alerts', 'Advanced analytics and audit feed']
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      blurb: 'For large organizations requiring deep controls and dedicated support.',
      features: ['Unlimited employees', 'Priority onboarding', 'Custom data exports and governance reviews']
    }
  ],
  annual: [
    {
      name: 'Starter',
      price: '$5,390',
      blurb: 'Equivalent to two months free on annual billing.',
      features: ['Up to 100 employees', 'Basic integrations', 'Monthly governance reports']
    },
    {
      name: 'Growth',
      price: '$16,190',
      blurb: 'Annual pricing designed for operating-plan predictability.',
      features: ['Up to 1000 employees', 'Policy controls + alerts', 'Advanced analytics and audit feed']
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      blurb: 'Contract pricing aligned to volume, integrations, and control requirements.',
      features: ['Unlimited employees', 'Priority onboarding', 'Custom data exports and governance reviews']
    }
  ]
};

const compareRows = [
  ['Subscription discovery', 'Included', 'Included', 'Included'],
  ['Spend analytics', 'Basic', 'Advanced', 'Advanced + custom'],
  ['Policy controls', 'Core rules', 'Full rule set', 'Full + custom workflows'],
  ['Audit feed', '30 days', '90 days', '12 months'],
  ['Integrations', '2 connectors', '4 connectors', 'Custom connector support'],
  ['Support', 'Email', 'Priority email', 'Dedicated success channel']
];

export const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isModalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RequestDemoInput>({
    resolver: zodResolver(requestDemoSchema),
    defaultValues: {
      name: '',
      workEmail: '',
      company: '',
      teamSize: ''
    }
  });

  const submit = form.handleSubmit(() => {
    setSubmitted(true);
    form.reset();
  });

  const tiers = tierData[billingCycle];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Pricing</h1>
          <p className="mt-2 text-sm text-slate-400">
            Choose a governance plan that matches your AI adoption maturity and operating model.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={billingCycle === 'monthly' ? 'primary' : 'secondary'}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'annual' ? 'primary' : 'secondary'}
            onClick={() => setBillingCycle('annual')}
          >
            Annual
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className={tier.name === 'Growth' ? 'bg-gradient-to-b from-emerald-500/10 to-surface-elev/88' : undefined}>
            <p className="text-sm uppercase tracking-wide text-slate-500">{tier.name}</p>
            <p className="mt-3 text-3xl font-semibold">{tier.price}</p>
            <p className="mt-2 text-sm text-slate-400">{tier.blurb}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {tier.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button className="mt-5 w-full" onClick={() => setModalOpen(true)}>
              Request Demo
            </Button>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-xl font-semibold">Plan comparison</h2>
        <p className="mt-2 text-sm text-slate-400">All plans include secure authentication, request IDs, and governance event logging.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Capability</th>
                <th className="px-3 py-2">Starter</th>
                <th className="px-3 py-2">Growth</th>
                <th className="px-3 py-2">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-line/35">
              {compareRows.map((row) => (
                <tr key={row[0]}>
                  <td className="px-3 py-2 text-slate-200">{row[0]}</td>
                  <td className="px-3 py-2 text-slate-300">{row[1]}</td>
                  <td className="px-3 py-2 text-slate-300">{row[2]}</td>
                  <td className="px-3 py-2 text-slate-300">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={isModalOpen} title="Request a pricing demo" onClose={() => setModalOpen(false)}>
        {submitted ? (
          <div className="space-y-3 text-sm text-slate-300">
            <p className="text-base font-semibold text-emerald-300">Request submitted</p>
            <p>Thanks, our team will contact you with a tailored walkthrough and pricing recommendation.</p>
            <Button onClick={() => setSubmitted(false)} variant="secondary">Submit another request</Button>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={submit}>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Name</label>
              <Input {...form.register('name')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.name?.message}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Work email</label>
              <Input {...form.register('workEmail')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.workEmail?.message}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Company</label>
              <Input {...form.register('company')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.company?.message}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Team size</label>
              <Input placeholder="e.g. 250" {...form.register('teamSize')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.teamSize?.message}</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Submit request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
