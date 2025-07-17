import {Suspense} from "react";

import {LoaderCircleIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Input} from "@horionos/ui/input";
import {Label} from "@horionos/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@horionos/ui/select";
import {Separator} from "@horionos/ui/separator";
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
import {Strong, Text} from "@horionos/ui/text";

import {useForm} from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

import {z} from "zod/v4";

import {ContentLayout} from "~/components/content-layout";
import {InvitationRoleBadge} from "~/components/invitation-role-badge";
import {InvitationStatusBadge} from "~/components/invitation-status-badge";
import {useOrgId} from "~/hooks/use-org-id";
import {orpc} from "~/utils/orpc";
import {withValidationErrors} from "~/utils/with-validation-errors";

type InvitationRole = "member" | "admin";

export const Route = createFileRoute("/_protected/$orgId/settings/invitations")(
  {
    component: RouteComponent,
    loader({context, params}) {
      context.queryClient.prefetchQuery(
        orpc.invitation.getAll.queryOptions({
          input: {organizationId: params.orgId},
        }),
      );
      return {};
    },
  },
);

function RouteComponent() {
  return (
    <ContentLayout
      title="Invitations"
      subtitle="Manage your organization invitations"
    >
      <InviteTeammateSection />
      <Separator className="my-8" />
      <InvitationsListSection />
    </ContentLayout>
  );
}

const InviteTeammateSection = () => {
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Invite a teammate</Strong>
        <Text className="max-w-sm">
          Invite a teammate to join your organization
        </Text>
      </div>
      <div className="space-y-4">
        <InviteTeammateForm />
      </div>
    </section>
  );
};

export const InviteTeammateForm = () => {
  const organizationId = useOrgId();
  const {form} = useInviteTeammateForm({organizationId});

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1">
            <form.Field name="email">
              {(field) => (
                <div className="grid gap-3">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error?.message}
                      className="text-destructive text-sm"
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>
          <div className="shrink-0">
            <form.Field name="role">
              {(field) => (
                <div className="grid gap-3">
                  <Label htmlFor={field.name}>Role</Label>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as InvitationRole)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error?.message}
                      className="text-destructive text-sm"
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <form.Subscribe>
          {(state) => (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : null}
                {state.isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

const useInviteTeammateForm = ({organizationId}: {organizationId: string}) => {
  const queryClient = useQueryClient();

  const inviteTeammateMutation = useMutation(
    orpc.invitation.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          orpc.invitation.getAll.queryOptions({input: {organizationId}}),
        );
        toast.success("Invitation sent successfully");
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to invite teammate");
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      email: "",
      role: "member" as InvitationRole,
    },
    validators: {
      onSubmit: z.object({
        email: z.email().trim(),
        role: z.enum(["member", "admin"]),
      }),
      onSubmitAsync: ({value: {email, role}}) => {
        return withValidationErrors(
          inviteTeammateMutation.mutateAsync({
            email,
            organizationId,
            role,
          }),
        );
      },
    },
  });

  return {
    form,
  };
};

const InvitationsListSection = () => {
  const LoadingRow = () => (
    <TableRow>
      <TableCell className="space-y-1 font-medium">
        <Skeleton className="h-[20px] w-[200px]" />
        <Skeleton className="h-[20px] w-[170px]" />
      </TableCell>
    </TableRow>
  );

  return (
    <section className="grid gap-x-8 gap-y-6">
      <div className="space-y-2">
        <Strong>Invitations</Strong>
        <Text className="max-w-sm">
          View and manage your organization invitations
        </Text>
      </div>
      <div className="space-y-4 overflow-scroll">
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
              <InvitationsTableRows />
            </Suspense>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

const InvitationsTableRows = () => {
  const organizationId = useOrgId();

  const {
    data: {invitations},
  } = useSuspenseQuery(
    orpc.invitation.getAll.queryOptions({
      input: {organizationId},
    }),
  );
  return invitations.length > 0 ? (
    invitations.map((invitation) => (
      <TableRow key={invitation.id} disableHover>
        <TableCell className="font-medium">{invitation.email}</TableCell>
        <TableCell>
          <InvitationRoleBadge role={invitation.role} />
        </TableCell>
        <TableCell>
          <InvitationStatusBadge status={invitation.status} />
        </TableCell>
        <TableCell>
          {invitation.inviterName ?? invitation.inviterEmail ?? "Deleted User"}
        </TableCell>
        <TableCell>
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(invitation.createdAt)}
        </TableCell>
        <TableCell>
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(invitation.expiresAt)}
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2">
            <DeleteInvitationButton
              invitationId={invitation.id}
              organizationId={organizationId}
            />
          </div>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} className="text-center">
        <Text className="text-muted-foreground py-12">
          No invitations found
        </Text>
      </TableCell>
    </TableRow>
  );
};

const DeleteInvitationButton = ({
  invitationId,
  organizationId,
}: {
  invitationId: string;
  organizationId: string;
}) => {
  const queryClient = useQueryClient();

  const deleteInvitationMutation = useMutation(
    orpc.invitation.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          orpc.invitation.getAll.queryOptions({
            input: {organizationId},
          }),
        );
        toast.success("Invitation revoked successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to revoke invitation");
      },
    }),
  );

  return (
    <Button
      disabled={deleteInvitationMutation.isPending}
      variant="destructive"
      size="sm"
      onClick={() => {
        const confirmed = window.confirm(
          "Are you sure you want to revoke this invitation? This action cannot be undone.",
        );

        if (confirmed) {
          deleteInvitationMutation.mutate({
            id: invitationId,
            organizationId,
          });
        }
      }}
    >
      {deleteInvitationMutation.isPending ? (
        <LoaderCircleIcon className="animate-spin" />
      ) : null}
      {deleteInvitationMutation.isPending ? "Revoking..." : "Revoke"}
    </Button>
  );
};
