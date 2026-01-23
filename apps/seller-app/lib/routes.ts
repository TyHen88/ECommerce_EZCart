/**
 * Route configuration constants
 * Centralized route definitions for middleware and route protection
 */

// Routes that require authentication (any logged-in user)
export const PROTECTED_ROUTES = ["/setting", "/checkout"] as const;

// Routes that require admin role
export const ADMIN_ROUTES = ["/admin"] as const;

// Routes that should redirect authenticated users (auth pages)
export const AUTH_ROUTES = ["/auth/login", "/auth/sign-up"] as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  "/",
  "/dashboard",
  "/products",
  "/shop",
  "/blog",
  "/about",
  "/contact",
  "/auth",
  "/oauth2",
  "/test",
] as const;

// Public API routes that don't need authentication
export const PUBLIC_API_ROUTES = ["/api/auth"] as const;

/**
 * Check if a pathname matches any of the given routes
 */
export function matchesRoute(
  pathname: string,
  routes: readonly string[]
): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

/**
 * Check if a route is protected (requires authentication)
 */
export function isProtectedRoute(pathname: string): boolean {
  return matchesRoute(pathname, PROTECTED_ROUTES);
}

/**
 * Check if a route requires admin role
 */
export function isAdminRoute(pathname: string): boolean {
  return matchesRoute(pathname, ADMIN_ROUTES);
}


/**
 * Check if a route is an auth route (login/signup)
 */
export function isAuthRoute(pathname: string): boolean {
  return matchesRoute(pathname, AUTH_ROUTES);
}

/**
 * Check if a route is public (no authentication required)
 */
export function isPublicRoute(pathname: string): boolean {
  return matchesRoute(pathname, PUBLIC_ROUTES);
}

/**
 * Check if an API route is public
 */
export function isPublicApiRoute(pathname: string): boolean {
  return matchesRoute(pathname, PUBLIC_API_ROUTES);
}
