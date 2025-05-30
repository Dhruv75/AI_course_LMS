import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookAIcon,
  Compass,
  LayoutDashboardIcon,
  PencilRulerIcon,
  UserCircle2Icon,
  WalletCardsIcon,
} from "lucide-react";
import AddNewCourseDialog from "./AddNewCourseDialog"; // Assuming this path is correct based on the image

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
          {/* FIX IS HERE: Ensure no whitespace/newlines between tags */}
          <AddNewCourseDialog><Button>Create new course</Button></AddNewCourseDialog>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link href={item.path}>
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