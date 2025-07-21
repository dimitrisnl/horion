import {Suspense, useState} from "react";

import {EllipsisIcon, XIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {cn} from "@horionos/ui/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";
import {Skeleton} from "@horionos/ui/skeleton";
import {toast} from "@horionos/ui/sonner";
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
import {InvitationRoleBadge} from "~/components/invitation-role-badge";
import {InvitationStatusBadge} from "~/components/invitation-status-badge";
import {useOrgId} from "~/hooks/use-org-id";
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

export const OrganizationInvitationsTable = () => {
  const [deletingInvitationId, setDeletingInvitationId] = useState<
    string | null
  >(null);

  const onDeleteInvitation = (invitationId: string) => {
    setDeletingInvitationId(invitationId);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow disableHover>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invited by</TableHead>
            <TableHead>Sent at</TableHead>
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
            <InvitationsTableRows onDeleteInvitation={onDeleteInvitation} />
          </Suspense>
        </TableBody>
      </Table>
      <ConfirmDeleteDialog
        invitationId={deletingInvitationId}
        isOpen={Boolean(deletingInvitationId)}
        setIsOpen={(open) => {
          if (!open) {
            setDeletingInvitationId(null);
          }
        }}
      />
    </>
  );
};

const InvitationsTableRows = ({
  onDeleteInvitation,
}: {
  onDeleteInvitation: (id: string) => void;
}) => {
  const organizationId = useOrgId();

  const {
    data: {invitations},
  } = useSuspenseQuery(
    orpc.invitation.getAll.queryOptions({
      input: {organizationId},
    }),
  );

  if (!invitations || invitations.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center">
          <Text className="text-muted-foreground py-12">
            No invitations found
          </Text>
        </TableCell>
      </TableRow>
    );
  }

  return invitations.map((invitation) => {
    const isExpired = new Date(invitation.expiresAt) < new Date();
    const isDeclined = invitation.status === "declined";

    return (
      <TableRow
        key={invitation.id}
        disableHover
        className={cn("h-14", {"opacity-30": isExpired})}
      >
        <TableCell className="font-medium">{invitation.email}</TableCell>
        <TableCell>
          <InvitationRoleBadge role={invitation.role} />
        </TableCell>
        <TableCell>
          <InvitationStatusBadge
            status={isExpired ? "expired" : invitation.status}
          />
        </TableCell>
        <TableCell>
          {invitation.inviterName || invitation.inviterEmail || "Deleted User"}
        </TableCell>
        <TableCell>
          {formatDateTime(invitation.createdAt, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </TableCell>
        <TableCell>
          {isExpired || isDeclined
            ? null
            : formatDateTime(invitation.expiresAt, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
        </TableCell>

        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-44" align="center">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  onDeleteInvitation(invitation.id);
                }}
              >
                <XIcon />
                Delete Invitation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  });
};

const ConfirmDeleteDialog = ({
  isOpen,
  setIsOpen,
  invitationId,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  invitationId: string | null;
}) => {
  const queryClient = useQueryClient();
  const organizationId = useOrgId();

  const deleteInvitationMutation = useMutation(
    orpc.invitation.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          orpc.invitation.getAll.queryOptions({
            input: {organizationId},
          }),
        );
        toast.success("Invitation deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete invitation");
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
      title="Delete Invitation"
      description="Are you sure you want to delete this invitation? This action cannot be undone."
      onClose={() => setIsOpen(false)}
      onConfirm={() => {
        if (invitationId) {
          deleteInvitationMutation.mutate({
            id: invitationId,
            organizationId,
          });
        }
      }}
      isPending={deleteInvitationMutation.isPending}
    />
  );
};
