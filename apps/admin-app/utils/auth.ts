/**
 * Authentication utility functions
 * Centralized auth operations for reusability and consistency
 */

import { signOut } from "next-auth/react";
import { useAuthStore } from "@/stores/auth.store";

const AUTH_STORAGE_KEYS = {
  TOKEN: "authToken",
  TOKEN_TYPE: "tokenType",
  USER_INFO: "userInfo",
  AUTH_STORAGE: "auth-storage",
} as const;

/**
 * Clears all authentication-related data from localStorage
 */
export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;

  Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Stores access token in localStorage for HTTP interceptor
 */
export function storeAuthToken(token: string, tokenType: string = "Bearer"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN_TYPE, tokenType);
}

/**
 * Gets access token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
}

/**
 * Removes access token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_TYPE);
}

/**
 * Comprehensive logout function that clears all auth state
 * @param redirectUrl - Optional URL to redirect after logout (default: "/")
 */
export async function performLogout(redirectUrl: string = "/"): Promise<void> {
  try {
    // Clear localStorage
    clearAuthStorage();

    // Clear Zustand auth store
    useAuthStore.getState().logout();

    // Sign out from NextAuth
    await signOut({
      redirect: false,
    });

    // Force page reload to ensure all state is cleared
    if (typeof window !== "undefined") {
      window.location.href = redirectUrl;
    }
  } catch (error) {
    console.error("Logout error:", error);
    // Ensure cleanup even if signOut fails
    clearAuthStorage();
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = redirectUrl;
    }
  }
}

/**
 * Checks if user is authenticated (has token in localStorage)
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
