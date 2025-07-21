import {Suspense} from "react";

import {Skeleton} from "@horionos/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@horionos/ui/table";
import {Strong, Text} from "@horionos/ui/text";

import {useSuspenseQuery} from "@tanstack/react-query";

import {MembershipRoleBadge} from "~/components/membership-role-badge";
import {useOrgId} from "~/hooks/use-org-id";
import {orpc} from "~/utils/orpc";

const LoadingRow = () => (
  <TableRow>
    <TableCell className="space-y-1.5">
      <Skeleton className="h-[20px] w-[150px]" />
      <Skeleton className="h-[20px] w-[70px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-[20px] w-[50px]" />
    </TableCell>
  </TableRow>
);

export const OrganizationMembersTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow disableHover>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Suspense
          fallback={
            <>
              <LoadingRow />
              <LoadingRow />
            </>
          }
        >
          <OrganizationMembersList />
        </Suspense>
      </TableBody>
    </Table>
  );
};

const OrganizationMembersList = () => {
  const organizationId = useOrgId();
  const {
    data: {memberships},
  } = useSuspenseQuery(
    orpc.organization.getMemberships.queryOptions({
      input: {organizationId},
    }),
  );

  return memberships.map((membership) => (
    <TableRow key={membership.memberId}>
      <TableCell>
        <Strong>{membership.memberEmail}</Strong>
        {membership.memberName ? (
          <Text className="text-muted-foreground">
            ({membership.memberName})
          </Text>
        ) : null}
      </TableCell>
      <TableCell>
        <MembershipRoleBadge role={membership.role} />
      </TableCell>
    </TableRow>
  ));
};
