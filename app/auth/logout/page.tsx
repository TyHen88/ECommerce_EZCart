"use client";

import { useEffect } from "react";
import { performLogout } from "@/utils/auth";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function LogoutPage() {
  useEffect(() => {
    performLogout("/");
  }, []);

  // Show loading state while logging out
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Logging out...</p>
      </div>
    </div>
  );
}
