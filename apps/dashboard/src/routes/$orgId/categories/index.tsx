import {PlusCircleIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {Heading2, Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {PageLayout} from "~/components/app-skeleton/page-layout";

export const Route = createFileRoute("/$orgId/categories/")({
  component: RouteComponent,
});

const Actions = () => (
  <Button size="sm">
    <PlusCircleIcon />
    New Category
  </Button>
);

function RouteComponent() {
  return (
    <PageLayout title="Categories" actions={<Actions />}>
      <div className="mx-auto w-full max-w-5xl px-6 pt-8">
        <Heading2 className="mb-4">Categories</Heading2>
        <Text className="max-w-lg">
          Categories are used to organize your resources and make them easier to
          find. You can create, edit, and delete categories as needed.
        </Text>
      </div>
    </PageLayout>
  );
}
