import {ChevronUpIcon, LogOutIcon, UserCog2Icon} from "@horionos/icons";
import {Avatar, AvatarFallback} from "@horionos/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@horionos/ui/sidebar";

import {useQuery} from "@tanstack/react-query";
import {Link} from "@tanstack/react-router";

import {useLogout} from "~/hooks/use-log-out";
import {useOrgId} from "~/hooks/use-org-id";
import {orpc} from "~/utils/orpc";

export function NavUser() {
  const orgId = useOrgId();
  const {isMobile} = useSidebar();
  const {logOut} = useLogout();

  const {data, status} = useQuery(orpc.user.getCurrentUser.queryOptions());

  if (status === "pending" || status === "error") {
    return null;
  }

  const {user} = data;
  const hasName = user.name && user.name.trim().length > 0;
  const initial = hasName ? user.name[0] : user.email[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar>
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronUpIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  to="/$orgId/account"
                  params={{orgId: orgId!}}
                  preload="intent"
                >
                  <UserCog2Icon />
                  Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
