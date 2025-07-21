import {Suspense} from "react";

import {EllipsisIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";
import {Skeleton} from "@horionos/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@horionos/ui/table";
import {Text} from "@horionos/ui/text";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {MembershipRoleBadge} from "~/components/membership-role-badge";
import {formatDateTime} from "~/utils/date-helpers";
import {orpc} from "~/utils/orpc";

const LoadingRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-[20px] w-[120px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-[20px] w-[70px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-[20px] w-[70px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-[20px] w-[70px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-[20px] w-[30px]" />
    </TableCell>
  </TableRow>
);

export const InvitationsTable = () => {
  return (
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
        <Suspense
          fallback={
            <>
              <LoadingRow />
              <LoadingRow />
            </>
          }
        >
          <InvitationsTableRows />
        </Suspense>
      </TableBody>
    </Table>
  );
};

const InvitationsTableRows = () => {
  const queryClient = useQueryClient();
  const {data} = useSuspenseQuery(orpc.account.getInvitations.queryOptions());

  const declineInvitationMutation = useMutation(
    orpc.account.declineInvitation.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          orpc.account.getInvitations.queryOptions(),
        );
      },
    }),
  );

  const {invitations} = data;

  if (!invitations || invitations.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center">
          <Text className="text-muted-foreground py-12">
            No invitations found
          </Text>
        </TableCell>
      </TableRow>
    );
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to decline this invitation? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    declineInvitationMutation.mutateAsync({invitationId});
  };

  return invitations.map((invitation) => {
    const isExpired = new Date(invitation.expiresAt) < new Date();
    const isPending = invitation.status === "pending" && !isExpired;

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
          {!isPending ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost">
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-44" align="center">
                <DropdownMenuItem>Accept Invitation</DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDeclineInvitation(invitation.id)}
                >
                  Decline Invitation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      </TableRow>
    );
  });
};
