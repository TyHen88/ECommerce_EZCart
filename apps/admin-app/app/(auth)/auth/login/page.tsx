"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense, useCallback, useState } from "react";
import { toast } from "sonner";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        const result = await signIn("credentials", {
          user_name: user_name.trim(),
          password: password,
          redirect: false,
          callbackUrl,
        });

        if (result?.error) {
          setError("Admin credentials required");
          toast.error("Login failed. Please check your credentials.");
          if (process.env.NODE_ENV === "development") {
            console.error("Login error:", result.error);
          }
        } else if (result?.ok) {
          toast.success("Login successful");
          window.location.href = result.url ?? callbackUrl;
        } else {
          setError("Login failed. Please try again.");
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
        toast.error("Login failed. Please try again.");
        if (process.env.NODE_ENV === "development") {
          console.error("Login error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user_name, password, searchParams]
  );
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your username below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="username"
                    placeholder="username"
                    required
                    value={user_name}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
