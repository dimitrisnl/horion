import {
  AudioWaveformIcon,
  MegaphoneIcon,
  SquareChartGanttIcon,
  TagIcon,
} from "@horionos/icons";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@horionos/ui/navigation-menu";

import {Link} from "@tanstack/react-router";

import {TeamDropdown} from "./team-dropdown";
import {UserDropdown} from "./user-dropdown";

const nav = [
  {
    title: "Dashboard",
    url: "/$orgId",
    icon: SquareChartGanttIcon,
    activeOptions: {exact: true},
  },
  {
    title: "Announcements",
    url: "/$orgId/announcements",
    icon: MegaphoneIcon,
    activeOptions: {exact: false},
  },
  {
    title: "Categories",
    url: "/$orgId/categories",
    icon: TagIcon,
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
                  <item.icon className="size-5 md:size-4" />
                  <span className="hidden md:inline">{item.title}</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center border-b bg-white">
      <div className="flex w-full items-center gap-2 px-3">
        <div className="flex w-full items-center gap-3">
          <div>
            <TeamDropdown />
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Navigation />
          </div>
        </div>
        <UserDropdown />
      </div>
    </header>
  );
}
