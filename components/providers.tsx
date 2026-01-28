"use client";

import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import type { Session } from "next-auth";

// Component to sync session accessToken to localStorage and trigger profile refresh
function SessionTokenSync() {
  const { data: session, status, update: updateSession } = useSession({
    required: false,
  });
  const prevTokenRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    const currentToken = session?.accessToken;

    // Only update localStorage if token actually changed
    if (status === "authenticated" && currentToken) {
      if (currentToken !== prevTokenRef.current) {
        localStorage.setItem("authToken", currentToken);
        localStorage.setItem("tokenType", "Bearer");
        prevTokenRef.current = currentToken;

        // Trigger a custom event to notify components that session is ready
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("sessionReady", { detail: { token: currentToken } })
          );
        }
      }
    } else if (status === "unauthenticated" && prevTokenRef.current) {
      // Clear token if session is null and we had a token before
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenType");
      prevTokenRef.current = undefined;

      // Trigger session cleared event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("sessionCleared"));
      }
    }
  }, [session?.accessToken, status]);

  // Refresh session periodically to keep it up to date
  React.useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      updateSession();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [session, updateSession]);

  return null;
}

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <SessionTokenSync />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { pointerEvents: "auto" },
            duration: 4000,
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
