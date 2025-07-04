import {LogOutIcon, SettingsIcon, UserIcon} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@horionos/ui/dropdown-menu";

import {Link} from "@tanstack/react-router";

import {useLogout} from "~/hooks/use-log-out";
import {useOrgId} from "~/hooks/use-org-id";

export function UserDropdown() {
  const orgId = useOrgId();
  const {logOut} = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="select-none" size="sm">
          <UserIcon /> <div className="hidden lg:inline">My Account</div>
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
              <SettingsIcon className="size-4" />
              Settings
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
