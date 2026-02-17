import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../app/providers/auth-provider';
import { useToast } from '../../app/providers/toast-provider';
import { ApiClientError } from '../../shared/lib/api-client';
import { Button } from '../../shared/ui/button';
import { Card } from '../../shared/ui/card';
import { Input } from '../../shared/ui/input';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required')
});

type LoginInput = z.infer<typeof loginSchema>;

const ADMIN_DEMO = {
  email: 'admin@aicostguard.dev',
  password: 'password123'
};

const MEMBER_DEMO = {
  email: 'member1@aicostguard.dev',
  password: 'password123'
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const [requestId, setRequestId] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: ADMIN_DEMO
  });

  useEffect(() => {
    form.reset(ADMIN_DEMO);
  }, [form]);

  const fillDemo = (values: LoginInput): void => {
    form.setValue('email', values.email, { shouldDirty: true, shouldTouch: true });
    form.setValue('password', values.password, { shouldDirty: true, shouldTouch: true });
  };

  const submit = form.handleSubmit(async (values) => {
    try {
      await login(values);
      pushToast({ title: 'Signed in', description: 'Welcome to AICostGuard.', variant: 'success' });
      navigate('/app', { replace: true });
    } catch (error) {
      if (error instanceof ApiClientError) {
        setRequestId(error.requestId);
        pushToast({
          title: 'Login failed',
          description: error.message,
          variant: 'error'
        });
      }
    }
  });

  return (
    <div className="mx-auto flex min-h-[74vh] max-w-6xl items-center">
      <div className="grid w-full gap-6 lg:grid-cols-[1.14fr_0.86fr]">
        <Card className="relative overflow-hidden bg-surface-elev/96 dark:bg-gradient-to-br dark:from-brand/20 dark:via-surface-elev/96 dark:to-surface-base">
          <div className="absolute -right-8 -top-8 hidden h-32 w-32 rounded-full bg-brand/26 blur-2xl dark:block" />
          <div className="absolute -bottom-12 left-8 hidden h-28 w-28 rounded-full bg-sky-400/24 blur-2xl dark:block" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/14 px-3 py-1 text-xs font-semibold text-brand">
              AG
              Governance command center
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-100">Sign in to AICostGuard</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
              Track subscriptions, enforce policy controls, and keep an auditable trail of every governance decision.
            </p>

            <div className="mt-6 grid gap-2 rounded-xl bg-surface-soft/36 p-4 text-sm text-slate-200 shadow-soft">
              <p>
                Demo admin: <span className="font-semibold text-slate-100">{ADMIN_DEMO.email} / {ADMIN_DEMO.password}</span>
              </p>
              <p>
                Demo member:{' '}
                <span className="font-semibold text-slate-100">{MEMBER_DEMO.email} / {MEMBER_DEMO.password}</span>
              </p>
            </div>

            <div className="mt-6 grid gap-2 text-xs text-slate-400 sm:grid-cols-3">
              <p>Session token auth</p>
              <p>Request-ID tracing</p>
              <p>Auditable actions</p>
            </div>

            <Link to="/" className="mt-6 inline-block text-sm font-medium text-brand hover:text-brand/80">
              Back to product overview
            </Link>
          </div>
        </Card>

        <Card className="w-full bg-surface-elev/98 dark:bg-gradient-to-b dark:from-surface-elev/98 dark:to-surface-elev/86">
          <h2 className="text-2xl font-semibold text-slate-100">Account Login</h2>
          <p className="mt-2 text-sm text-slate-300">Use your work credentials to continue.</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => fillDemo(ADMIN_DEMO)}>
              Use Admin Demo
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={() => fillDemo(MEMBER_DEMO)}>
              Use Member Demo
            </Button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Email</label>
              <Input autoComplete="username" spellCheck={false} {...form.register('email')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.email?.message}</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Password</label>
              <Input type="password" autoComplete="current-password" {...form.register('password')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.password?.message}</p>
            </div>
            {requestId ? <p className="text-xs text-slate-500">Request ID: {requestId}</p> : null}
            <Button className="w-full" size="lg" type="submit" loading={form.formState.isSubmitting}>
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
