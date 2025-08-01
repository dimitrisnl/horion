import {Suspense} from "react";

import {
  ChevronDownIcon,
  CircleSmallIcon,
  LoaderCircleIcon,
  MailIcon,
  PlusIcon,
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

import {useCurrentMembership} from "~/hooks/use-membership";
import {useOrgId} from "~/hooks/use-org-id";
import {orpc} from "~/utils/orpc";

export function TeamDropdown() {
  const organizationId = useOrgId();

  const {
    data: {organization},
  } = useSuspenseQuery(
    orpc.organization.get.queryOptions({input: {id: organizationId}}),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {organization.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <Suspense fallback={null}>
        <MembershipsDropdown />
      </Suspense>
    </DropdownMenu>
  );
}

const MembershipsDropdownList = ({
  activeOrganizationId,
}: {
  activeOrganizationId: string;
}) => {
  const navigate = useNavigate();
  const {
    data: {memberships},
  } = useSuspenseQuery(orpc.account.getMemberships.queryOptions());

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
            {activeOrganizationId === membership.organizationId ? (
              <CircleSmallIcon className="stroke-primary fill-primary size-4" />
            ) : (
              <CircleSmallIcon className="size-4" />
            )}
            {membership.organizationName}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-2" />
      </>
    ) : undefined;

  return list;
};

const MembershipsDropdown = () => {
  const organizationId = useOrgId();
  const membership = useCurrentMembership();

  const shouldShowOrgActions =
    membership.role === "owner" || membership.role === "admin";

  return (
    <DropdownMenuContent className="min-w-56" align="start" sideOffset={4}>
      <MembershipsDropdownList activeOrganizationId={organizationId} />
      {shouldShowOrgActions ? (
        <>
          <DropdownMenuItem asChild>
            <Link to="/$orgId/settings" params={{orgId: organizationId}}>
              <SettingsIcon className="size-4" />
              <div>Settings</div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/$orgId/settings/invitations"
              params={{orgId: organizationId}}
            >
              <MailIcon className="size-4" />
              <div>Invite teammates</div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      ) : null}

      <DropdownMenuItem asChild>
        <Link to="/create-organization">
          <PlusIcon className="size-4" />
          <div>Create new organization</div>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export const TeamDropdownWithoutSelection = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          Select organization
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="start" sideOffset={4}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-4">
              <LoaderCircleIcon className="animate-spin" />
            </div>
          }
        >
          <MembershipsDropdownList activeOrganizationId={""} />
          <DropdownMenuItem asChild>
            <Link to="/create-organization">
              <PlusIcon className="size-4" />
              <div>Create new organization</div>
            </Link>
          </DropdownMenuItem>
        </Suspense>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
