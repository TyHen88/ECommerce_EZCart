import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import {
  isAdminRoute,
  isAuthRoute,
  isPublicApiRoute,
  isPublicRoute,
} from "@/lib/routes";

export default withAuth(
  async function middleware(req) {
    const token = (req as any).nextauth?.token;
    const pathname = req.nextUrl.pathname;
    const isAuthenticated = !!token;
    const userRole = (token?.user as any)?.role || (token as any)?.role;

    if (isPublicApiRoute(pathname)) {
      return NextResponse.next();
    }

    const isAuth = isAuthRoute(pathname);
    const isAdmin = isAdminRoute(pathname);

    if (isAuth && isAuthenticated) {
      const redirectUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (isAdmin) {
      if (!isAuthenticated) {
        const redirectUrl = new URL("/auth/login", req.url);
        redirectUrl.searchParams.set("callbackUrl", pathname);
        redirectUrl.searchParams.set("error", "AuthenticationRequired");
        return NextResponse.redirect(redirectUrl);
      }

      if (userRole !== "admin") {
        const redirectUrl = new URL("/auth/login", req.url);
        redirectUrl.searchParams.set("error", "InsufficientPermissions");
        return NextResponse.redirect(redirectUrl);
      }
    }

    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    const response = NextResponse.next();

    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

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

        if (isPublicApiRoute(pathname) || isPublicRoute(pathname)) {
          return true;
        }

        if (isAdminRoute(pathname)) {
          if (!token) return false;
          const role = (token.user as any)?.role || token.role;
          return role === "admin";
        }

        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
