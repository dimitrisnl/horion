import {AudioWaveformIcon} from "@horionos/icons";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@horionos/ui/navigation-menu";
import {Separator} from "@horionos/ui/separator";

import {createFileRoute, Outlet} from "@tanstack/react-router";
import {Link} from "@tanstack/react-router";

import {NotFound} from "~/components/not-found";
import {TeamDropdownWithoutSelection} from "~/components/team-dropdown";
import {ThemeSwitcher} from "~/components/theme/theme-switcher";
import {UserDropdown} from "~/components/user-dropdown";

export const Route = createFileRoute("/_authed/account")({
  component: RouteComponent,
  notFoundComponent: () => <NotFound />,
});

const nav = [
  {
    title: "Profile",
    url: "/account",
    activeOptions: {exact: true},
  },
  {
    title: "Security",
    url: "/account/security",
    activeOptions: {exact: false},
  },
  {
    title: "Memberships",
    url: "/account/memberships",
    activeOptions: {exact: false},
  },
];

const Navigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {nav.map((item) => {
          return (
            <NavigationMenuItem key={item.title + item.url}>
              <NavigationMenuLink asChild>
                <Link
                  activeOptions={item.activeOptions}
                  to={item.url}
                  className="flex"
                >
                  <span>{item.title}</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

function RouteComponent() {
  return (
    <>
      <div>
        <header className="bg-background sticky top-0 z-50 border-b">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-6">
            <div className="flex w-full items-center gap-2">
              <div className="flex w-full items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary text-primary-foreground flex size-7.5 items-center justify-center rounded-md">
                    <AudioWaveformIcon className="size-4" />
                  </div>
                  <TeamDropdownWithoutSelection />
                </div>
              </div>
              <Navigation />
              <Separator className="mx-2" orientation="vertical" />
              <ThemeSwitcher />
              <UserDropdown />
            </div>
          </div>
        </header>
      </div>
      <Outlet />
    </>
  );
}
