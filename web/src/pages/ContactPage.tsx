import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';
import { Input } from '../shared/ui/input';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  workEmail: z.string().email('Valid work email required'),
  company: z.string().min(2, 'Company is required'),
  role: z.string().min(2, 'Role is required'),
  message: z.string().min(10, 'Please add at least 10 characters')
});

type ContactInput = z.infer<typeof contactSchema>;

export const ContactPage = () => {
  const [isSubmitted, setSubmitted] = useState(false);
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      workEmail: '',
      company: '',
      role: '',
      message: ''
    }
  });

  const submit = form.handleSubmit(() => {
    setSubmitted(true);
    form.reset();
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="mt-3 text-sm text-slate-400">
          Tell us about your AI governance priorities and we will tailor a demo to your finance, security, and engineering needs.
        </p>
        <div className="mt-6 space-y-2 text-sm text-slate-300">
          <p>• Review subscription sprawl and duplicate spend</p>
          <p>• Evaluate policy coverage and enforcement gaps</p>
          <p>• Walk through integration and rollout strategy</p>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Request a demo</h2>
        <p className="mt-2 text-sm text-slate-400">We respond to all requests within one business day.</p>

        {isSubmitted ? (
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p className="text-base font-semibold text-emerald-300">Thanks, your request has been received.</p>
            <p>Our team will contact you soon with a proposed agenda and demo environment details.</p>
            <Button variant="secondary" onClick={() => setSubmitted(false)}>
              Submit another request
            </Button>
          </div>
        ) : (
          <form className="mt-6 space-y-3" onSubmit={submit}>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Name</label>
              <Input {...form.register('name')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.name?.message}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Work Email</label>
              <Input {...form.register('workEmail')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.workEmail?.message}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Company</label>
              <Input {...form.register('company')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.company?.message}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Role</label>
              <Input {...form.register('role')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.role?.message}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">How can we help?</label>
              <Input {...form.register('message')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.message?.message}</p>
            </div>
            <Button type="submit" loading={form.formState.isSubmitting}>
              Submit request
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
