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
    <div className="flex min-h-screen flex-col bg-surface-base text-slate-100 lg:flex-row">
      <aside className="relative bg-surface-elev/72 p-4 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:self-start lg:overflow-auto dark:bg-gradient-to-b dark:from-surface-elev/78 dark:via-surface-elev/58 dark:to-surface-base/80">
        <div className="pointer-events-none absolute -left-8 top-0 hidden h-40 w-40 rounded-full bg-brand/16 blur-3xl dark:block" />

        <div className="relative mb-6 rounded-xl bg-surface-soft/24 p-4 shadow-soft">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-xs font-bold text-white dark:bg-gradient-to-br dark:from-brand dark:to-brand-strong dark:text-slate-950">
              AG
            </span>
            AICostGuard
          </div>
          <p className="text-xs leading-5 text-slate-400">Unified AI subscription governance for finance, security, and engineering.</p>
        </div>

        <nav className="relative grid grid-cols-2 gap-2 lg:grid-cols-1">
          {appNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? 'bg-brand/14 text-brand shadow-soft' : 'text-slate-300 hover:bg-surface-soft/45 hover:text-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 bg-surface-base/86 px-4 py-3 backdrop-blur-xl shadow-soft">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Organization</p>
              <p className="text-sm font-semibold text-slate-100">Acme Labs</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="hidden rounded-lg bg-surface-elev/88 px-3 py-2 text-xs text-slate-300 shadow-soft md:block">
                {user?.name} ({user?.role})
              </div>
              <Button variant="secondary" onClick={handleLogout}>
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
