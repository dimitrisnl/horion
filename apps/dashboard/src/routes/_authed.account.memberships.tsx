import {ArrowRightIcon} from "@horionos/icons";
import {Button, buttonVariants} from "@horionos/ui/button";
import {Separator} from "@horionos/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@horionos/ui/table";
import {Strong, Text} from "@horionos/ui/text";

import {useSuspenseQuery} from "@tanstack/react-query";
import {createFileRoute, Link} from "@tanstack/react-router";

import {ContentLayout} from "~/components/content-layout";
import {InvitationStatusBadge} from "~/components/invitation-status-badge";
import {MembershipRoleBadge} from "~/components/membership-role-badge";
import {orpc} from "~/utils/orpc";

export const Route = createFileRoute("/_authed/account/memberships")({
  component: RouteComponent,
  loader({context}) {
    context.queryClient.prefetchQuery(
      context.orpc.account.getMemberships.queryOptions(),
    );
    context.queryClient.prefetchQuery(
      context.orpc.account.getInvitations.queryOptions(),
    );
    return {};
  },
});

function RouteComponent() {
  return (
    <ContentLayout
      title="Memberships"
      subtitle="All your memberships and pending invitations"
    >
      <InvitationsSection />
    </ContentLayout>
  );
}

const InvitationsSection = () => {
  const {
    data: {memberships},
  } = useSuspenseQuery(orpc.account.getMemberships.queryOptions());

  const {
    data: {invitations},
  } = useSuspenseQuery(orpc.account.getInvitations.queryOptions());

  return (
    <div>
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Strong>Organizations</Strong>
          <Text className="max-w-sm">
            Here&apos;s all the organizations you&apos;re a member of, along
            with your role in each organization.
          </Text>
        </div>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow disableHover>
                <TableHead>Organization</TableHead>
                <TableHead>Role</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.length > 0 ? (
                memberships.map((membership) => (
                  <TableRow key={membership.organizationId} disableHover>
                    <TableCell>
                      <div className="text-base font-semibold">
                        {membership.organizationName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <MembershipRoleBadge role={membership.role} />
                    </TableCell>
                    <TableCell>
                      <Link
                        to="/$orgId"
                        params={{orgId: membership.organizationId}}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Go to organization
                        <ArrowRightIcon />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <Text>No memberships found.</Text>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
      <Separator className="my-12" />

      <section className="grid items-center gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Strong>Invitations</Strong>
          <Text className="max-w-sm">
            Here&apos;s all the invitations you&apos;ve received to join
            organizations
          </Text>
        </div>
        <div className="space-y-4">
          {invitations.length === 0 ? (
            <Text className="text-center">No invitations found.</Text>
          ) : (
            <Table>
              <TableHeader>
                <TableRow disableHover>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id} disableHover>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>
                      <MembershipRoleBadge role={invitation.role} />
                    </TableCell>
                    <TableCell>
                      <InvitationStatusBadge status={invitation.status} />
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Accept
                        </Button>
                        <Button variant="destructive" size="sm">
                          Decline
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
};
