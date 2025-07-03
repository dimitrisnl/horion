import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createRouter as createTanStackRouter} from "@tanstack/react-router";
import {routerWithQueryClient} from "@tanstack/react-router-with-query";

import {DefaultCatchBoundary} from "./components/default-catch-boundary";
import {LoadingSection} from "./components/loader";
import {routeTree} from "./routeTree.gen";
import {minutes} from "./utils/minutes";
import {orpc} from "./utils/orpc";

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        staleTime: minutes(2),
      },
    },
  });

  const router = createTanStackRouter({
    routeTree,
    context: {orpc, queryClient},
    defaultPreload: "intent",
    defaultPendingComponent: LoadingSection,
    defaultErrorComponent: DefaultCatchBoundary,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    Wrap: ({children}: {children: React.ReactNode}) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  return routerWithQueryClient(router, queryClient);
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
