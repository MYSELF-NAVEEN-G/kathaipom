'use client';
import {
  Home,
  Search,
  User as UserIcon,
  PlusSquare,
  LogOut,
  Bell,
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock current user data - in a real app this would come from an auth context
const currentUser = {
  name: 'Admin User',
  username: 'admin',
  avatar: 'https://picsum.photos/seed/avatar1/100/100',
  isAdmin: true, // This flag determines if the user is an admin
};

// To test a regular user view, you could swap the above with this:
// const currentUser = {
//   name: 'Jane Doe',
//   username: 'janedoe',
//   avatar: 'https://picsum.photos/seed/avatar2/100/100',
//   isAdmin: false,
// };

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: '/feed', label: 'Feed', icon: Home },
    { href: '#', label: 'Search', icon: Search },
    { href: '#', label: 'Notifications', icon: Bell },
    { href: '#', label: 'Profile', icon: UserIcon },
  ];

  const handleLogout = () => {
    // In a real app, you would have a proper logout flow
    router.push('/');
  }

  return (
    <>
      <SidebarHeader className="p-4 flex items-center gap-2">
        <Logo size="small" />
        <SidebarInput placeholder="Search..." className="mt-0" />
      </SidebarHeader>
      <SidebarContent className="p-4 pt-0">
        {currentUser.isAdmin && (
          <Button className="w-full mb-4" size="lg">
            <PlusSquare className="mr-2 h-5 w-5" />
            Create Post
          </Button>
        )}
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
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
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
                <LogOut />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
