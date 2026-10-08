import type { JSX } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { userQueryOptions } from '@app/users';
import { RootLayout } from './layout/RootLayout';
import { NewUserPage } from './routes/NewUserPage';
import { NotFoundPage } from './routes/NotFoundPage';
import { TodosPage } from './routes/TodosPage';
import { UserPage } from './routes/UserPage';

type RouterContext = { queryClient: QueryClient };

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/users/new' });
  },
});

const newUserRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users/new',
  component: NewUserPage,
});

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users/$userId',
  // Prefetch into the Query cache. Errors are left for the page to show.
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(userQueryOptions(params.userId)).catch(() => undefined),
  component: function UserRouteComponent(): JSX.Element {
    const { userId } = userRoute.useParams();
    return <UserPage userId={userId} />;
  },
});

const todosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todos',
  component: TodosPage,
});

const routeTree = rootRoute.addChildren([indexRoute, newUserRoute, userRoute, todosRoute]);

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    // Query owns caching, so the router should not keep its own copy.
    defaultPreloadStaleTime: 0,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
