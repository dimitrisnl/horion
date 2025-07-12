import {CheckIcon, UsersRoundIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Heading1, Text} from "@horionos/ui/text";

import {useQuery} from "@tanstack/react-query";
import {createFileRoute, redirect} from "@tanstack/react-router";

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

  const tokenDetailsQuery = useQuery(
    orpc.invitation.check.queryOptions({
      input: {token},
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
        <Button variant="default">
          <CheckIcon />
          Accept and Join
        </Button>
      </div>
    </div>
  );
}
