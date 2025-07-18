import {ArrowRightIcon, EllipsisIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";
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

import {useQuery, useSuspenseQuery} from "@tanstack/react-query";
import {createFileRoute, Link} from "@tanstack/react-router";

import {ContentLayout} from "~/components/content-layout";
import {MembershipRoleBadge} from "~/components/membership-role-badge";
import {formatDateTime} from "~/utils/date-helpers";
import {orpc} from "~/utils/orpc";

export const Route = createFileRoute("/_protected/account/memberships")({
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
    <ContentLayout title="Memberships">
      <MembershipsSection />
      <InvitationsSection />
    </ContentLayout>
  );
}

const MembershipsSection = () => {
  const {
    data: {memberships},
  } = useSuspenseQuery(orpc.account.getMemberships.queryOptions());

  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Organizations</Strong>
        <Text className="max-w-sm">
          Here&apos;s all the organizations you&apos;re a member of, along with
          your role in each organization.
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
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm">
                          <EllipsisIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center">
                        <DropdownMenuItem>
                          <Link
                            to="/$orgId"
                            params={{orgId: membership.organizationId}}
                          >
                            Go to organization
                          </Link>
                          <ArrowRightIcon />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
  );
};

const InvitationsSection = () => {
  const {data, isPending, error} = useQuery(
    orpc.account.getInvitations.queryOptions(),
  );

  if (isPending) {
    return null;
  }

  if (error) {
    return null;
  }

  const {invitations} = data;

  if (invitations.length === 0) {
    return null;
  }

  return (
    <>
      <Separator className="my-12" />

      <div>
        <section className="grid items-center gap-x-8 gap-y-6">
          <div className="space-y-2">
            <Strong>Invitations</Strong>
            <Text>
              Here&apos;s all the invitations you&apos;ve received to join
              organizations
            </Text>
          </div>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow disableHover>
                  <TableHead>Organization</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invited by</TableHead>
                  <TableHead>Expires at</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => {
                  const isExpired = new Date(invitation.expiresAt) < new Date();
                  return (
                    <TableRow
                      key={invitation.id}
                      disableHover
                      className={isExpired ? "h-14 opacity-50" : "h-14"}
                    >
                      <TableCell>{invitation.organizationName}</TableCell>
                      <TableCell>
                        <MembershipRoleBadge role={invitation.role} />
                      </TableCell>
                      <TableCell>{invitation.inviterEmail}</TableCell>
                      <TableCell>
                        {isExpired ? (
                          <span>Expired</span>
                        ) : (
                          formatDateTime(invitation.expiresAt, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        )}
                      </TableCell>
                      <TableCell>
                        {isExpired ? null : (
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost">
                                <EllipsisIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="min-w-44"
                              align="center"
                            >
                              <DropdownMenuItem>
                                Accept Invitation
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive">
                                Decline Invitation
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </>
  );
};
