import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30000,
            refetchOnWindowFocus: false
          }
        }
      }),
    []
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
