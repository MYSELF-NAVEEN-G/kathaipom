"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="p-0">
            <SidebarNav />
            <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-h-screen">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
