import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
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

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const [requestId, setRequestId] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@aicostguard.dev',
      password: 'password123'
    }
  });

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
    <div className="mx-auto flex min-h-[72vh] max-w-5xl items-center">
      <div className="grid w-full gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-900/80">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-200">
            <ShieldCheck size={12} />
            AI governance command center
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-100">Sign in to AICostGuard</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Track subscriptions, enforce policy controls, and keep an auditable trail of every governance decision.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-300">
            <p>Demo admin: <span className="text-slate-100">admin@aicostguard.dev / password123</span></p>
            <p>Demo member: <span className="text-slate-100">member1@aicostguard.dev / password123</span></p>
          </div>
          <Link to="/" className="mt-6 inline-block text-sm text-emerald-300 hover:text-emerald-200">
            Back to product overview
          </Link>
        </Card>

        <Card className="w-full">
          <h2 className="text-xl font-semibold text-slate-100">Account Login</h2>
          <p className="mt-2 text-sm text-slate-400">Use your work credentials to continue.</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Email</label>
              <Input {...form.register('email')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.email?.message}</p>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Password</label>
              <Input type="password" {...form.register('password')} />
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.password?.message}</p>
            </div>
            {requestId ? <p className="text-xs text-slate-500">Request ID: {requestId}</p> : null}
            <Button className="w-full" type="submit" loading={form.formState.isSubmitting}>
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
