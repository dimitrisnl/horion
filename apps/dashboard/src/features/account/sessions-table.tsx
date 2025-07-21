import {Suspense} from "react";

import {Badge} from "@horionos/ui/badge";
import {Skeleton} from "@horionos/ui/skeleton";
import {Table, TableBody, TableCell, TableRow} from "@horionos/ui/table";
import {Text} from "@horionos/ui/text";

import {useSuspenseQuery} from "@tanstack/react-query";

import {orpc} from "~/utils/orpc";

const LoadingRow = () => (
  <TableRow>
    <TableCell className="space-y-1.5">
      <Skeleton className="h-[20px] w-[150px]" />
      <Skeleton className="h-[20px] w-[70px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="ml-auto h-[20px] w-[70px]" />
    </TableCell>
  </TableRow>
);

export const SessionsTable = () => {
  return (
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
