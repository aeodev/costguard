import { LogOut, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { appNav } from '../../shared/constants/nav';
import { Button } from '../../shared/ui/button';
import { ThemeToggle } from '../../shared/ui/theme-toggle';
import { useAuth } from '../providers/auth-provider';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 lg:flex-row">
      <aside className="border-b border-slate-800 bg-slate-950/80 p-4 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:self-start lg:overflow-auto lg:border-b-0 lg:border-r">
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck size={18} className="text-emerald-400" />
            AICostGuard
          </div>
          <p className="text-xs text-slate-500">See every AI subscription. Control spend. Reduce risk.</p>
        </div>
        <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {appNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-100'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Organization</p>
              <p className="text-sm font-semibold text-slate-100">Acme Labs</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="hidden rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 md:block">
                {user?.name} ({user?.role})
              </div>
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut size={14} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
