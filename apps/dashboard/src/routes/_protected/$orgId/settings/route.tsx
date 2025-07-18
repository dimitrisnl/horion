import {createFileRoute, Outlet, redirect} from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/$orgId/settings")({
  component: RouteComponent,
  beforeLoad: async ({context, params}) => {
    const role = context.membership.role;

    if (role !== "owner" && role !== "admin") {
      throw redirect({to: `/$orgId`, params: {orgId: params.orgId}});
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
