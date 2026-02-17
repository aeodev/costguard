import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { marketingNav } from '../../shared/constants/nav';
import { Button } from '../../shared/ui/button';
import { ThemeToggle } from '../../shared/ui/theme-toggle';

export const MarketingLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-base text-slate-100">
      <header className="sticky top-0 z-40 bg-surface-base/84 backdrop-blur-xl shadow-soft dark:shadow-panel">
        <div className="hidden dark:block absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent" />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-3 text-sm font-semibold text-slate-100">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-xs font-bold text-white dark:bg-gradient-to-br dark:from-brand dark:to-brand-strong dark:text-slate-950">
              AG
            </span>
            <div>
              <p className="leading-tight">AICostGuard</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Enterprise Governance</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1.5 rounded-xl bg-surface-elev/80 p-1.5 shadow-soft md:flex">
            {marketingNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition ${
                    isActive ? 'bg-surface-soft/70 text-slate-100' : 'text-slate-300 hover:bg-surface-soft/50 hover:text-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavLink to="/auth/login" className="hidden sm:block">
              <Button variant="secondary">Sign in</Button>
            </NavLink>
            <Button variant="ghost" className="md:hidden" onClick={() => setMobileOpen((open) => !open)}>
              {mobileOpen ? 'Close' : 'Menu'}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="mx-4 mb-3 rounded-xl bg-surface-elev/92 p-3 shadow-soft md:hidden">
            <div className="grid gap-2">
              {marketingNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-2.5 py-2 text-sm text-slate-200 hover:bg-surface-soft/70"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink to="/auth/login" className="rounded-md px-2.5 py-2 text-sm text-slate-200 hover:bg-surface-soft/70">
                Sign in
              </NavLink>
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-t from-surface-elev/66 to-transparent px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <p>AICostGuard. See every AI subscription. Control spend. Reduce risk.</p>
          <div className="flex gap-4">
            <NavLink to="/security" className="hover:text-slate-200">
              Security
            </NavLink>
            <NavLink to="/docs" className="hover:text-slate-200">
              Docs
            </NavLink>
            <NavLink to="/contact" className="hover:text-slate-200">
              Contact
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};
