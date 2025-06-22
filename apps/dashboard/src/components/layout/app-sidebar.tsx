import type React from "react";

import {
  GaugeIcon,
  MegaphoneIcon,
  PaperclipIcon,
  SettingsIcon,
} from "@horionos/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@horionos/ui/sidebar";

import {NavMain} from "./main-nav";
import {NavSecondary} from "./nav-secondary";
import {NavUser} from "./nav-user";
import {TeamSwitcher} from "./team-switcher";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/$orgId",
      icon: GaugeIcon,
    },
    {
      title: "Announcements",
      url: "/$orgId/announcements",
      icon: MegaphoneIcon,
    },
    {
      title: "Categories",
      url: "/$orgId/categories",
      icon: PaperclipIcon,
    },
    {
      title: "Settings",
      url: "/$orgId/settings",
      icon: SettingsIcon,
    },
  ],
  navSecondary: [
    // { title: "Support", url: "#", icon: LifeBuoyIcon },
    // { title: "Feedback", url: "#", icon: SendIcon },
  ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarSeparator className="mx-0!" />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarSeparator className="mx-0!" />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
