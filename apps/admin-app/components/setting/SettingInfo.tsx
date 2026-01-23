"use client"

import React from "react"
import { Label } from "@/components/ui/label"

type SettingInfoProps = {
    name: string
    email: string
    userId: string
}

const SettingInfo = ({ name, email, userId }: SettingInfoProps) => {
    return (
        <div className="grid gap-4">
            <div className="grid gap-1">
                <Label className="text-xs uppercase text-muted-foreground">Name</Label>
                <p className="text-sm text-foreground">{name}</p>
            </div>
            <div className="grid gap-1">
                <Label className="text-xs uppercase text-muted-foreground">Email</Label>
                <p className="text-sm text-foreground">{email}</p>
            </div>
            <div className="grid gap-1">
                <Label className="text-xs uppercase text-muted-foreground">User ID</Label>
                <p className="text-sm text-foreground">{userId}</p>
            </div>
        </div>
    )
}

export default SettingInfo
