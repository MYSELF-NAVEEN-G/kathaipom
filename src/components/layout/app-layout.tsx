"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="p-0">
            <SidebarNav />
            <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-h-screen flex flex-col">
            {isMobile && (
                <header className="flex items-center p-4 border-b">
                    <SidebarTrigger />
                    <h1 className="font-headline font-bold text-lg ml-4">Kathaipom Social</h1>
                </header>
            )}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
