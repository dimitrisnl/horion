import {Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {ContentLayout} from "~/components/content-layout";

export const Route = createFileRoute("/_authed/$orgId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentLayout
      title="Dashboard"
      subtitle="Welcome to your organization's dashboard"
    >
      <div className="space-y-4">
        <Text className="max-w-lg">
          This is the main dashboard for your organization.
        </Text>
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 rounded-xl md:col-span-2" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
