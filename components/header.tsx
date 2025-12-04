"use client"

import { SettingsDialog } from "@/components/profile-settings/SettingDialog"
import { Button } from "@/components/ui/button"
import useFetchProfile from "@/hooks/useFetchProfile"
import { UserInfo } from "@/lib/types"
import { History, LayoutDashboard, LogOut, Settings, ShoppingBag, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { OrderDraftSheet } from "./products/OrderDraftSheet"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import SignUpFlowModal from "./auth/SignUpFlowMain"

export function Header() {
  const [isOpenSignUpFlow, setIsOpenSignUpFlow] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpenSettingsMenu, setIsOpenSettingsMenu] = useState(false)
  const [isOpenSettings, setIsOpenSettings] = useState(false)
  const { data: userInfoData, isError, error, refetch, isFetching } = useFetchProfile()
  const [isOpenModeToggle, setIsOpenModeToggle] = useState(false)
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem('authToken') : null
    const userInfoStr = typeof window !== "undefined" ? localStorage.getItem('userInfo') : null

    if (token && userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr)
        setUser(userInfo)
      } catch (error) {
        console.error('Error parsing user info:', error)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem('authToken') : null
    if (token && !user) {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch])

  useEffect(() => {
    if (userInfoData && !user) {
      setUser(userInfoData as UserInfo)
      if (typeof window !== "undefined") {
        localStorage.setItem('userInfo', JSON.stringify(userInfoData))
      }
    }
  }, [userInfoData, user])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('authToken')
      localStorage.removeItem('tokenType')
      localStorage.removeItem('userInfo')
    }
    setUser(null)
    if (window?.location) {
      window.location.href = '/'
    } else {
      router.push("/")
    }
  }

  const isAdmin = userInfoData?.data?.role === "admin"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-full h-16 px-4 md:px-6 flex items-center justify-between mx-auto">
        {/* Left (Logo/brand) */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 min-w-0">
            <Image src="/easycarts-128x128.png" alt="EZ-Carts.com" width={32} height={32} className="shrink-0" />
            <span className="font-bold text-xl truncate max-w-[120px] sm:max-w-none">
              EZ-Carts.com
            </span>
          </Link>
        </div>

        {/* Center (optional for gap) */}
        {/* <div className="flex-1 flex justify-center" /> */}

        {/* Right navigation/actions */}
        <nav className="flex items-center w-full">
          {/* Centered navigation links and greeting */}
          <div className="flex flex-1 items-center gap-3 sm:gap-4 justify-center">
            <Link href="/products" className="hidden sm:block justify-center">
              <Button variant="ghost" tabIndex={0}>
                Products
              </Button>
            </Link>
            <Link href="/shop" className="hidden sm:block">
              <Button variant="ghost" tabIndex={0}>
                Shops
              </Button>
            </Link>
            {userInfoData?.data?.username && (
              <div className="text-xs text-muted-foreground flex items-center h-8 whitespace-nowrap">
                Welcome, {userInfoData.data.username}
              </div>
            )}
          </div>
          {/* End aligned icons and popover */}
          <div className="flex items-center gap-3 sm:gap-4 justify-end ml-auto">
            <div className="flex items-center">
              <OrderDraftSheet />
            </div>
            <Popover open={isOpenSettingsMenu} onOpenChange={setIsOpenSettingsMenu}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open Settings Menu"
                  className="p-2"
                  tabIndex={0}
                  type="button"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-60 min-w-[210px] px-0 py-2"
                sideOffset={10}
              >
                {user ? (
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={userInfoData?.data?.profileImageUrl as string || "/profile.jpg"}
                          alt="Profile"
                          width={36}
                          height={36}
                          className="rounded-full object-cover w-9 h-9"
                        />
                        {userInfoData?.data?.active && (
                          <span
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-blue-500"
                            title="Active"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate max-w-[110px]">
                          {userInfoData?.data?.username || "User"}
                        </div>
                        <div className="text-xs truncate text-muted-foreground max-w-[110px]">
                          {userInfoData?.data?.email as string || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-1">
                      <div
                        onClick={e => {
                          e.stopPropagation();
                          setIsOpenSettings(true);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start w-full"
                          tabIndex={0}
                          type="button"
                          onClick={() => router.push("/setting")}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Edit Profile / Settings
                        </Button>
                      </div>
                      <Link href="/products" className="sm:hidden w-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start w-full"
                          tabIndex={0}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Products
                        </Button>
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="w-full">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start w-full"
                            tabIndex={0}
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin
                          </Button>
                        </Link>
                      )}
                      <div
                        onClick={e => {
                          e.stopPropagation();
                          handleLogout();
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start w-full"
                          tabIndex={0}
                          type="button"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>

                      <ModeToggle open={isOpenModeToggle} setOpen={setIsOpenModeToggle} />
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 grid gap-2">
                    <Link href="/auth/login" className="w-full">
                      <Button variant="ghost" size="sm" className="justify-start w-full" tabIndex={0}>
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </Link>

                    <Button variant="default" size="sm" className="justify-start w-full" tabIndex={0} onClick={() => setIsOpenSignUpFlow(true)}>
                      Sign Up
                    </Button>
                    <Link href="/products" className="sm:hidden w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start w-full"
                        tabIndex={0}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Products
                      </Button>
                    </Link>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </nav>
      </div>
      <SignUpFlowModal isOpen={isOpenSignUpFlow} setIsOpen={setIsOpenSignUpFlow} />
    </header >
  )
}
