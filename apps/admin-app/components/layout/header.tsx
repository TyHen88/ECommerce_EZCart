'use client'
import { DropdownMenuSetting } from '@/components/layout/dropdown-setting'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { Settings } from 'lucide-react'
import { useState } from 'react'

const HeaderProvider = () => {
    const [isOpenModeToggle, setIsOpenModeToggle] = useState(false);
    return (
        <header className="flex h-14 items-center overflow-x-hidden justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger className="shrink-0" />
            <div className="flex items-center w-8 mr-8">
                <ModeToggle open={isOpenModeToggle} setOpen={setIsOpenModeToggle} />
                <DropdownMenuSetting />
            </div>
        </header>
    )
}

export default HeaderProvider
