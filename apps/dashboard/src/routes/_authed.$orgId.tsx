import {
  AudioWaveformIcon,
  MailIcon,
  SettingsIcon,
  SquareChartGanttIcon,
} from "@horionos/icons";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@horionos/ui/navigation-menu";
import {Separator} from "@horionos/ui/separator";

import {createFileRoute, Outlet, redirect} from "@tanstack/react-router";
import {Link} from "@tanstack/react-router";

import {NotFound} from "~/components/not-found";
import {TeamDropdown} from "~/components/team-dropdown";
import {ThemeSwitcher} from "~/components/theme/theme-switcher";
import {UserDropdown} from "~/components/user-dropdown";

export const Route = createFileRoute("/_authed/$orgId")({
  component: RouteComponent,
  notFoundComponent: () => <NotFound />,
  beforeLoad: async ({context, params}) => {
    const {orgId} = params;

    const [membership, organization] = await Promise.all([
      context.queryClient.ensureQueryData(
        context.orpc.account.getMembership.queryOptions({
          input: {organizationId: orgId},
        }),
      ),
      context.queryClient.ensureQueryData(
        context.orpc.organization.get.queryOptions({
          input: {id: orgId},
        }),
      ),
    ]).catch(() => {
      throw redirect({to: "/"});
    });

    return {
      membership,
      organization,
    };
  },
});

const nav = [
  {
    title: "Dashboard",
    url: "/$orgId",
    icon: SquareChartGanttIcon,
    activeOptions: {exact: true},
  },
  {
    title: "Settings",
    url: "/$orgId/settings",
    icon: SettingsIcon,
    activeOptions: {exact: true},
  },
  {
    title: "Invitations",
    url: "/$orgId/invitations",
    icon: MailIcon,
    activeOptions: {exact: true},
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

export function OrgPagesHeader() {
  return (
    <div>
      <header className="bg-background sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-6">
          <div className="flex w-full items-center gap-2">
            <div className="flex w-full items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="bg-primary text-primary-foreground flex size-7.5 items-center justify-center rounded-md">
                  <AudioWaveformIcon className="size-4" />
                </div>
                <TeamDropdown />
              </div>
            </div>
            <Navigation />
            <Separator className="lg:mx-2" orientation="vertical" />
            <ThemeSwitcher />
            <UserDropdown />
          </div>
        </div>
      </header>
    </div>
  );
}

function RouteComponent() {
  return (
    <>
      <OrgPagesHeader />
      <Outlet />
    </>
  );
}
