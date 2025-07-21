import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@horionos/ui/card";
import {Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {MutedFocusedLayout} from "~/components/focused-layout";
import {CreateOrganizationForm} from "~/features/organization/create-organization-form";

export const Route = createFileRoute("/_protected/create-organization")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MutedFocusedLayout>
      <div className="flex w-full max-w-lg flex-col gap-6 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Let&apos;s create your Organization</CardTitle>
            <CardDescription>
              <Text>To get started, please enter your organization name.</Text>
              <Text>Don&apos;t worry, you can change it later.</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateOrganizationForm />
          </CardContent>
        </Card>
      </div>
    </MutedFocusedLayout>
  );
}
