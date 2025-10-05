'use client';
import React from 'react';
import {
  Home,
  Search,
  User as UserIcon,
  PlusSquare,
  LogOut,
  Bell,
  LayoutDashboard,
  Github,
  ShieldCheck,
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

type UserRole = 'user' | 'writer' | 'super-admin' | null;

type UserData = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: UserRole;
};

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<UserData | null>(null);

  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole') as UserRole;
    const userName = localStorage.getItem('userName');
    const userUsername = localStorage.getItem('userUsername');
    
    if (userId && userRole && userName && userUsername) {
        setCurrentUser({
            id: userId,
            name: userName,
            username: userUsername,
            avatar: `https://picsum.photos/seed/${userUsername}/100/100`,
            role: userRole,
        })
    } else {
        setCurrentUser(null); 
    }
  }, [pathname]); // Rerun on path change to reflect login/logout

  const userMenuItems = [
    { href: '/feed', label: 'Feed', icon: Home },
    { href: '#', label: 'Search', icon: Search },
    { href: '#', label: 'Notifications', icon: Bell },
    { href: currentUser ? `/profile/${currentUser.username}` : '#', label: 'Profile', icon: UserIcon },
  ];

  const writerMenuItems = [
    { href: '/feed', label: 'Feed Preview', icon: Home },
    { href: '/admin/dashboard', label: 'Writer Dashboard', icon: LayoutDashboard },
    { href: currentUser ? `/profile/${currentUser.username}` : '#', label: 'Profile', icon: UserIcon },
  ];

  const adminMenuItems = [
    ...writerMenuItems,
    { href: '/admin/import', label: 'Import', icon: Github },
    { href: '#', label: 'User Management', icon: ShieldCheck }, // Placeholder
  ];
  
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userUsername');
    setCurrentUser(null);
    router.push('/');
  }

  if (!currentUser) {
    return (
        <>
            <SidebarHeader className="p-4 flex items-center gap-2">
                <Logo size="small" />
                <SidebarInput placeholder="Search..." className="mt-0" />
            </SidebarHeader>
            <SidebarContent className="p-4 pt-0" />
            <SidebarSeparator />
            <SidebarFooter className="p-4">
                 <Button asChild className="w-full">
                    <Link href="/login">Sign In</Link>
                 </Button>
            </SidebarFooter>
        </>
    );
  }

  const getMenuItems = () => {
    switch (currentUser.role) {
      case 'super-admin':
        return adminMenuItems;
      case 'writer':
        return writerMenuItems;
      case 'user':
      default:
        return userMenuItems;
    }
  };

  const menuItems = getMenuItems();
  const canCreate = currentUser.role === 'writer' || currentUser.role === 'super-admin';

  return (
    <>
      <SidebarHeader className="p-4 flex items-center gap-2">
        <Logo size="small" />
        <SidebarInput placeholder="Search..." className="mt-0" />
      </SidebarHeader>
      <SidebarContent className="p-4 pt-0">
        {canCreate && (
           <Button asChild className="w-full mb-4" size="lg">
             <Link href="/admin/dashboard">
               <PlusSquare className="mr-2 h-5 w-5" />
               Write Story
             </Link>
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
