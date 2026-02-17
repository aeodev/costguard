import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AnalyticsPage } from '../../features/analytics/AnalyticsPage';
import { AuditPage } from '../../features/audit/AuditPage';
import { LoginPage } from '../../features/auth/LoginPage';
import { LogoutPage } from '../../features/auth/LogoutPage';
import { IntegrationsPage } from '../../features/integrations/IntegrationsPage';
import { DashboardPage } from '../../features/org/DashboardPage';
import { PoliciesPage } from '../../features/policies/PoliciesPage';
import { RiskPage } from '../../features/risk/RiskPage';
import { SettingsPage } from '../../features/settings/SettingsPage';
import { SubscriptionsPage } from '../../features/subscriptions/SubscriptionsPage';
import { TeamPage } from '../../features/team/TeamPage';
import { BlogListPage } from '../../pages/BlogListPage';
import { BlogPostPage } from '../../pages/BlogPostPage';
import { ContactPage } from '../../pages/ContactPage';
import { DocsPage } from '../../pages/DocsPage';
import { LandingPage } from '../../pages/LandingPage';
import { PricingPage } from '../../pages/PricingPage';
import { SecurityPage } from '../../pages/SecurityPage';
import { ErrorBoundary } from '../ErrorBoundary';
import { AppLayout } from '../layouts/app-layout';
import { MarketingLayout } from '../layouts/marketing-layout';
import { useAuth } from '../providers/auth-provider';

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
};

const RedirectIfAuthed = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return <Outlet />;
};

const AppRouteBoundary = () => (
  <ErrorBoundary>
    <Outlet />
  </ErrorBoundary>
);

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/security', element: <SecurityPage /> },
      { path: '/docs', element: <DocsPage /> },
      { path: '/blog', element: <BlogListPage /> },
      { path: '/blog/:slug', element: <BlogPostPage /> },
      { path: '/contact', element: <ContactPage /> }
    ]
  },
  {
    element: <RedirectIfAuthed />,
    children: [{ path: '/auth/login', element: <LoginPage /> }]
  },
  {
    path: '/auth/logout',
    element: <LogoutPage />
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <AppRouteBoundary />,
        children: [
          {
            path: '/app',
            element: <AppLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'subscriptions', element: <SubscriptionsPage /> },
              { path: 'analytics', element: <AnalyticsPage /> },
              { path: 'policies', element: <PoliciesPage /> },
              { path: 'risk', element: <RiskPage /> },
              { path: 'integrations', element: <IntegrationsPage /> },
              { path: 'audit', element: <AuditPage /> },
              { path: 'team', element: <TeamPage /> },
              { path: 'settings', element: <SettingsPage /> }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
