"use client"

import React from "react"
import { Button } from "@/components/ui/button"

function BillingSetting() {
    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between rounded-md border p-4">
                <div className="grid gap-1">
                    <p className="text-sm font-medium text-foreground">Plan</p>
                    <p className="text-xs text-muted-foreground">Business (monthly)</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                    Change plan
                </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border p-4">
                <div className="grid gap-1">
                    <p className="text-sm font-medium text-foreground">Payment method</p>
                    <p className="text-xs text-muted-foreground">Visa ending in 4242</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                    Update
                </Button>
            </div>
        </div>
    )
}

export default BillingSetting
