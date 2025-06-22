import {Heading2, Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {PageLayout} from "~/components/layout/page-layout";

export const Route = createFileRoute("/$orgId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout title="Dashboard">
      <div className="mx-auto w-full max-w-5xl px-6 pt-8">
        <div className="space-y-2">
          <Heading2>Dashboard</Heading2>
          <Text className="max-w-sm">
            This is the dashboard for your organization . Here you can manage
            tasks, view announcements, and access settings.
          </Text>
        </div>
      </div>
    </PageLayout>
  );
}
