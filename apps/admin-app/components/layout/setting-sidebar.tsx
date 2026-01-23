"use client";

import {
    Info,
    Settings,
    CreditCard,
    Shield,
    Key,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

type SidebarItem = {
    title: string;
    tab: string;
    icon: React.ElementType;
};

const items: SidebarItem[] = [
    {
        title: "Information",
        tab: "#information",
        icon: Info,
    },
    {
        title: "Settings",
        tab: "#settings",
        icon: Settings,
    },
    {
        title: "Billing",
        tab: "#billing",
        icon: CreditCard,
    },
    {
        title: "Roles",
        tab: "#roles",
        icon: Shield,
    },
    {
        title: "Permissions",
        tab: "#permissions",
        icon: Key,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarContent>
                {/* Header */}
                <SidebarGroup>
                    <SidebarHeader>
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Name
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                Admin Console
                            </p>
                        </div>
                    </SidebarHeader>
                </SidebarGroup>

                {/* Menu */}
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname.startsWith(item.tab);
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            data-active={isActive}
                                        >
                                            <Link href={item.tab}>
                                                <Icon className="h-4 w-4" />
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

export default AppSidebar;