import {TagIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Text} from "@horionos/ui/text";

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
      <div className="flex w-full flex-col items-center gap-3 rounded border border-dashed p-6 md:p-12">
        <div className="bg-accent text-accent-foreground rounded-full p-3">
          <TagIcon className="mx-auto size-8 stroke-1" />
        </div>
        <Text className="mt-2 text-center text-balance">
          You don&apos;t have any announcements yet.{" "}
        </Text>
      </div>
    </ContentLayout>
  );
}
