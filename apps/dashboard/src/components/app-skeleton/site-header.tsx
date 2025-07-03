import {MegaphoneIcon, SquareChartGanttIcon, TagsIcon} from "@horionos/icons";
import {buttonVariants} from "@horionos/ui/button";

import {Link} from "@tanstack/react-router";

import {SearchForm} from "./search-form";
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

const Logo = () => (
  <div className="bg-primary text-background flex size-7 items-center justify-center rounded-full font-bold tracking-tight">
    h
  </div>
);

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
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      </div>
    );
  });
};

export function SiteHeader() {
  return (
    <header className="bg-accent sticky top-0 z-50 flex h-14 w-full items-center border-b">
      <div className="flex w-full items-center gap-2 px-3">
        <div className="flex w-full items-center gap-3">
          <Logo />
          <div>
            <TeamDropdown />
          </div>
          <div className="flex items-center gap-3">
            <Navigation />
          </div>
        </div>
        <SearchForm className="ml-auto w-64" />
        <UserDropdown />
      </div>
    </header>
  );
}
