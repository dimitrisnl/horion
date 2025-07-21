import {Separator} from "@horionos/ui/separator";
import {Strong, Text} from "@horionos/ui/text";

import {createFileRoute} from "@tanstack/react-router";

import {ContentLayout} from "~/components/content-layout";
import {OrganizationMembersTable} from "~/features/organization/organization-members-table";
import {UpdateOrganizationNameForm} from "~/features/organization/update-organization-name-form";

export const Route = createFileRoute("/_protected/$orgId/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentLayout title="Organization Settings">
      <OrganizationNameSection />
      <Separator className="my-12" />
      <OrganizationMembersSection />
    </ContentLayout>
  );
}

const OrganizationNameSection = () => {
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Update your organization name</Strong>
        <Text className="max-w-sm">
          This name will be displayed to all members of your organization.
        </Text>
      </div>
      <UpdateOrganizationNameForm />
    </section>
  );
};

const OrganizationMembersSection = () => {
  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Manage your organization members</Strong>
        <Text className="max-w-sm">
          Here&apos;s all the members of your organization.
        </Text>
      </div>
      <OrganizationMembersTable />
    </section>
  );
};
