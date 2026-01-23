"use client"

import React from "react"
import { Button } from "@/components/ui/button"

const Security = () => {
    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between rounded-md border p-4">
                <div className="grid gap-1">
                    <p className="text-sm font-medium text-foreground">Password</p>
                    <p className="text-xs text-muted-foreground">Last updated: Not available</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                    Update
                </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border p-4">
                <div className="grid gap-1">
                    <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">Extra protection for your account.</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                    Enable
                </Button>
            </div>
        </div>
    )
}

export default Security
