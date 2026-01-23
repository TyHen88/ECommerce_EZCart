"use client"

import React from "react"

export const RoleSetting = () => {
    const roles = ["Admin", "Manager", "Support"]

    return (
        <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">Roles assigned to your account.</p>
            <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                    <span
                        key={role}
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-foreground"
                    >
                        {role}
                    </span>
                ))}
            </div>
        </div>
    )
}
