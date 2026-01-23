"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import React from "react"
import SettingInfo from "@/components/setting/SettingInfo"
import Security from "@/components/setting/Security"
import BillingSetting from "@/components/setting/BillingSetting"
import { RoleSetting } from "@/components/setting/RoleSetting"
import PermissionSetting from "@/components/setting/PermissionSetting"
import { CheckCheckIcon, CreditCard, Key, RollerCoaster, SeparatorVertical, User2Icon, UserCheck, UserCheck2, UserCircle2Icon, UserCog2 } from "lucide-react"
import { DialogClose } from "@radix-ui/react-dialog"
import { Label } from "@/components/ui/label"
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"

export function DialogProfile({ open, setOpen }: any) {
    const { data: session } = useSession()
    const name = session?.user?.name ?? "Unknown user"
    const email = session?.user?.email ?? "No email on file"
    const userId = session?.user?.id ?? "Not available"

    const tabs = [
        {
            id: "profile",
            label: "Profile",
            content: <SettingInfo name={name} email={email} userId={userId} />,
            icon: <User2Icon />,
        },
        {
            id: "security",
            label: "Security",
            content: <Security />,
            icon: <Key />,
        },
        {
            id: "billing",
            label: "Billing",
            content: <BillingSetting />,
            icon: <CreditCard />,
        },
        {
            id: "roles",
            label: "Roles",
            content: <RoleSetting />,
            icon: <UserCheck2 />,
        },
        {
            id: "permissions",
            label: "Permissions",
            content: <PermissionSetting />,
            icon: <UserCog2 />,
        },
    ]
    const [activeTab, setActiveTab] = React.useState(tabs[0].id)
    const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogContent className="w-full h-full sm:max-w-[800px] sm:max-h-[600px] md:max-w-[900px] md:max-h-[700px]">
                    <DialogHeader >
                        <DialogTitle>
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    {name}
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                    Admin Setting
                                </p>
                            </div>
                        </DialogTitle>
                        <SidebarMenuSub>

                            {/* <Label className="text-xs uppercase text-muted-foreground">Settings</Label> */}
                            <DialogDescription>
                                <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                                    <div className="flex gap-2 overflow-x-auto md:flex-col">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`rounded-md px-3 py-2 text-left text-sm transition ${activeTab === tab.id
                                                    ? "bg-accent text-accent-foreground"
                                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-4 w-4 items-center justify-center">
                                                        {tab.icon}
                                                    </span>
                                                    <span className="text-sm">{tab.label}</span>
                                                </div>

                                            </button>
                                        ))}
                                    </div>
                                    <div className="rounded-md border p-4">
                                        {activeContent}
                                    </div>
                                </div>
                            </DialogDescription>
                        </SidebarMenuSub>
                    </DialogHeader>
                </DialogContent>
            </form>
        </Dialog>
    )
}
