import {Button} from "@horionos/ui/button";

import {createFileRoute} from "@tanstack/react-router";

import {ContentLayout} from "~/components/app-skeleton/content-layout";

export const Route = createFileRoute("/$orgId/categories/")({
  component: RouteComponent,
});

const Actions = () => <Button size="sm">Create Category</Button>;

function RouteComponent() {
  return (
    <ContentLayout
      title="Categories"
      subtitle="Manage your organization's categories"
      actions={<Actions />}
    >
      {" "}
    </ContentLayout>
  );
}
