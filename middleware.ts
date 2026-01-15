import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import {
  isAdminRoute,
  isAuthRoute,
  isProtectedRoute,
  isPublicApiRoute,
  isPublicRoute,
} from "@/lib/routes";

export default withAuth(
  async function middleware(req) {
    const token = (req as any).nextauth?.token;
    const pathname = req.nextUrl.pathname;
    const isAuthenticated = !!token;
    const userRole = (token?.user as any)?.role || (token as any)?.role;

    // Allow NextAuth API routes
    if (isPublicApiRoute(pathname)) {
      return NextResponse.next();
    }

    // Check route types
    const isAdmin = isAdminRoute(pathname);
    const isProtected = isProtectedRoute(pathname);
    const isAuth = isAuthRoute(pathname);

    // Redirect authenticated users away from auth pages
    if (isAuth && isAuthenticated) {
      const redirectUrl = new URL("/products", req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Protect admin routes - require admin role
    if (isAdmin) {
      if (!isAuthenticated) {
        const redirectUrl = new URL("/auth/login", req.url);
        redirectUrl.searchParams.set("callbackUrl", pathname);
        redirectUrl.searchParams.set("error", "AuthenticationRequired");
        return NextResponse.redirect(redirectUrl);
      }

      if (userRole !== "admin") {
        const redirectUrl = new URL("/products", req.url);
        redirectUrl.searchParams.set("error", "InsufficientPermissions");
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Protect authenticated routes
    if (isProtected && !isAuthenticated) {
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      redirectUrl.searchParams.set("error", "AuthenticationRequired");
      return NextResponse.redirect(redirectUrl);
    }

    // Add security headers
    const response = NextResponse.next();

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Only add CSP in production
    if (process.env.NODE_ENV === "production") {
      response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://accounts.google.com"
      );
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Always allow NextAuth API routes
        if (isPublicApiRoute(pathname)) {
          return true;
        }

        // Allow public routes (including shop routes for all users)
        if (isPublicRoute(pathname)) {
          return true;
        }

        // Check admin routes
        if (isAdminRoute(pathname)) {
          // Must be authenticated and have admin role
          if (!token) return false;
          const role = (token.user as any)?.role || token.role;
          return role === "admin";
        }

        // Check protected routes
        if (isProtectedRoute(pathname)) {
          // Must be authenticated (any role including user, seller, admin)
          return !!token;
        }

        // Default: allow access for any other routes
        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes that are handled separately
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
