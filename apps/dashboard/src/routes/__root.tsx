import {Toaster} from "@horionos/ui/sonner";

import type {QueryClient} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";

import {NotFound} from "~/components/not-found";
import {ThemeProvider} from "~/components/theme/theme-provider";
import {getThemeServerFn} from "~/utils/theme";
import appCss from "~/styles/app.css?url";
import interCss from "~/styles/inter.css?url";
import type {orpc} from "~/utils/orpc";
import {basicMeta, favicons, seo} from "~/utils/seo";

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  beforeLoad: async ({context}) => {
    const {session} = await context.queryClient.fetchQuery(
      context.orpc.account.getSession.queryOptions(),
    );
    const userId = session?.userId || null;

    return {userId};
  },
  loader: () => getThemeServerFn(),
  head: () => ({
    meta: [
      ...basicMeta,
      ...seo({title: "Horionos", description: "The dashboard for Horionos"}),
    ],
    links: [
      {rel: "stylesheet", href: interCss},
      {rel: "stylesheet", href: appCss},
      ...favicons,
    ],
  }),
});

function RootComponent() {
  const data = Route.useLoaderData();

  return (
    <ThemeProvider theme={data}>
      <RootDocument>
        <div className="grid h-svh grid-rows-[auto_1fr]">
          <Outlet />
        </div>
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({children}: Readonly<{children: React.ReactNode}>) {
  const theme = Route.useLoaderData();

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Toaster richColors position="top-right" closeButton />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
