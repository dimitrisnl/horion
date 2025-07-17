import {Suspense} from "react";

import {Badge} from "@horionos/ui/badge";
import {Skeleton} from "@horionos/ui/skeleton";
import {Table, TableBody, TableCell, TableRow} from "@horionos/ui/table";
import {Strong, Text} from "@horionos/ui/text";

import {useSuspenseQuery} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

import {ContentLayout} from "~/components/content-layout";
import {orpc} from "~/utils/orpc";

export const Route = createFileRoute("/_protected/account/security")({
  component: RouteComponent,
  loader({context}) {
    context.queryClient.prefetchQuery(
      context.orpc.account.getSessions.queryOptions(),
    );
    return {};
  },
});

function RouteComponent() {
  return (
    <ContentLayout
      title="Security Settings"
      subtitle="Manage your security settings"
    >
      <SessionsSection />
    </ContentLayout>
  );
}

const SessionsSection = () => {
  const LoadingRow = () => (
    <TableRow>
      <TableCell className="space-y-1 font-medium">
        <Skeleton className="h-[20px] w-[200px]" />
        <Skeleton className="h-[20px] w-[170px]" />
      </TableCell>
    </TableRow>
  );

  return (
    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Strong>Your sessions</Strong>
        <Text className="max-w-sm">
          Here&apos;s everywhere you&apos;ve logged in from
        </Text>
      </div>
      <div className="space-y-4">
        <Table>
          <TableBody>
            <Suspense
              fallback={
                <>
                  <LoadingRow />
                  <LoadingRow />
                </>
              }
            >
              <SessionTableRows />
            </Suspense>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

const SessionTableRows = () => {
  const {
    data: {sessions},
  } = useSuspenseQuery(orpc.account.getSessions.queryOptions());
  const {
    data: {session},
  } = useSuspenseQuery(orpc.account.getSession.queryOptions());

  const activeSessionId = session?.id || "";

  return sessions.map((session) => (
    <TableRow key={session.id}>
      <TableCell className="space-y-0.5">
        <div className="font-medium">
          {session.browser || "Unknown browser"}
          {session.os ? ` on ${session.os}` : ""}
        </div>
        <Text>
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(session.createdAt)}
        </Text>
      </TableCell>
      <TableCell className="text-right">
        {session.id === activeSessionId ? (
          <Badge variant="outline">
            <div className="mr-1 inline-block size-2 rounded-full bg-emerald-500" />
            Active now
          </Badge>
        ) : (
          <> </>
        )}
      </TableCell>
    </TableRow>
  ));
};
