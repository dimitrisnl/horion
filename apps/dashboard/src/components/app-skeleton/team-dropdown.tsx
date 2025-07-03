import {Suspense} from "react";

import {
  ChevronDownIcon,
  CircleSmallIcon,
  PlusCircleIcon,
  SettingsIcon,
} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";

import {useSuspenseQuery} from "@tanstack/react-query";
import {Link, useNavigate} from "@tanstack/react-router";

import {useOrgId} from "~/hooks/use-org-id";
import {orpc} from "~/utils/orpc";

export function TeamDropdown() {
  const organizationId = useOrgId();

  const {
    data: {organization},
  } = useSuspenseQuery(
    orpc.organization.get.queryOptions({input: {organizationId}}),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <div
              className="max-w-[120px] min-w-[80px] truncate text-left"
              title={organization.name}
            >
              {organization.name}
            </div>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenuTrigger>
      <Suspense fallback={null}>
        <MembershipsDropdown />
      </Suspense>
    </DropdownMenu>
  );
}

const MembershipsDropdown = () => {
  const organizationId = useOrgId();
  const navigate = useNavigate();
  const {
    data: {memberships},
  } = useSuspenseQuery(orpc.membership.getAll.queryOptions());

  const list =
    memberships.length > 0 ? (
      <>
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Organizations
        </DropdownMenuLabel>
        {memberships.map((membership) => (
          <DropdownMenuItem
            key={membership.organizationName}
            onClick={() =>
              navigate({
                to: `/${membership.organizationId}`,
                params: {orgId: membership.organizationId},
                replace: true,
              })
            }
          >
            {organizationId === membership.organizationId ? (
              <CircleSmallIcon className="size-4 fill-blue-500 stroke-blue-500" />
            ) : (
              <CircleSmallIcon className="size-4" />
            )}
            {membership.organizationName}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-2" />
      </>
    ) : undefined;

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="start"
      sideOffset={4}
    >
      {list}
      <DropdownMenuItem asChild>
        <Link to="/$orgId/settings" params={{orgId: organizationId}}>
          <SettingsIcon className="size-4" />
          <div>Settings</div>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/onboarding">
          <PlusCircleIcon className="size-4" />
          <div>Create new</div>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
