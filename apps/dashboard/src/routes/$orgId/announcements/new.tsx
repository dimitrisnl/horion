import {Heading2, Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {PageLayout} from "~/components/layout/page-layout";

export const Route = createFileRoute("/$orgId/announcements/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout title="New Announcement">
      <div className="mx-auto w-full max-w-5xl px-6 pt-8">
        <Heading2 className="mb-4">New Announcement</Heading2>
        <Text className="max-w-lg">
          This page is under construction. Please check back later for the
          ability to create new announcements.
        </Text>
      </div>
    </PageLayout>
  );
}
