import {CheckIcon, LoaderCircleIcon, UsersRoundIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {toast} from "@horionos/ui/sonner";
import {Heading1, Text} from "@horionos/ui/text";

import {useMutation, useQuery} from "@tanstack/react-query";
import {createFileRoute, redirect, useNavigate} from "@tanstack/react-router";

import {z} from "zod/v4";

import {Loader} from "~/components/loader";
import {orpc} from "~/utils/orpc";

export const Route = createFileRoute("/_guest/accept-invitation")({
  component: RouteComponent,
  validateSearch: z.object({
    token: z.string(),
  }),
  beforeLoad: ({context}) => {
    if (context.userId) {
      throw redirect({to: "/"});
    }
  },
});

function RouteComponent() {
  const {token} = Route.useSearch();
  const navigate = useNavigate();

  const tokenDetailsQuery = useQuery(
    orpc.invitation.check.queryOptions({
      input: {token},
    }),
  );

  const acceptInvitationMutation = useMutation(
    orpc.account.acceptInvitationAsGuest.mutationOptions({
      onSuccess: ({membership}) => {
        toast.success("Successfully accepted invitation");
        navigate({
          to: `/$orgId`,
          params: {orgId: membership.organizationId},
          replace: true,
        });
      },
      onError: (error) => {
        const message = error.message || "An unexpected error occurred";
        toast.error(message);
      },
    }),
  );

  if (tokenDetailsQuery.isPending) {
    return <Loader />;
  }

  if (tokenDetailsQuery.error) {
    return <Text>An error occurred</Text>;
  }

  const {organization, invitation} = tokenDetailsQuery.data;

  return (
    <div>
      <div className="space-y-4">
        <div className="inline-flex items-center rounded-md bg-blue-100/50 p-2">
          <UsersRoundIcon className="size-6 text-blue-600" />
        </div>
        <div className="flex items-center gap-2">
          <Heading1>
            You&apos;ve been invited to join {organization.name}
          </Heading1>
        </div>
        <Text>
          Click the button below to accept the invitation and create your
          account. You&apos;ll join the team as a{" "}
          <span className="font-semibold">{invitation.role}</span>.
        </Text>
        <Button
          variant="default"
          onClick={() =>
            acceptInvitationMutation.mutate({invitationToken: token})
          }
          disabled={acceptInvitationMutation.isPending}
        >
          {acceptInvitationMutation.isPending ? (
            <>
              <LoaderCircleIcon className="animate-spin" />
              Accepting
            </>
          ) : (
            <>
              <CheckIcon />
              Accept and Join
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
