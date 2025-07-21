import {Strong, Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {ContentLayout} from "~/components/content-layout";
import {UpdateNameForm} from "~/features/account/update-user-name-form";
import {orpc} from "~/utils/orpc";

export const Route = createFileRoute("/_protected/account/")({
  component: RouteComponent,
  loader({context}) {
    context.queryClient.prefetchQuery(
      orpc.account.getCurrentUser.queryOptions(),
    );
    return {};
  },
});

function RouteComponent() {
  return (
    <ContentLayout title="Account Settings">
      <UpdateNameSection />
    </ContentLayout>
  );
}

const UpdateNameSection = () => {
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Change your full name</Strong>
        <Text className="max-w-sm">
          Your full name is used to identify you in the app
        </Text>
      </div>

      <UpdateNameForm />
    </section>
  );
};
