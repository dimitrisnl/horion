import {createFileRoute, Outlet, redirect} from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({context}) => {
    if (!context.userId) {
      throw redirect({to: "/login"});
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
