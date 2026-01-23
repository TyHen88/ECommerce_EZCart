"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type WhoAreYouModalProps = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export function WhoAreYouModal({ isOpen, setIsOpen }: WhoAreYouModalProps) {
    const handleRoleChange = (_role: "seller" | "user") => {
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader className="flex flex-col gap-2">
                    <DialogTitle>Are you a User or a Seller?</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center">
                    Let us know who you are so we can provide you with the best experience!
                </DialogDescription>
                <DialogFooter className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={() => handleRoleChange("user")}>
                        I'm here to shop
                    </Button>
                    <Button variant="default" onClick={() => handleRoleChange("seller")}>
                        I'm here to sell
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
