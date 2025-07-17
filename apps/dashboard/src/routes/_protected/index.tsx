import {ArrowRightIcon} from "@horionos/icons";
import {buttonVariants} from "@horionos/ui/button";
import {Card, CardFooter, CardHeader, CardTitle} from "@horionos/ui/card";
import {Separator} from "@horionos/ui/separator";

import {useSuspenseQuery} from "@tanstack/react-query";
import {createFileRoute, Link, redirect} from "@tanstack/react-router";

import {MutedFocusedLayout} from "~/components/focused-layout";
import {MembershipRoleBadge} from "~/components/membership-role-badge";
import {minutesToMs} from "~/utils/minutes-to-ms";
import {orpc} from "~/utils/orpc";

export const Route = createFileRoute("/_protected/")({
  beforeLoad: async ({context}) => {
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

function RouteComponent() {
  const {
    data: {memberships},
  } = useSuspenseQuery(orpc.account.getMemberships.queryOptions());

  return (
    <MutedFocusedLayout>
      <div className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-2 gap-4">
        {memberships.map((membership) => {
          return (
            <Card key={membership.organizationId} className="w-full gap-0 pb-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between space-x-1">
                  {membership.organizationName}
                  <MembershipRoleBadge role={membership.role} />
                </CardTitle>
              </CardHeader>
              <CardFooter className="mt-3 border-t py-3!">
                <Link
                  to="/$orgId"
                  params={{orgId: membership.organizationId}}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                  })}
                >
                  Go to Organization
                  <ArrowRightIcon />
                </Link>
              </CardFooter>
            </Card>
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
