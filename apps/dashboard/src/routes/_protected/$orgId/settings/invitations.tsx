import {Separator} from "@horionos/ui/separator";
import {Strong, Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {ContentLayout} from "~/components/content-layout";
import {InviteTeammateForm} from "~/features/organization/invite-teammate-form";
import {OrganizationInvitationsTable} from "~/features/organization/organization-invitations-table";
import {orpc} from "~/utils/orpc";

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
    <ContentLayout title="Invitations">
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

const InvitationsListSection = () => {
  return (
    <section className="grid gap-x-8 gap-y-6">
      <div className="space-y-2">
        <Strong>Invitations</Strong>
        <Text className="max-w-sm">
          View and manage your organization invitations
        </Text>
      </div>
      <div className="space-y-4 overflow-scroll">
        <OrganizationInvitationsTable />
      </div>
    </section>
  );
};
