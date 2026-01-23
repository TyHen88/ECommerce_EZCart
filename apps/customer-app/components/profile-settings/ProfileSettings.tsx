'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Camera, Calendar, ChevronDown } from "lucide-react"
import AddressSettings from "./AddressSettings"

type CollapsibleSection = {
    id: string
    title: string
    icon: React.ReactNode
}

type ProfileSettingsProps = {
    sections: CollapsibleSection[]
    profileImageUrl: string
    firstName: string
    secondName: string
    nickname: string
    dateOfBirth: string
    gender: string
    country: string
    userInfoData: any
    setFirstName: (value: string) => void
    setSecondName: (value: string) => void
    setNickname: (value: string) => void
    setDateOfBirth: (value: string) => void
    setGender: (value: string) => void
    setCountry: (value: string) => void
}

const ProfileSettings = ({
    sections,
    profileImageUrl,
    firstName,
    secondName,
    nickname,
    dateOfBirth,
    gender,
    country,
    userInfoData,
    setFirstName,
    setSecondName,
    setNickname,
    setDateOfBirth,
    setGender,
    setCountry,
}: ProfileSettingsProps) => {
    return (
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
    )
}

export default ProfileSettings