import {createFileRoute, redirect} from "@tanstack/react-router";

import {minutesToMs} from "~/utils/minutes-to-ms";

export const Route = createFileRoute("/")({
  beforeLoad: async ({context}) => {
    if (!context.userId) {
      throw redirect({to: "/login"});
    }

    const {memberships} = await context.queryClient.fetchQuery(
      context.orpc.account.getMemberships.queryOptions({
        staleTime: minutesToMs(5), // Cache memberships for 5 minutes
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
