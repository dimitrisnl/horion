import "~/styles/app.css";
import "~/styles/inter.css";

import {Toaster} from "@horion/ui/sonner";

import type {QueryClient} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";

import {NotFound} from "~/components/404";
import {ThemeProvider} from "~/components/theme-provider";
import {orpc} from "~/utils/orpc";
import {basicMeta, favicons, seo} from "~/utils/seo";

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  async beforeLoad({context}) {
    const {user} = await context.queryClient.ensureQueryData(
      orpc.auth.getSession.queryOptions(),
    );

    return {user};
  },
  head: () => ({
    meta: [
      ...basicMeta,
      ...seo({title: "Horionos", description: "The best app ever!"}),
    ],
    links: [...favicons],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider defaultTheme="light" storageKey="horion-ui-theme">
        <div className="grid h-svh grid-rows-[auto_1fr]">
          <Outlet />
        </div>
        <Toaster richColors position="top-right" closeButton />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  );
}
