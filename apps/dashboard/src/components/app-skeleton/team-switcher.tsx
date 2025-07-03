import {Suspense} from "react";

import {ChevronDownIcon, PlusIcon} from "@horionos/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@horionos/ui/sidebar";

import {useSuspenseQuery} from "@tanstack/react-query";
import {Link, useNavigate} from "@tanstack/react-router";

import {orpc} from "~/utils/orpc";
import {useOrgId} from "~/utils/use-org-id";

export function TeamSwitcher() {
  const organizationId = useOrgId();

  const {
    data: {organization},
  } = useSuspenseQuery(
    orpc.organization.get.queryOptions({input: {organizationId}}),
  );

  const initial = organization.name[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-semibold uppercase">
                {initial}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {organization.name}
                </span>
              </div>
              <ChevronDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <Suspense fallback={null}>
            <MembershipsDropdown />
          </Suspense>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const MembershipsDropdown = () => {
  const {isMobile} = useSidebar();
  const navigate = useNavigate();
  const {
    data: {memberships},
  } = useSuspenseQuery(orpc.membership.getAll.queryOptions());

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="start"
      side={isMobile ? "bottom" : "right"}
      sideOffset={4}
    >
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
          className="gap-2 p-2"
        >
          <div className="flex size-6 items-center justify-center rounded-md border text-xs font-semibold uppercase">
            {membership.organizationName[0]}
          </div>
          {membership.organizationName}
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem className="gap-2 p-2" asChild>
        <Link to="/onboarding">
          <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
            <PlusIcon className="size-4" />
          </div>
          <div className="text-muted-foreground font-medium">Create new</div>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
