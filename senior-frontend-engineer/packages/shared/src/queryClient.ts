import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './errors';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // A 404 or conflict will not fix itself, so only retry unexpected failures.
        retry: (failureCount, error) => !(error instanceof ApiError) && failureCount < 2,
      },
      mutations: { retry: false },
    },
  });
}
