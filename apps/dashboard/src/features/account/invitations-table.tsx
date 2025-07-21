import {Suspense, useState} from "react";

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

import {ConfirmDialog} from "~/components/confirm-dialog";
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
  const [decliningInvitationId, setDecliningInvitationId] = useState<
    string | null
  >(null);
  const [acceptingInvitationId, setAcceptingInvitationId] = useState<
    string | null
  >(null);

  const onAcceptInvitation = (invitationId: string) => {
    setAcceptingInvitationId(invitationId);
  };

  const onDeclineInvitation = (invitationId: string) => {
    setDecliningInvitationId(invitationId);
  };

  return (
    <>
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
            <InvitationsTableRows
              onAcceptInvitation={onAcceptInvitation}
              onDeclineInvitation={onDeclineInvitation}
            />
          </Suspense>
        </TableBody>
      </Table>
      <ConfirmAcceptDialog
        invitationId={acceptingInvitationId}
        isOpen={Boolean(acceptingInvitationId)}
        setIsOpen={(open) => {
          if (!open) {
            setAcceptingInvitationId(null);
          }
        }}
      />
      <ConfirmDeclineDialog
        invitationId={decliningInvitationId}
        isOpen={Boolean(decliningInvitationId)}
        setIsOpen={(open) => {
          if (!open) {
            setDecliningInvitationId(null);
          }
        }}
      />
    </>
  );
};

const InvitationsTableRows = ({
  onAcceptInvitation,
  onDeclineInvitation,
}: {
  onAcceptInvitation: (id: string) => void;
  onDeclineInvitation: (id: string) => void;
}) => {
  const {
    data: {invitations},
  } = useSuspenseQuery(orpc.account.getInvitations.queryOptions());

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
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-44" align="center">
                <DropdownMenuItem
                  onClick={() => onAcceptInvitation(invitation.id)}
                >
                  Accept Invitation
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDeclineInvitation(invitation.id)}
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

const ConfirmAcceptDialog = ({
  isOpen,
  invitationId,
  setIsOpen,
}: {
  isOpen: boolean;
  invitationId: string | null;
  setIsOpen: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const acceptInvitationMutation = useMutation(
    orpc.account.acceptInvitationAsUser.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          orpc.account.getInvitations.queryOptions(),
        );
        await queryClient.invalidateQueries(
          orpc.account.getMemberships.queryOptions(),
        );
      },
    }),
  );

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
        }
      }}
      trigger={<></>}
      title="Accept Invitation"
      description="Are you sure you want to accept this invitation? You will become a member of the organization."
      onClose={() => setIsOpen(false)}
      onConfirm={() => {
        if (invitationId) {
          acceptInvitationMutation.mutateAsync({invitationId});
        }
      }}
      isPending={acceptInvitationMutation.isPending}
    />
  );
};

const ConfirmDeclineDialog = ({
  isOpen,
  invitationId,
  setIsOpen,
}: {
  isOpen: boolean;
  invitationId: string | null;
  setIsOpen: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const declineInvitationMutation = useMutation(
    orpc.account.declineInvitation.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          orpc.account.getInvitations.queryOptions(),
        );
        setIsOpen(false);
      },
    }),
  );

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
        }
      }}
      trigger={<></>}
      title="Decline Invitation"
      description="Are you sure you want to decline this invitation? This action cannot be undone."
      onClose={() => setIsOpen(false)}
      onConfirm={() => {
        if (invitationId) {
          declineInvitationMutation.mutateAsync({invitationId});
        }
      }}
      isPending={declineInvitationMutation.isPending}
    />
  );
};
