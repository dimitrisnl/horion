import {createFileRoute} from "@tanstack/react-router";

import {ContentLayout} from "~/components/app-skeleton/content-layout";

export const Route = createFileRoute("/$orgId/announcements/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentLayout
      title="New Announcement"
      subtitle="Create a new announcement for your organization"
    >
      {" "}
    </ContentLayout>
  );
}
