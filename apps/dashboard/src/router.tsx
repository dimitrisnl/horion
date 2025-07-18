import {QueryClient} from "@tanstack/react-query";
import {createRouter as createTanStackRouter} from "@tanstack/react-router";
import {routerWithQueryClient} from "@tanstack/react-router-with-query";

import {DefaultCatchBoundary} from "./components/default-catch-boundary";
import {Loader} from "./components/loader";
import {routeTree} from "./routeTree.gen";
import {minutesToMs} from "./utils/minutes-to-ms";
import {orpc} from "./utils/orpc";

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        staleTime: minutesToMs(2),
        retry: false,
      },
    },
  });

  const router = createTanStackRouter({
    routeTree,
    context: {orpc, queryClient},
    defaultPreload: "intent",
    defaultPendingComponent: Loader,
    defaultErrorComponent: DefaultCatchBoundary,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return routerWithQueryClient(router, queryClient);
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
