import {QueryClientProvider} from "@tanstack/react-query";
import {createRouter as createTanStackRouter} from "@tanstack/react-router";
import {routerWithQueryClient} from "@tanstack/react-router-with-query";

import {DefaultCatchBoundary} from "./components/default-catch-boundary";
import {LoadingSection} from "./components/loader";
import {routeTree} from "./routeTree.gen";
import {orpc, queryClient} from "./utils/orpc";

export function createRouter() {
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
