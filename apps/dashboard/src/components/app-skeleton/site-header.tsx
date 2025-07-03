import {
  AudioWaveformIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  SquareChartGanttIcon,
  TagIcon,
} from "@horionos/icons";
import {Button} from "@horionos/ui/button";
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
                  <item.icon className="stroke-1.5 size-4.5 md:hidden" />
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
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-6">
        <div className="flex w-full items-center gap-2">
          <div className="flex w-full items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="bg-primary text-primary-foreground flex size-7.5 items-center justify-center rounded-md">
                <AudioWaveformIcon className="size-4" />
              </div>
              <div>
                <TeamDropdown />
              </div>
            </div>
            <Navigation />
          </div>

          <Button variant="tertiary" size="sm">
            <MessageCircleIcon />
            <div className="hidden lg:inline">Support</div>
          </Button>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
