import {
  AudioWaveformIcon,
  MegaphoneIcon,
  SquareChartGanttIcon,
  TagsIcon,
} from "@horionos/icons";
import {buttonVariants} from "@horionos/ui/button";

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
    icon: TagsIcon,
    activeOptions: {exact: false},
  },
];

const Navigation = () => {
  return nav.map((item) => {
    return (
      <div key={item.title + item.url}>
        <Link
          inactiveProps={{className: "text-muted-foreground/75 font-semibold!"}}
          activeProps={{className: "font-semibold!"}}
          activeOptions={item.activeOptions}
          className={buttonVariants({variant: "ghost", size: "sm"})}
          to={item.url}
        >
          <item.icon className="size-5 md:size-4" />
          <span className="hidden md:inline">{item.title}</span>
        </Link>
      </div>
    );
  });
};

export function SiteHeader() {
  return (
    <header className="bg-muted sticky top-0 z-50 flex h-14 w-full items-center border-b">
      <div className="flex w-full items-center gap-2 px-3">
        <div className="flex w-full items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-7.5 items-center justify-center rounded-md">
            <AudioWaveformIcon className="size-4" />
          </div>
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
