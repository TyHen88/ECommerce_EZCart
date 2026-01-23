"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";

function OAuth2RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusState, setStatusState] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      // Get token and type from URL params
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (!token || !type) {
        setStatusState("error");
        setErrorMessage("Missing authentication credentials");
        return;
      }

      try {
        // Store the token in localStorage for the HTTP client to use
        localStorage.setItem("authToken", token);
        localStorage.setItem("tokenType", type);

        // Decode JWT to get user info
        let userInfo = null;
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("JWT Payload:", payload);

          userInfo = {
            id: payload.id,
            username: payload.username,
            role: payload.role || "user",
          };

          // Store user info in localStorage
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        } catch (decodeError) {
          console.warn("Could not decode JWT:", decodeError);
        }

        setStatusState("success");
        toast.success("Authentication successful");

        // Trigger session ready event for profile fetch
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("sessionReady", { detail: { token } })
          );
        }

        // Wait a moment for storage and events to be processed
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Use full page reload to ensure session is available and profile is fetched
        const callbackUrl = searchParams.get("callbackUrl") || "/products";
        window.location.href = callbackUrl;
      } catch (error) {
        console.error("OAuth redirect error:", error);
        setStatusState("error");
        setErrorMessage("An unexpected error occurred");
        toast.error("Authentication failed", {
          description: "An unexpected error occurred",
        });
      }
    };

    handleOAuth2Redirect();
  }, [searchParams, router]);

  // Modified container to always center spinner correctly on mobile and desktop
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
      {statusState === "loading" && (
        <div className="flex flex-col items-center justify-center gap-6 w-full h-full">
          <h1 className="text-2xl font-bold">Welcome back!</h1>
        </div>
      )}
      {statusState === "error" && (
        <div className="text-center space-y-3 max-w-md px-4">
          <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-destructive mb-1">
              Authentication Failed
            </h3>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

OAuth2RedirectContent.getLayout = (page: React.ReactElement) => page;

export default function OAuth2Redirect() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center gap-6 w-full h-full">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
      }
    >
      <OAuth2RedirectContent />
    </Suspense>
  );
}
