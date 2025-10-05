"use client";
import {
  Home,
  Search,
  User as UserIcon,
  PlusSquare,
  LogOut,
  Settings,
} from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from 'next/link';

// Mock current user data
const currentUser = {
  name: "Admin User",
  username: "admin",
  avatar: "https://picsum.photos/seed/avatar1/100/100",
  isAdmin: true,
};

export function SidebarNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const menuItems = [
    { href: "/", label: "Feed", icon: Home },
    { href: "#", label: "Search", icon: Search },
    { href: "#", label: "Profile", icon: UserIcon },
  ];

  return (
    <>
      <SidebarHeader className="p-4 flex items-center gap-2">
        <Logo size="small" />
        <SidebarInput placeholder="Search..." className="mt-0" />
      </SidebarHeader>
      <SidebarContent className="p-4 pt-0">
        {currentUser.isAdmin && (
          <Button className="w-full mb-4">
            <PlusSquare className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        )}
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                    as="a"
                    isActive={pathname === item.href}
                    tooltip={item.label}
                >
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
            <p className="font-semibold text-sm truncate">{currentUser.name}</p>
            <p className="text-muted-foreground text-xs truncate">
              @{currentUser.username}
            </p>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                <Link href="/login"><LogOut /></Link>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
