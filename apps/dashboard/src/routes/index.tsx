import {createFileRoute, redirect} from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({context}) => {
    if (!context.userId) {
      throw redirect({to: "/login"});
    }

    const {memberships} = await context.queryClient.fetchQuery(
      context.orpc.membership.getAll.queryOptions({
        staleTime: 0, // TODO: Set a reasonable stale time
      }),
    );

    if (memberships.length === 0) {
      throw redirect({to: "/onboarding"});
    }

    const firstMembershipId = memberships[0].organizationId;

    throw redirect({
      to: `/$orgId`,
      params: {orgId: firstMembershipId},
    });
  },
});
