import type {LucideIcon} from "@horionos/icons";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@horionos/ui/sidebar";

import {Link} from "@tanstack/react-router";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export function NavMain({items}: {items: Array<NavItem>}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url} activeOptions={{exact: true}}>
                  {({isActive}) => {
                    return (
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        asChild
                      >
                        <div>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    );
                  }}
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
