"use client"
import { Header } from "@/components/header";
import { OrderDraftSheet } from "@/components/products/OrderDraftSheet";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function PaymentPage() {
    const [cardNumber, setCardNumber] = useState("")
    const [cardType, setCardType] = useState(null)
    const [isValid, setIsValid] = useState(null)
    const [expiryDate, setExpiryDate] = useState("")
    const [cvv, setCvv] = useState("")

    //Detect card type with luhn algorithm for card validation
    const luhnCheck = (cardNumber: string) => {
        const cleanNumber = cardNumber.replace(/\s/g, "")
        if (!/^[0-9]+$/.test(cleanNumber)) return false

        let sum = 0
        let isEven = false
        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber[i])
            if (isEven) {
                digit *= 2
                if (digit > 9) {
                    digit -= 9
                }
            }
            sum += digit
            isEven = !isEven
        }
        return sum % 10 === 0;
    };

    return (
        <div className="w-full h-full flex flex-col">
            <Header />
            <main className="min-h-screen bg-background w-full">
                <div className="w-full max-w-full py-8 px-4 md:px-6">
                    <div className="flex items-center mb-6">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold tracking-tight mb-2">Checkout</h1>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}