"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCartStore } from "@/stores/cart.store"
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

type CheckoutStep = "information" | "shipping" | "payment"

export default function CheckoutPage() {
    const { items, totalPrice } = useCartStore()
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("information")

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        country: "",
        state: "",
        address: "",
        city: "",
        postalCode: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleNext = () => {
        if (currentStep === "information") {
            setCurrentStep("shipping")
        } else if (currentStep === "shipping") {
            setCurrentStep("payment")
        }
    }

    const handleBack = () => {
        if (currentStep === "shipping") {
            setCurrentStep("information")
        } else if (currentStep === "payment") {
            setCurrentStep("shipping")
        }
    }

    const subtotal = totalPrice
    const shipping = 0 // Will be calculated at next step
    const total = subtotal + shipping

    if (items.length === 0) {
        return (
            <div className="w-full h-full flex flex-col min-h-screen bg-background">
                <main className="flex-1 flex items-center justify-center px-4">
                    <Card className="max-w-md w-full">
                        <CardContent className="p-8 text-center">
                            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                            <p className="text-muted-foreground mb-6">Add some items to your cart before checkout</p>
                            <Link href="/products">
                                <Button>Continue Shopping</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col min-h-screen bg-background">
            <main className="flex-1 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/products">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">CHECKOUT</h1>
                    </div>

                    {/* Steps Navigation */}
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b">
                        <button
                            onClick={() => setCurrentStep("information")}
                            className={`text-sm font-medium transition-colors ${currentStep === "information"
                                ? "text-foreground font-bold"
                                : "text-muted-foreground"
                                }`}
                        >
                            INFORMATION
                        </button>
                        <div className="h-4 w-px bg-border" />
                        <button
                            onClick={() => currentStep !== "information" && setCurrentStep("shipping")}
                            className={`text-sm font-medium transition-colors ${currentStep === "shipping"
                                ? "text-foreground font-bold"
                                : currentStep === "information"
                                    ? "text-muted-foreground"
                                    : "text-muted-foreground/50"
                                }`}
                            disabled={currentStep === "information"}
                        >
                            SHIPPING
                        </button>
                        <div className="h-4 w-px bg-border" />
                        <button
                            onClick={() => currentStep === "payment" && setCurrentStep("payment")}
                            className={`text-sm font-medium transition-colors ${currentStep === "payment"
                                ? "text-foreground font-bold"
                                : "text-muted-foreground/50"
                                }`}
                            disabled={currentStep !== "payment"}
                        >
                            PAYMENT
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Checkout Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {currentStep === "information" && (
                                <>
                                    {/* Contact Info */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-4 uppercase tracking-wide">CONTACT INFO</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">Phone</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-4 uppercase tracking-wide">SHIPPING ADDRESS</h2>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="firstName">First Name</Label>
                                                    <Input
                                                        id="firstName"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="lastName">Last Name</Label>
                                                    <Input
                                                        id="lastName"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleInputChange}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="country">Country</Label>
                                                <div className="relative mt-1">
                                                    <select
                                                        id="country"
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleInputChange}
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                                                    >
                                                        <option value="">Select Country</option>
                                                        <option value="US">United States</option>
                                                        <option value="CA">Canada</option>
                                                        <option value="UK">United Kingdom</option>
                                                        <option value="AU">Australia</option>
                                                        <option value="DE">Germany</option>
                                                        <option value="FR">France</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="state">State / Region</Label>
                                                <Input
                                                    id="state"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="address">Address</Label>
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="city">City</Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="postalCode">Postal Code</Label>
                                                    <Input
                                                        id="postalCode"
                                                        name="postalCode"
                                                        value={formData.postalCode}
                                                        onChange={handleInputChange}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button onClick={handleNext} className="w-full sm:w-auto group">
                                            Shipping
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </>
                            )}
                            {/* 
                              Shipping Step: 
                              This checkout step allows the user to select a shipping method for their order.
                              In a typical e-commerce flow, options such as standard, express, or free shipping (if eligible)
                              would be presented here. The user will choose their preferred shipping method before moving on to payment.
                              This feature is essential to provide flexibility and transparency in delivery options for the user.
                              TODO: Implement real shipping options and rate calculation.
                            */}
                            {currentStep === "shipping" && (
                                <div>
                                    <h2 className="text-lg font-semibold mb-4 uppercase tracking-wide">SHIPPING METHOD</h2>
                                    <Card>
                                        <CardContent className="p-6">
                                            <p className="text-muted-foreground">
                                                Select how you prefer your order to be shipped. (Shipping options coming soon.)
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <div className="flex gap-4 pt-4">
                                        <Button variant="outline" onClick={handleBack}>
                                            <ArrowLeft className="mr-2 w-4 h-4" />
                                            Back
                                        </Button>
                                        <Button onClick={handleNext} className="group">
                                            Payment
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === "payment" && (
                                <div>
                                    <h2 className="text-lg font-semibold mb-4 uppercase tracking-wide">PAYMENT</h2>
                                    <Card>
                                        <CardContent className="p-6">
                                            <p className="text-muted-foreground">Payment options will be available here</p>
                                        </CardContent>
                                    </Card>
                                    <div className="flex gap-4 pt-4">
                                        <Button variant="outline" onClick={handleBack}>
                                            <ArrowLeft className="mr-2 w-4 h-4" />
                                            Back
                                        </Button>
                                        <Button className="group">
                                            Complete Order
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-8">
                                <CardHeader>
                                    <CardTitle className="text-lg uppercase tracking-wide">
                                        YOUR ORDER <span className="text-muted-foreground">({items.length})</span>
                                        {/* Note: Currently, checkout supports items from a single product's seller only. It's not for Multi-seller */}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Cart Items */}
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                                                    {item.image_url ? (
                                                        <Image
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.name}</h3>
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {item.category || "General"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mb-2">
                                                        Quantity: ({item.quantity})
                                                    </p>
                                                    <button className="text-xs text-primary hover:underline">
                                                        Change
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Totals */}
                                    <div className="border-t pt-4 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="text-muted-foreground text-xs">
                                                {currentStep === "information"
                                                    ? "Calculated at next step"
                                                    : `$${shipping.toFixed(2)}`}
                                            </span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between">
                                            <span className="font-semibold">Total</span>
                                            <span className="font-bold text-lg">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
