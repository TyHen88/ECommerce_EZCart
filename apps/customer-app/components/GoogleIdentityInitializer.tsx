"use client"

import { useEffect } from "react"
import { toast } from "sonner"

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string
                        callback: (response: { credential: string }) => void
                        auto_select?: boolean
                        cancel_on_tap_outside?: boolean
                        itp_support?: boolean
                    }) => void
                    prompt: (notification?: (notification: {
                        isNotDisplayed: boolean
                        isSkippedMoment: boolean
                        isDismissedMoment: boolean
                        getNotDisplayedReason?: () => string
                        getSkippedReason?: () => string
                        getDismissedReason?: () => string
                    }) => void) => void
                    renderButton: (element: HTMLElement, config: { theme?: string; size?: string }) => void
                    disableAutoSelect: () => void
                }
            }
        }
    }
}

const SCRIPT_CHECK_INTERVAL = 100
const MAX_SCRIPT_LOAD_ATTEMPTS = 100
const ONE_TAP_DELAY = 200
const RELOAD_DELAY = 500

const FEDCM_ERROR_PATTERNS = ['FedCM', 'IdentityCredentialError', '[GSI_LOGGER]']
const SUPPRESSED_ERROR_PATTERNS = ['HTTP Response Error', 'NetworkError', 'Failed to fetch']

export function GoogleIdentityInitializer() {
    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

        if (!clientId) {
            return
        }

        const originalError = console.error
        console.error = (...args) => {
            const message = args[0]?.toString() || ''
            const secondArg = args[1]?.toString() || ''

            // Suppress FedCM and GSI logger errors
            if (FEDCM_ERROR_PATTERNS.some(pattern => message.includes(pattern))) {
                return
            }

            // Suppress HTTP response errors with empty objects
            if (
                SUPPRESSED_ERROR_PATTERNS.some(pattern => message.includes(pattern)) &&
                (secondArg === '[object Object]' || secondArg === '{}' || !secondArg)
            ) {
                return
            }

            originalError.apply(console, args)
        }

        const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("authToken")

        const handleCredentialResponse = async (response: { credential: string }) => {
            let loadingToast: string | number | undefined

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888"
                const apiEndpoint = `${apiUrl}/oauth2/callback/google`

                loadingToast = toast.loading("Signing in with Google...")

                let res: Response
                try {
                    res = await fetch(apiEndpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: response.credential }),
                    })
                } catch (networkError: any) {
                    throw new Error(
                        networkError?.message || "Network error. Please check your connection."
                    )
                }

                toast.dismiss(loadingToast)
                loadingToast = undefined

                if (!res.ok) {
                    let errorMessage = `Authentication failed (${res.status})`
                    try {
                        const errorData = await res.json()
                        errorMessage = errorData.message || errorMessage
                    } catch {
                        // Response is not JSON, use status text
                        errorMessage = res.statusText || errorMessage
                    }
                    throw new Error(errorMessage)
                }

                let data: any
                try {
                    data = await res.json()
                } catch (parseError) {
                    throw new Error("Invalid response format from server")
                }

                if (!data?.token) {
                    throw new Error("No token received from backend")
                }

                localStorage.setItem("authToken", data.token)
                localStorage.setItem("tokenType", "Bearer")
                if (data.user) {
                    localStorage.setItem("userInfo", JSON.stringify(data.user))
                }

                toast.success("Successfully signed in!", {
                    description: "Welcome back!",
                })

                // Trigger session ready event for profile fetch
                if (typeof window !== "undefined") {
                    window.dispatchEvent(
                        new CustomEvent("sessionReady", { detail: { token: data.token } })
                    );
                }

                // Wait a moment for storage and events to be processed
                await new Promise(resolve => setTimeout(resolve, 300))

                // Use full page navigation to ensure session is available and profile is fetched
                window.location.href = "/products"
            } catch (err: any) {
                if (loadingToast) {
                    toast.dismiss(loadingToast)
                }

                const errorMessage = err?.message || "Something went wrong. Please try again."

                // Only log to console if it's not a network/HTTP error (those are expected)
                if (!err?.message?.includes("Network") && !err?.message?.includes("HTTP")) {
                    console.error("❌ Error authenticating with Google:", err)
                }

                toast.error("Authentication failed", {
                    description: errorMessage,
                    duration: 5000,
                })
            }
        }

        const showOneTapPrompt = () => {
            setTimeout(() => {
                try {
                    window.google?.accounts?.id?.prompt(() => {
                        // No logging
                    })
                } catch {
                    // No logging
                }
            }, ONE_TAP_DELAY)
        }

        // Unnecessary verbose logConfigurationHelp removed since it only logs

        const initializeGoogleIdentity = () => {
            if (!window.google?.accounts?.id) {
                return
            }

            try {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    itp_support: true,
                })

                if (!isLoggedIn) {
                    showOneTapPrompt()
                }
            } catch (error: any) {
                console.error("❌ Error initializing Google Identity Services:", error)

                const errorMessage = error?.message?.toLowerCase() || ''
                if (errorMessage.includes('origin') || errorMessage.includes('authorization')) {
                    // Nothing: all logging removed
                }
            }
        }

        let checkGoogleScript: NodeJS.Timeout | null = null
        let mounted = true

        if (window.google?.accounts?.id) {
            initializeGoogleIdentity()
        } else {
            let attempts = 0

            checkGoogleScript = setInterval(() => {
                if (!mounted) {
                    if (checkGoogleScript) clearInterval(checkGoogleScript)
                    return
                }

                attempts++

                if (window.google?.accounts?.id) {
                    if (checkGoogleScript) clearInterval(checkGoogleScript)
                    initializeGoogleIdentity()
                } else if (attempts >= MAX_SCRIPT_LOAD_ATTEMPTS) {
                    if (checkGoogleScript) clearInterval(checkGoogleScript)
                    console.error("❌ Google Identity Services script failed to load after 10s")
                    toast.error("Google Sign-In unavailable", {
                        description: "The Google authentication script could not be loaded",
                        duration: 5000,
                    })
                }
            }, SCRIPT_CHECK_INTERVAL)
        }

        return () => {
            mounted = false
            console.error = originalError

            if (checkGoogleScript) {
                clearInterval(checkGoogleScript)
            }

            try {
                window.google?.accounts?.id?.disableAutoSelect()
            } catch {
                // Ignore cleanup errors
            }
        }
    }, [])

    return null
}