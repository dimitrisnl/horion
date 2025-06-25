import type React from "react";

import type {LucideIcon} from "@horionos/icons";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@horionos/ui/sidebar";

// import {ThemeSwitcher} from "../theme-switcher";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export function NavSecondary({
  items,
  ...props
}: {
  items: Array<NavItem>;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* <SidebarMenuItem>
            <ThemeSwitcher />
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
