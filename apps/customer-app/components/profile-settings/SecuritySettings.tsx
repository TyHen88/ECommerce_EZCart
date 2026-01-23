import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
import { LockIcon } from "lucide-react"

type CollapsibleSection = {
    id: string
    title: string
    icon: React.ReactNode
}

type SecuritySettingsProps = {
    sections: CollapsibleSection[]
    userInfoData: any
}

const SecuritySettings = ({ sections }: SecuritySettingsProps) => {
    return (
        <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
            defaultValue="security"
        >
            <AccordionItem value="security">
                <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                        <LockIcon className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">Security Settings</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div>
                        <h1>Security Settings</h1>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default SecuritySettings