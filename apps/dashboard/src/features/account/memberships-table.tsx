import {Suspense} from "react";

import {ArrowRightIcon, EllipsisIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";
import {Skeleton} from "@horionos/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@horionos/ui/table";
import {Text} from "@horionos/ui/text";

import {useSuspenseQuery} from "@tanstack/react-query";
import {Link} from "@tanstack/react-router";

import {MembershipRoleBadge} from "~/components/membership-role-badge";
import {orpc} from "~/utils/orpc";

const LoadingRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-[20px] w-[120px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-[20px] w-[70px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-[20px] w-[30px]" />
    </TableCell>
  </TableRow>
);

export const MembershipsTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow disableHover>
          <TableHead>Organization</TableHead>
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
          <MembershipTableRows />
        </Suspense>
      </TableBody>
    </Table>
  );
};

const MembershipTableRows = () => {
  const {
    data: {memberships},
  } = useSuspenseQuery(orpc.account.getMemberships.queryOptions());

  if (!memberships || memberships.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={3} className="text-center">
          <Text className="text-muted-foreground py-12">
            No memberships found
          </Text>
        </TableCell>
      </TableRow>
    );
  }

  return memberships.map((membership) => (
    <TableRow key={membership.organizationId} disableHover>
      <TableCell>
        <div className="text-base font-semibold">
          {membership.organizationName}
        </div>
      </TableCell>
      <TableCell>
        <MembershipRoleBadge role={membership.role} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem>
              <Link to="/$orgId" params={{orgId: membership.organizationId}}>
                Go to organization
              </Link>
              <ArrowRightIcon />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ));
};
