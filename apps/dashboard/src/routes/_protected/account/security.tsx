import {Strong, Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {ContentLayout} from "~/components/content-layout";
import {SessionsTable} from "~/features/account/sessions-table";

export const Route = createFileRoute("/_protected/account/security")({
  component: RouteComponent,
  loader({context}) {
    context.queryClient.prefetchQuery(
      context.orpc.account.getSessions.queryOptions(),
    );
    return {};
  },
});

function RouteComponent() {
  return (
    <ContentLayout title="Security Settings">
      <SessionsSection />
    </ContentLayout>
  );
}

const SessionsSection = () => {
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Your sessions</Strong>
        <Text className="max-w-sm">
          Here&apos;s everywhere you&apos;ve logged in from
        </Text>
      </div>
      <SessionsTable />
    </section>
  );
};
