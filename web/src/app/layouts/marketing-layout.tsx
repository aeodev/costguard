import { Menu, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { marketingNav } from '../../shared/constants/nav';
import { Button } from '../../shared/ui/button';
import { ThemeToggle } from '../../shared/ui/theme-toggle';

export const MarketingLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <ShieldCheck size={18} className="text-emerald-400" />
            AICostGuard
          </NavLink>
          <nav className="hidden items-center gap-5 md:flex">
            {marketingNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-emerald-300' : 'text-slate-300 hover:text-slate-100'}`
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
              <Menu size={16} />
            </Button>
          </div>
        </div>
        {mobileOpen ? (
          <div className="border-t border-slate-800 px-4 py-3 md:hidden">
            <div className="grid gap-2">
              {marketingNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-slate-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink to="/auth/login" className="rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-slate-900">
                Sign in
              </NavLink>
            </div>
          </div>
        ) : null}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800/80 px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>AICostGuard. See every AI subscription. Control spend. Reduce risk.</p>
          <div className="flex gap-4">
            <NavLink to="/security" className="hover:text-slate-300">Security</NavLink>
            <NavLink to="/docs" className="hover:text-slate-300">Docs</NavLink>
            <NavLink to="/contact" className="hover:text-slate-300">Contact</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};
