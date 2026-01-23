"use client"

import React, { Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

type ProgressState = {
    isVisible: boolean
    percent: number
}

function RouteProgressContent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Fix hydration by ensuring client-side only rendering
    const [isClient, setIsClient] = React.useState(false)
    const [progress, setProgress] = React.useState<ProgressState>({
        isVisible: false,
        percent: 0,
    })

    // Ensure client-side rendering to prevent hydration mismatch
    React.useEffect(() => {
        setIsClient(true)
    }, [])

    const animationRef = React.useRef<number | null>(null)
    const hideTimeoutRef = React.useRef<number | null>(null)
    const startTimeRef = React.useRef<number | null>(null)
    const isNavigatingRef = React.useRef(false)

    const clearTimers = React.useCallback(() => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
        }
        if (hideTimeoutRef.current !== null) {
            window.clearTimeout(hideTimeoutRef.current)
            hideTimeoutRef.current = null
        }
    }, [])

    const startProgress = React.useCallback(() => {
        clearTimers()
        startTimeRef.current = Date.now()
        setProgress({ isVisible: true, percent: 8 })

        const tick = () => {
            setProgress((prev) => {
                if (!prev.isVisible) return prev
                const next = prev.percent + Math.max(0.2, (100 - prev.percent) * 0.02)
                const clamped = Math.min(next, 92)
                return { ...prev, percent: clamped }
            })
            animationRef.current = requestAnimationFrame(tick)
        }

        animationRef.current = requestAnimationFrame(tick)
    }, [clearTimers])

    const completeProgress = React.useCallback(() => {
        clearTimers()
        setProgress((prev) => ({ ...prev, percent: 100 }))

        // Ensure minimum display time of 200ms
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0
        const minDisplayTime = 200
        const remainingTime = Math.max(0, minDisplayTime - elapsed)

        // Give the CSS transition a moment, then hide and reset
        hideTimeoutRef.current = window.setTimeout(() => {
            setProgress({ isVisible: false, percent: 0 })
            startTimeRef.current = null
        }, 300 + remainingTime) as unknown as number
    }, [clearTimers])

    // Intercept link clicks to start progress immediately
    React.useEffect(() => {
        if (!isClient) return

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Find the closest anchor or link element
            const link = target.closest('a[href]')

            if (!link) return

            const href = link.getAttribute('href')
            if (!href) return

            // Skip if it's an external link, anchor link, or has target="_blank"
            if (
                href.startsWith('http') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                link.getAttribute('target') === '_blank' ||
                (href.startsWith('#') && href.length > 1)
            ) {
                return
            }

            // Skip if it's the same route
            const currentPath = window.location.pathname + window.location.search
            const normalizedHref = href.split('?')[0] // Compare paths without query params
            const normalizedCurrent = currentPath.split('?')[0]

            if (normalizedHref === normalizedCurrent && href === currentPath) {
                return
            }

            // Start progress immediately on click
            if (!isNavigatingRef.current) {
                isNavigatingRef.current = true
                startProgress()
            }
        }

        // Add click listener with capture phase to catch early
        document.addEventListener('click', handleClick, true)

        return () => {
            document.removeEventListener('click', handleClick, true)
        }
    }, [isClient, pathname, startProgress])

    // Complete progress when route actually changes
    const key = React.useMemo(() => `${pathname}?${searchParams?.toString() ?? ""}`, [pathname, searchParams])

    const isFirstLoadRef = React.useRef(true)
    const previousKeyRef = React.useRef<string | null>(null)

    React.useEffect(() => {
        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false
            previousKeyRef.current = key
            return
        }

        // Only complete if we were navigating and the route changed
        if (isNavigatingRef.current && previousKeyRef.current !== key) {
            previousKeyRef.current = key
            isNavigatingRef.current = false

            // Complete when the new route paint has occurred
            const afterPaint = () => completeProgress()
            let timeoutId: NodeJS.Timeout | null = null
            const raf = requestAnimationFrame(() => {
                // Allow a delay for data loading; complete after navigation is done
                timeoutId = window.setTimeout(afterPaint, 300) as unknown as NodeJS.Timeout
            })
            return () => {
                cancelAnimationFrame(raf)
                if (timeoutId) {
                    window.clearTimeout(timeoutId)
                }
            }
        } else {
            previousKeyRef.current = key
        }
    }, [key, completeProgress])

    if (!isClient || !progress.isVisible) return null

    return (
        <div
            aria-hidden
            className="fixed left-0 right-0 top-0 z-[9999] pointer-events-none"
            style={{
                height: 3,
            }}
        >
            <ProgressPrimitive.Root
                value={progress.percent}
                className={cn(
                    "relative h-full w-full overflow-hidden",
                    "bg-transparent"
                )}
            >
                <ProgressPrimitive.Indicator
                    className="h-full transition-all duration-300 ease-out shadow-lg shadow-blue-500/50"
                    style={{
                        transform: `translateX(-${100 - (progress.percent || 0)}%)`,
                        width: '100%',
                        backgroundColor: 'rgb(59, 130, 246)', // blue-500
                    }}
                />
            </ProgressPrimitive.Root>
        </div>
    )
}

export function RouteProgress() {
    return (
        <Suspense fallback={null}>
            <RouteProgressContent />
        </Suspense>
    )
}

export default RouteProgress


