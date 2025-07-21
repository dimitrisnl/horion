import {Separator} from "@horionos/ui/separator";
import {Strong, Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {ContentLayout} from "~/components/content-layout";
import {InvitationsTable} from "~/features/account/invitations-table";
import {MembershipsTable} from "~/features/account/memberships-table";

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
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Organizations</Strong>
        <Text className="max-w-sm">
          Here&apos;s all the organizations you&apos;re a member of, along with
          your role in each organization.
        </Text>
      </div>
      <MembershipsTable />
    </section>
  );
};

const InvitationsSection = () => {
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
          <InvitationsTable />
        </section>
      </div>
    </>
  );
};
