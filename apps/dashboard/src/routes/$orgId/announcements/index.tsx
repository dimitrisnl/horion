import {MegaphoneIcon} from "@horionos/icons";
import {buttonVariants} from "@horionos/ui/button";
import {Text} from "@horionos/ui/text";

import {createFileRoute, Link} from "@tanstack/react-router";

import {ContentLayout} from "~/components/app-skeleton/content-layout";
import {useOrgId} from "~/hooks/use-org-id";

export const Route = createFileRoute("/$orgId/announcements/")({
  component: RouteComponent,
});

// const Actions = () => {
//   const orgId = useOrgId();

//   return (
//     <Link
//       className={buttonVariants({variant: "default", size: "sm"})}
//       to="/$orgId/announcements/new"
//       params={{orgId: orgId!}}
//     >
//       Create Announcement
//     </Link>
//   );
// };

function RouteComponent() {
  const orgId = useOrgId();

  return (
    <ContentLayout
      title="Announcements"
      subtitle="Preview and manage your organization's announcements"
      // actions={<Actions />}
    >
      <div className="flex w-full flex-col items-center gap-3 rounded border border-dashed p-6 md:p-12">
        <MegaphoneIcon className="mx-auto h-12 w-12 stroke-1" />
        <Text className="mt-2 text-center text-balance">
          You don&apos;t have any announcements yet.{" "}
          <div>Let&apos;s start by creating one!</div>
        </Text>
        <Link
          params={{orgId: orgId!}}
          to="/$orgId/announcements/new"
          className={buttonVariants({variant: "default", size: "sm"})}
        >
          Create Announcement
        </Link>
      </div>
    </ContentLayout>
  );
}
