import {CircleQuestionMarkIcon, LogOutIcon, UserIcon} from "@horionos/icons";
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
      <DropdownMenuContent className="min-w-40" align="center">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/account" preload="intent">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account/security" preload="intent">
              Security
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account/memberships" preload="intent">
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
