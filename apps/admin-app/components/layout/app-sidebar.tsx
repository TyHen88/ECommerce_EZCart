"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
    title: string;
    url: string;
    icon: React.ElementType;
};

const items: NavItem[] = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Customer List", url: "/customer-list", icon: Users },
    { title: "Product List", url: "/product-list", icon: Package },
    { title: "Seller List", url: "/seller-list", icon: ShoppingBag },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarHeader>
                        <div>
                            <p className="text-sm font-semibold text-foreground">EZ-Carts</p>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                Admin Console
                            </p>
                        </div>
                    </SidebarHeader>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive =
                                    pathname === item.url || pathname.startsWith(item.url + "/");
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild
                                            className={isActive ? "bg-muted font-medium text-blue-600" : ""}>
                                            <Link href={item.url}>
                                                <Icon className="h-4 w-4 shrink-0" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
