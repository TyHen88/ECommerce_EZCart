'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Edit, Plus, Trash2, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import EditAddressDialog from "./EditAddressDialog"

type Address = {
    id: string
    type: "shipping" | "billing"
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
}

const AddressSettings = () => {
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: "1",
            type: "shipping",
            fullName: "John Doe",
            phone: "+1234567890",
            addressLine1: "123 Main Street",
            addressLine2: "Apt 4B",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "USA",
            isDefault: true
        }
    ])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [formData, setFormData] = useState<Omit<Address, "id">>({
        type: "shipping",
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        isDefault: false
    })

    const handleAddNew = () => {
        setEditingAddress(null)
        setFormData({
            type: "shipping",
            fullName: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            isDefault: addresses.length === 0
        })
        setIsDialogOpen(true)
    }

    const handleEdit = (address: Address) => {
        setEditingAddress(address)
        setFormData({
            type: address.type,
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || "",
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault
        })
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (editingAddress) {
            // Update existing address
            setAddresses(prev => prev.map(addr => {
                if (addr.id === editingAddress.id) {
                    // If setting as default, unset others
                    if (formData.isDefault) {
                        return { ...formData, id: addr.id }
                    }
                    return { ...formData, id: addr.id, isDefault: addr.isDefault }
                }
                // Unset default for other addresses if this one is default
                if (formData.isDefault) {
                    return { ...addr, isDefault: false }
                }
                return addr
            }))
        } else {
            // Add new address
            const newAddress: Address = {
                ...formData,
                id: Date.now().toString()
            }
            setAddresses(prev => {
                // If setting as default, unset others
                if (formData.isDefault) {
                    return prev.map(addr => ({ ...addr, isDefault: false })).concat(newAddress)
                }
                return prev.concat(newAddress)
            })
        }
        setIsDialogOpen(false)
        setEditingAddress(null)
    }

    const handleDelete = (id: string) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id))
    }

    const handleSetDefault = (id: string) => {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Delivery Addresses</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your shipping addresses for faster checkout
                    </p>
                </div>
                <Button onClick={handleAddNew} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Address
                </Button>
            </div>

            {/* Addresses List */}
            {addresses.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <MapPin className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                        <Button onClick={handleAddNew} variant="outline" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Your First Address
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {addresses.map((address) => (
                        <AccordionItem
                            key={address.id}
                            value={address.id}
                            className="border rounded-lg shadow-sm bg-card"
                        >
                            <Card className="border-0 shadow-none">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 w-full">
                                            <RadioGroup
                                                value={address.isDefault ? address.id : ""}
                                                onValueChange={() => handleSetDefault(address.id)}
                                                className="flex items-center my-1 sm:my-0"
                                            >
                                                <RadioGroupItem value={address.id} id={address.id} />
                                            </RadioGroup>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <Label
                                                        htmlFor={address.id}
                                                        className="text-base font-semibold cursor-pointer"
                                                    >
                                                        {address.fullName}
                                                    </Label>
                                                    {address.isDefault && (
                                                        <Badge variant="default" className="text-xs">
                                                            Default
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {address.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate max-w-full sm:max-w-[180px]">
                                                    {address.addressLine1 + (address.addressLine2 ? `, ${address.addressLine2}` : "")}
                                                </p>
                                                <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                                                    <p className="text-sm text-muted-foreground">
                                                        {address.city}, {address.state} {address.postalCode}
                                                    </p>
                                                    <span className="hidden sm:inline text-sm text-muted-foreground">|</span>
                                                    <p className="text-sm text-muted-foreground">{address.country}</p>
                                                    <span className="hidden sm:inline text-sm text-muted-foreground">|</span>
                                                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                                                </div>
                                                <div className="flex sm:hidden">
                                                    <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(address)}
                                                className="h-9 w-9"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(address.id)}
                                                className="h-9 w-9 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <AccordionTrigger className="px-6 pb-4 hover:no-underline">
                                    <span className="text-sm text-muted-foreground">View Details</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="pt-0 space-y-2">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Full Name:</span>
                                                <p className="font-medium">{address.fullName}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Phone:</span>
                                                <p className="font-medium">{address.phone}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-muted-foreground">Address Line 1:</span>
                                                <p className="font-medium">{address.addressLine1}</p>
                                            </div>
                                            {address.addressLine2 && (
                                                <div className="col-span-2">
                                                    <span className="text-muted-foreground">Address Line 2:</span>
                                                    <p className="font-medium">{address.addressLine2}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-muted-foreground">City:</span>
                                                <p className="font-medium">{address.city}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">State:</span>
                                                <p className="font-medium">{address.state}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Postal Code:</span>
                                                <p className="font-medium">{address.postalCode}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Country:</span>
                                                <p className="font-medium">{address.country}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}

            {/* Add/Edit Dialog */}
            <EditAddressDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                editingAddress={editingAddress}
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
            />
        </div>
    )
}

export default AddressSettings