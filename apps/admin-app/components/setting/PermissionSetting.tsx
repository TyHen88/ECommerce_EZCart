"use client"

import React from "react"

const PermissionSetting = () => {
    const permissions = [
        "View dashboards",
        "Manage products",
        "Manage orders",
        "Invite team members",
        "Export reports",
    ]

    return (
        <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">Permissions applied to your current role.</p>
            <div className="grid gap-2">
                {permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-2 rounded-md border px-3 py-2">
                        <span className="text-sm text-foreground">{permission}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PermissionSetting
