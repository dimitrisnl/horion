import {ArrowRightIcon} from "@horionos/icons";
import {Badge} from "@horionos/ui/badge";
import {buttonVariants} from "@horionos/ui/button";
import {Separator} from "@horionos/ui/separator";
import {Strong} from "@horionos/ui/text";

import {useSuspenseQuery} from "@tanstack/react-query";
import {createFileRoute, Link, redirect} from "@tanstack/react-router";

import {MutedFocusedLayout} from "~/components/focused-layout";
import {minutesToMs} from "~/utils/minutes-to-ms";
import {orpc} from "~/utils/orpc";

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
  },
  component: RouteComponent,
});

type MembershipRole = "owner" | "admin" | "member";

const MembershipRoleBadge = ({role}: {role: MembershipRole}) => {
  if (role === "owner") {
    return <Badge variant="tertiary">Owner</Badge>;
  }
  if (role === "admin") {
    return <Badge variant="secondary">Admin</Badge>;
  }
  if (role === "member") {
    return <Badge variant="outline">Member</Badge>;
  }
  return null;
};

function RouteComponent() {
  const {
    data: {memberships},
  } = useSuspenseQuery(orpc.account.getMemberships.queryOptions());

  return (
    <MutedFocusedLayout>
      <div className="grid grid-cols-2 gap-4">
        {memberships.map((membership) => {
          return (
            <div
              key={membership.organizationId}
              className="bg-card flex min-w-xs items-center justify-between rounded-lg px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <Strong>{membership.organizationName}</Strong>
                <MembershipRoleBadge role={membership.role} />
              </div>
              <Link
                to="/$orgId"
                params={{orgId: membership.organizationId}}
                className={buttonVariants({variant: "outline", size: "icon"})}
              >
                <ArrowRightIcon />
              </Link>
            </div>
          );
        })}
      </div>
      <Separator className="mx-auto my-4 max-w-sm" />
      <Link to="/onboarding" className={buttonVariants({variant: "outline"})}>
        Create Organization
      </Link>
    </MutedFocusedLayout>
  );
}
