import {
  BuildingIcon,
  CircleQuestionMarkIcon,
  KeyRoundIcon,
  LogOutIcon,
  UserIcon,
} from "@horionos/icons";
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

export function UserDropdown() {
  const {logOut} = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="select-none" size="icon">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-44 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/account" preload="intent">
              <UserIcon className="size-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account/security" preload="intent">
              <KeyRoundIcon className="size-4" />
              Security
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account/memberships" preload="intent">
              <BuildingIcon className="size-4" />
              Memberships
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/account" preload="intent">
              <CircleQuestionMarkIcon className="size-4" />
              Need help?
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
