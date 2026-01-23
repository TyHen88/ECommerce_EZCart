import { AppSidebar } from "@/components/layout/app-sidebar";
import HeaderProvider from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <HeaderProvider />
        <div className="flex-1 px-6 py-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
