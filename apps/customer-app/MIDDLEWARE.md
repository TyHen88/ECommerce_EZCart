# Middleware Documentation

## Overview

The middleware system provides centralized route protection, authentication checks, and security headers for the application.

## Files

- **`middleware.ts`** - Main middleware implementation
- **`lib/routes.ts`** - Route configuration constants and utilities

## Features

### 1. Route Protection

#### Admin Routes (`/admin/*`)
- Requires authentication
- Requires `admin` role
- Redirects to `/products` with error if insufficient permissions
- Redirects to `/auth/login` with callback URL if not authenticated

#### Protected Routes
- `/setting` - User settings page
- `/checkout` - Checkout page
- Requires authentication
- Redirects to `/auth/login` with callback URL if not authenticated

#### Auth Routes (`/auth/login`, `/auth/sign-up`)
- Redirects authenticated users to `/products`
- Prevents logged-in users from accessing login/signup pages

### 2. Public Routes

The following routes are publicly accessible:
- `/` - Home page
- `/products` - Products listing
- `/shop` - Shop pages
- `/blog` - Blog pages
- `/about` - About page
- `/contact` - Contact page
- `/auth` - Auth pages (for unauthenticated users)
- `/oauth2` - OAuth2 redirect handler
- `/test` - Test pages

### 3. API Routes

- `/api/auth/*` - NextAuth API routes (always public)
- Other API routes are handled individually

### 4. Security Headers

The middleware adds the following security headers to all responses:

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Referrer policy
- `Content-Security-Policy` - CSP header (production only)

## Usage

### Adding a New Protected Route

1. Add the route to `lib/routes.ts`:

```typescript
export const PROTECTED_ROUTES = [
  "/setting",
  "/checkout",
  "/your-new-route", // Add here
] as const;
```

2. The middleware will automatically protect it.

### Adding a New Admin Route

1. Add the route to `lib/routes.ts`:

```typescript
export const ADMIN_ROUTES = [
  "/admin",
  "/your-admin-route", // Add here
] as const;
```

2. The middleware will automatically require admin role.

### Adding a New Public Route

1. Add the route to `lib/routes.ts`:

```typescript
export const PUBLIC_ROUTES = [
  "/",
  "/products",
  "/your-public-route", // Add here
] as const;
```

2. The middleware will automatically allow public access.

## Route Matching

The middleware uses prefix matching:
- `/admin` matches `/admin`, `/admin/products`, `/admin/users`, etc.
- `/setting` matches `/setting`, `/setting/profile`, etc.

## Callback URLs

When redirecting unauthenticated users, the middleware:
1. Redirects to `/auth/login`
2. Adds `callbackUrl` query parameter with the original pathname
3. Adds `error` query parameter indicating the reason

Example:
```
/auth/login?callbackUrl=/checkout&error=AuthenticationRequired
```

## Error Handling

The middleware handles the following error scenarios:

1. **AuthenticationRequired** - User not authenticated
2. **InsufficientPermissions** - User doesn't have required role

## Performance

- Middleware runs on Edge Runtime (fast)
- Route matching is optimized with prefix checks
- Security headers are added efficiently
- Minimal overhead on public routes

## Testing

To test middleware:

1. **Test Admin Protection:**
   - Visit `/admin` without login → Should redirect to `/auth/login`
   - Visit `/admin` as regular user → Should redirect to `/products` with error
   - Visit `/admin` as admin → Should allow access

2. **Test Protected Routes:**
   - Visit `/setting` without login → Should redirect to `/auth/login`
   - Visit `/setting` as authenticated user → Should allow access

3. **Test Auth Routes:**
   - Visit `/auth/login` as authenticated user → Should redirect to `/products`
   - Visit `/auth/login` as unauthenticated user → Should allow access

4. **Test Public Routes:**
   - Visit `/products` → Should always allow access
   - Visit `/blog` → Should always allow access

## Configuration

The middleware configuration is in `middleware.ts`:

```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
```

This matcher excludes:
- Static files (`_next/static`)
- Image optimization files (`_next/image`)
- Static assets (images, CSS, JS files)
- Favicon

## Best Practices

1. **Keep route constants in `lib/routes.ts`** - Centralized configuration
2. **Use helper functions** - `isAdminRoute()`, `isProtectedRoute()`, etc.
3. **Add security headers** - Always include security headers
4. **Handle errors gracefully** - Provide clear error messages
5. **Test thoroughly** - Test all route protection scenarios

## Troubleshooting

### Middleware not running
- Check `next.config.ts` for any middleware exclusions
- Verify the matcher pattern matches your routes
- Check browser console for errors

### Redirect loops
- Ensure auth routes don't require authentication
- Check callback URLs are valid
- Verify token is being set correctly

### Type errors
- Ensure `next-auth` is installed
- Check TypeScript configuration
- Verify import paths are correct
