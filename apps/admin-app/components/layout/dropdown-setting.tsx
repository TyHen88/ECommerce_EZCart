'use client'
import { DialogProfile } from "@/components/setting/ProfileSettingModel"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Info, LogOut, Settings, UserCircle } from "lucide-react"
import React from "react"

export function DropdownMenuSetting() {
    const [open, setOpen] = React.useState(false)
    return (
        <>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <UserCircle className=" h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuItem onClick={(e) => {
                            // e.preventDefault()
                            setOpen(true)
                        }}>
                            Settings
                            <DropdownMenuShortcut>
                                <Settings className="h-4 w-4" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Log out
                            <DropdownMenuShortcut>
                                <LogOut className="h-4 w-4" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            {
                open && (
                    <DialogProfile open={open} setOpen={setOpen} />
                )
            }
        </>
    )
}
