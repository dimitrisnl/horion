import {createFileRoute, redirect} from "@tanstack/react-router";

import {orpc} from "~/utils/orpc";

export const Route = createFileRoute("/")({
  beforeLoad: async ({context}) => {
    const user = context.user;

    if (!user) {
      throw redirect({to: "/login"});
    }

    const {memberships} = await context.queryClient.ensureQueryData(
      orpc.membership.getAll.queryOptions(),
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
