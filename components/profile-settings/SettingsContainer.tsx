'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    User,
    RefreshCw,
    MessageSquare,
    Bell,
    Percent,
    Wallet,
    HelpCircle,
    LogOut,
    Trash2,
    ChevronDown,
    CheckCircle2,
    Mail,
    Truck,
    Users,
    Calendar,
    Camera
} from "lucide-react"
import useFetchProfile from "@/hooks/useFetchProfile"
import { useRouter } from "next/navigation"
import SettingSkeleton from "../shared/SettingSkeleton"
import AddressSettings from "./AddressSettings"

type MenuItem = {
    id: string
    label: string
    icon: React.ReactNode
    variant?: "default" | "destructive"
    action?: () => void
}

type CollapsibleSection = {
    id: string
    title: string
    icon: React.ReactNode
}

const SettingsContainer = () => {
    const router = useRouter()
    const { data: userInfoData, isLoading } = useFetchProfile()
    const [activeMenu, setActiveMenu] = useState("profile")
    const sections: CollapsibleSection[] = [
        { id: "personal-info", title: "Personal Info", icon: <User className="w-5 h-5" /> },
        { id: "security", title: "Security", icon: <CheckCircle2 className="w-5 h-5" /> },
        { id: "contact-info", title: "Contact Info", icon: <Mail className="w-5 h-5" /> },
        { id: "delivery-address", title: "Delivery address", icon: <Truck className="w-5 h-5" /> },
        { id: "interests", title: "Interests", icon: <Users className="w-5 h-5" /> },
        { id: "additional-info", title: "Additional Info", icon: <Users className="w-5 h-5" /> },
    ]

    // Form state
    const [firstName, setFirstName] = useState("")
    const [secondName, setSecondName] = useState("")
    const [nickname, setNickname] = useState("Not specified")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [gender, setGender] = useState("Female")
    const [country, setCountry] = useState("Ukraine")

    useEffect(() => {
        if (userInfoData?.data) {
            const fullName = userInfoData.data.fullName || ""
            const nameParts = fullName.split(" ")
            setFirstName(nameParts[0] || "")
            setSecondName(nameParts.slice(1).join(" ") || "")
            setNickname(userInfoData.data.username || "Not specified")
        }
    }, [userInfoData])

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem('authToken')
            localStorage.removeItem('tokenType')
            localStorage.removeItem('userInfo')
        }
        router.push("/")
    }

    const handleDeleteAccount = () => {
        // TODO: Implement delete account functionality
        console.log("Delete account")
    }

    const menuItems: MenuItem[] = [
        { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
        { id: "order-history", label: "Order History", icon: <RefreshCw className="w-5 h-5" /> },
        { id: "reviews", label: "My Reviews", icon: <MessageSquare className="w-5 h-5" /> },
        { id: "offers", label: "Personal Offers", icon: <Bell className="w-5 h-5" /> },
        { id: "discounts", label: "Discounts and Bonuses", icon: <Percent className="w-5 h-5" /> },
        { id: "wallet", label: "My Wallet", icon: <Wallet className="w-5 h-5" /> },
        { id: "help", label: "Help or Complaint", icon: <HelpCircle className="w-5 h-5" /> },
        { id: "logout", label: "Log out", icon: <LogOut className="w-5 h-5" />, action: handleLogout },
        { id: "delete", label: "Delete Account", icon: <Trash2 className="w-5 h-5" />, variant: "destructive", action: handleDeleteAccount },
    ]

    const userData = userInfoData?.data
    const profileImageUrl = userData?.profileImageUrl || "/placeholder.svg"

    if (isLoading) return <SettingSkeleton />

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Sidebar Navigation */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveMenu(item.id)
                                    if (item.action) {
                                        item.action()
                                    }
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                                    ${activeMenu === item.id
                                        ? "bg-primary text-primary-foreground"
                                        : item.variant === "destructive"
                                            ? "text-destructive hover:bg-destructive/10"
                                            : "hover:bg-accent hover:text-accent-foreground"
                                    }
                                `}
                            >
                                {item.icon}
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Right Content Area */}
                <div className="flex-1 min-w-0">
                    {activeMenu === "profile" && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-3xl font-bold mb-2">PERSONAL DATA</h1>
                                <p className="text-muted-foreground">
                                    Enter your personal data so that you do not have to fill it in manually when placing an order.
                                </p>
                            </div>

                            {/* Collapsible Sections */}
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full space-y-4"
                                defaultValue="personal-info"
                            >
                                {sections.map((section) => (
                                    <AccordionItem
                                        key={section.id}
                                        value={section.id}
                                        className="border rounded-lg px-6 shadow-sm bg-card"
                                    >
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                {section.icon}
                                                <h3 className="text-lg font-semibold">{section.title}</h3>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-6">
                                            {section.id === "personal-info" && (
                                                <div className="space-y-6">
                                                    {/* Profile Picture */}
                                                    <div className="flex items-center gap-6">
                                                        <div className="relative">
                                                            <Avatar className="w-24 h-24">
                                                                <AvatarImage src={profileImageUrl} alt="Profile" />
                                                                <AvatarFallback>
                                                                    {firstName?.[0] || "U"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <label
                                                                htmlFor="profile-picture"
                                                                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                                                            >
                                                                <Camera className="w-4 h-4" />
                                                                <input
                                                                    type="file"
                                                                    id="profile-picture"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Form Fields */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="first-name">
                                                                First Name <span className="text-destructive">*</span>
                                                            </Label>
                                                            <Input
                                                                id="first-name"
                                                                value={firstName}
                                                                onChange={(e) => setFirstName(e.target.value)}
                                                                placeholder="Enter first name"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="second-name">
                                                                Second Name <span className="text-destructive">*</span>
                                                            </Label>
                                                            <Input
                                                                id="second-name"
                                                                value={secondName}
                                                                onChange={(e) => setSecondName(e.target.value)}
                                                                placeholder="Enter second name"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="nickname">Nickname</Label>
                                                            <Input
                                                                id="nickname"
                                                                value={nickname}
                                                                onChange={(e) => setNickname(e.target.value)}
                                                                placeholder="Enter nickname"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="date-of-birth">Date of Birth</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="date-of-birth"
                                                                    type="text"
                                                                    value={dateOfBirth}
                                                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                                                    placeholder="DD.MM.YYYY"
                                                                />
                                                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="gender">Gender</Label>
                                                            <div className="relative">
                                                                <select
                                                                    id="gender"
                                                                    value={gender}
                                                                    onChange={(e) => setGender(e.target.value)}
                                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                                >
                                                                    <option value="Female">Female</option>
                                                                    <option value="Male">Male</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="country">
                                                                Country <span className="text-destructive">*</span>
                                                            </Label>
                                                            <div className="relative">
                                                                <select
                                                                    id="country"
                                                                    value={country}
                                                                    onChange={(e) => setCountry(e.target.value)}
                                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                                >
                                                                    <option value="Ukraine">Ukraine</option>
                                                                    <option value="USA">USA</option>
                                                                    <option value="UK">UK</option>
                                                                    <option value="Canada">Canada</option>
                                                                    <option value="Germany">Germany</option>
                                                                </select>
                                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-3 pt-4">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                // Reset form
                                                                if (userInfoData?.data) {
                                                                    const fullName = userInfoData.data.fullName || ""
                                                                    const nameParts = fullName.split(" ")
                                                                    setFirstName(nameParts[0] || "")
                                                                    setSecondName(nameParts.slice(1).join(" ") || "")
                                                                    setNickname(userInfoData.data.username || "Not specified")
                                                                }
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={() => {
                                                                // TODO: Implement save functionality
                                                                console.log("Save changes", {
                                                                    firstName,
                                                                    secondName,
                                                                    nickname,
                                                                    dateOfBirth,
                                                                    gender,
                                                                    country
                                                                })
                                                            }}
                                                        >
                                                            Save Changes
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {section.id === "security" && (
                                                <div className="space-y-4">
                                                    <p className="text-muted-foreground">Security settings coming soon...</p>
                                                </div>
                                            )}

                                            {section.id === "contact-info" && (
                                                <div className="space-y-4">
                                                    <p className="text-muted-foreground">Contact info settings coming soon...</p>
                                                </div>
                                            )}

                                            {section.id === "delivery-address" && (
                                                <div className="space-y-4">
                                                    <AddressSettings />
                                                </div>
                                            )}

                                            {section.id === "interests" && (
                                                <div className="space-y-4">
                                                    <p className="text-muted-foreground">Interests settings coming soon...</p>
                                                </div>
                                            )}

                                            {section.id === "additional-info" && (
                                                <div className="space-y-4">
                                                    <p className="text-muted-foreground">Additional info settings coming soon...</p>
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}

                    {activeMenu !== "profile" && (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-muted-foreground">
                                {menuItems.find(item => item.id === activeMenu)?.label} section coming soon...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SettingsContainer
