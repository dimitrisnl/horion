import {LogOutIcon, UserCog2Icon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";

import {useQuery} from "@tanstack/react-query";
import {Link} from "@tanstack/react-router";

import {useLogout} from "~/hooks/use-log-out";
import {useOrgId} from "~/hooks/use-org-id";
import {orpc} from "~/utils/orpc";

export function UserDropdown() {
  const orgId = useOrgId();
  const {logOut} = useLogout();

  const {data, status} = useQuery(orpc.user.getCurrentUser.queryOptions());

  if (status === "pending" || status === "error") {
    return <div className="size-9.5" />;
  }

  const {user} = data;
  const hasName = user.name && user.name.trim().length > 0;
  const initial = hasName ? user.name[0] : user.email[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="size-8 select-none" size="icon">
          {initial}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-44 rounded-lg"
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
              <UserCog2Icon className="size-4" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut}>
          <LogOutIcon className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
