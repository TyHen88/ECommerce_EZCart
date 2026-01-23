"use client";

import { WhoAreYouModal } from "@/components/shared/common/whoareyou-modal";
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
import { Separator } from "@/components/ui/separator";
import { initiateGoogleLogin } from "@/utils/googleOAuth";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState, useCallback, Suspense } from "react";
import { toast } from "sonner";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpenSignUpFlow, setIsOpenSignUpFlow] = useState(false);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const result = await signIn("credentials", {
          user_name: user_name.trim(),
          password: password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid username or password");
          toast.error("Login failed. Please check your credentials.");
          if (process.env.NODE_ENV === "development") {
            console.error("Login error:", result.error);
          }
        } else if (result?.ok) {
          toast.success("Login successful");

          // Wait for session to be established and refresh it
          try {
            // Wait a moment for the session to be created
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Force session refresh to ensure it's available
            const session = await getSession();

            if (session?.accessToken) {
              // Get callback URL from query params or default to /products
              const callbackUrl =
                searchParams.get("callbackUrl") || "/products";

              // Use window.location for a full page reload to ensure session is available
              window.location.href = callbackUrl;
            } else {
              // Fallback: use router if session not immediately available
              const callbackUrl =
                searchParams.get("callbackUrl") || "/dashboard";
              router.push(callbackUrl);
              router.refresh();
            }
          } catch (sessionError) {
            // Fallback: redirect anyway
            const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
            router.push(callbackUrl);
            router.refresh();
          }
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
    [user_name, password, router]
  );

  const handleGoogleLogin = useCallback(() => {
    initiateGoogleLogin();
  }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Welcome back!
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

              <div className="flex items-center gap-2 justify-center w-full mt-6 mb-2">
                <Separator className="inline-block flex-1" />
                <span className="inline-block text-muted-foreground text-sm px-2">
                  or
                </span>
                <Separator className="inline-block flex-1" />
              </div>
              {/* Google OAuth2 */}
              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => setIsOpenSignUpFlow(true)}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <WhoAreYouModal
        isOpen={isOpenSignUpFlow}
        setIsOpen={setIsOpenSignUpFlow}
      />
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
