import React from "react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, // <--- ADDED: This was the missing import for SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  BookAIcon,
  Compass,
  LayoutDashboardIcon,
  PencilRulerIcon,
  UserCircle2Icon,
  WalletCardsIcon,
} from "lucide-react";


const SideBarOptions = [
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    path: "/#",
  },
  {
    title: "My Learning",
    icon: BookAIcon,
    path: "/workspace/my-courses",
  },
  {
    title: "Explore Courses",
    icon: Compass,
    path: "/workspace/explore",
  },
  {
    title: "AI Tools",
    icon: PencilRulerIcon,
    path: "/workspace/ai-tools",
  },
  {
    title: "Billing",
    icon: WalletCardsIcon,
    path: "/workspace/billing",
  },
  {
    title: "profile",
    icon: UserCircle2Icon,
    path: "/workspace/profile",
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <Button>Create new course</Button>
        </SidebarGroup>

        <SidebarGroup >
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarOptions.map((item, index) => (
                // Changed <SidebarMenu.Item> to <SidebarMenuItem> as per your component's export
                <SidebarMenuItem
                  key={index} // Keeping index as key as requested
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.path}>
                      {/* Added className for basic styling of the icon */}
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;