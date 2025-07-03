import {createFileRoute, Outlet, redirect} from "@tanstack/react-router";

import {SiteHeader} from "~/components/app-skeleton/site-header";
import {NotFound} from "~/components/not-found";

export const Route = createFileRoute("/$orgId")({
  component: RouteComponent,
  notFoundComponent: () => <NotFound />,
  beforeLoad: async ({context, params}) => {
    const {orgId} = params;

    return context.queryClient
      .ensureQueryData(
        context.orpc.organization.get.queryOptions({
          input: {id: orgId},
        }),
      )
      .catch(() => {
        throw redirect({to: "/"});
      });
  },
});

function RouteComponent() {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
}
