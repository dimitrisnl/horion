import {MegaphoneIcon, PlusCircleIcon} from "@horionos/icons";
import {buttonVariants} from "@horionos/ui/button";
import {Text} from "@horionos/ui/text";

import {createFileRoute, Link} from "@tanstack/react-router";

import {PageLayout} from "~/components/app-skeleton/page-layout";
import {useOrgId} from "~/hooks/use-org-id";

export const Route = createFileRoute("/$orgId/announcements/")({
  component: RouteComponent,
});

const Actions = () => {
  const orgId = useOrgId();

  return (
    <Link
      className={buttonVariants({variant: "default", size: "sm"})}
      to="/$orgId/announcements/new"
      params={{orgId: orgId!}}
    >
      <PlusCircleIcon />
      New Announcement
    </Link>
  );
};

function RouteComponent() {
  const orgId = useOrgId();

  return (
    <PageLayout title="Announcements" actions={<Actions />}>
      <div className="mx-auto w-full max-w-5xl px-6 pt-8">
        <div className="flex w-full flex-col items-center gap-3 rounded border border-dashed p-6 md:p-12">
          <MegaphoneIcon className="mx-auto h-12 w-12 stroke-1 text-zinc-400" />
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
      </div>
    </PageLayout>
  );
}
