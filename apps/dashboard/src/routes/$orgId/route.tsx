import {SidebarInset, SidebarProvider} from "@horionos/ui/sidebar";

import {createFileRoute, Outlet, redirect} from "@tanstack/react-router";

import {AppSidebar} from "~/components/app-skeleton/app-sidebar";

export const Route = createFileRoute("/$orgId")({
  component: RouteComponent,
  notFoundComponent: () => (
    <div className="flex min-h-svh items-center justify-center p-6 text-sm">
      Page not found
    </div>
  ),
  beforeLoad: async ({context, params}) => {
    const {orgId} = params;

    return context.queryClient
      .ensureQueryData(
        context.orpc.organization.get.queryOptions({
          input: {organizationId: orgId},
        }),
      )
      .catch(() => {
        throw redirect({to: "/"});
      });
  },
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
