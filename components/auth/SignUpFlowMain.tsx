"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingBag, Store, Sparkles } from 'lucide-react';
import { useRouter } from "next/navigation"

interface SignUpFlowModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const SignUpFlowModal = ({ isOpen, setIsOpen }: SignUpFlowModalProps) => {
    const router = useRouter()

    const handleRoleChange = (role: "seller" | "user") => {
        setIsOpen(false)
        if (role === "seller") {
            router.push("/auth/sign-up/seller")
        } else {
            router.push("/auth/sign-up/user")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="flex flex-col items-center max-w-md sm:max-w-lg">
                <DialogHeader className="flex flex-col items-center gap-4 w-full">
                    <Avatar className="w-28 h-28 border-4 border-primary/10 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-5xl">
                            👋
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <DialogTitle className="text-center text-2xl sm:text-3xl font-bold">
                            Welcome aboard!
                        </DialogTitle>
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <DialogDescription className="text-center text-base sm:text-lg space-y-3 px-4">
                        <p className="text-foreground/70">
                            We're excited to have you here. Let's get you set up with the right experience.
                        </p>
                        <p className="font-semibold text-foreground text-lg">
                            What would you like to do?
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 justify-center w-full mt-4 px-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleRoleChange("user")}
                        className="flex items-center justify-center gap-3 w-full sm:flex-1 hover:bg-primary/5 hover:border-primary/50 transition-all hover:shadow-md group"
                    >
                        <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Browse & Shop</span>
                    </Button>
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => handleRoleChange("seller")}
                        className="flex items-center justify-center gap-3 w-full sm:flex-1 hover:shadow-lg transition-all group"
                    >
                        <Store className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Start Selling</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SignUpFlowModal