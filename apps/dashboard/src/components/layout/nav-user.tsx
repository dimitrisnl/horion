import {ChevronUpIcon, LogOutIcon, UserCog2Icon} from "@horion/icons";
import {Avatar, AvatarFallback} from "@horion/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@horion/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@horion/ui/sidebar";

import {useQuery} from "@tanstack/react-query";
import {Link, useNavigate} from "@tanstack/react-router";

import {minutes} from "~/utils/minutes";
import {orpc, queryClient} from "~/utils/orpc";
import {useOrgId} from "~/utils/use-org-id";

export function NavUser() {
  const {isMobile} = useSidebar();
  const navigate = useNavigate();
  const orgId = useOrgId();

  const {data, status} = useQuery(
    orpc.auth.getSession.queryOptions({
      staleTime: minutes(5),
    }),
  );

  if (status === "pending" || !data || !data.user) {
    return null;
  }

  const {user} = data;
  const hasName = user.name && user.name.trim().length > 0;
  const initial = hasName ? user.name[0] : user.email[0];

  const logout = () => {
    orpc.auth.signOut.call().then(() => {
      queryClient.clear();
      navigate({to: "/login", replace: true});
    });
  };

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
            <DropdownMenuItem onClick={logout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
