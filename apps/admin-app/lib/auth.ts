// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/service/auth.service";
import { PasswordUtils } from "@/utils/PasswordUtils";
import type { LoginRequest } from "@/lib/types";

type AppUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

function normalizeRole(value: unknown): string | null {
  if (!value) return null;
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw === "string") {
    return raw.toLowerCase().replace(/^role_/, "");
  }
  if (typeof raw === "object" && raw !== null) {
    const candidate =
      (raw as { name?: string; authority?: string }).name ??
      (raw as { name?: string; authority?: string }).authority;
    if (typeof candidate === "string") {
      return candidate.toLowerCase().replace(/^role_/, "");
    }
  }
  return null;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    accessToken?: string; // ✅ credentials JWT from your API
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    user?: AppUser;
    // NextAuth uses `sub` as the canonical user id in JWT strategy
    sub?: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user_name: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.user_name || !credentials?.password) return null;

        const authRequest: LoginRequest = {
          user_name: credentials.user_name,
          password: PasswordUtils.encrypt(credentials.password),
        };

        const response = await authService.login(
          authRequest.user_name,
          authRequest.password
        );

        const responseData = response.data?.data || response.data;
        const apiAccessToken =
          responseData?.access_token || responseData?.token;

        if (!apiAccessToken || typeof apiAccessToken !== "string") return null;

        // Decode JWT payload to extract user info (id, username, role, email...)
        let payload: any;
        try {
          const [, payloadB64] = apiAccessToken.split(".");
          payload = JSON.parse(
            Buffer.from(payloadB64, "base64").toString("utf8")
          );
        } catch {
          return null;
        }

        const id = String(payload.id ?? "").trim();
        if (!id) return null;

        const name =
          payload.username ||
          payload.sub ||
          payload.user_name ||
          payload.name ||
          null;

        const email = payload.email || payload.userEmail || null;
        const role = normalizeRole(
          payload.role ?? payload.roles ?? payload.authorities
        );

        if (role !== "admin") return null;

        // ✅ Return a clean NextAuth user object
        return {
          id,
          name,
          email,
          role,
          accessToken: apiAccessToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // --- Credentials login (first time only) ---
      if (user) {
        token.sub = user.id; // ✅ IMPORTANT
        token.user = {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          role: (user as any).role ?? null,
        };
        token.accessToken = (user as any).accessToken; // ✅ from authorize()
      }

      // ✅ Preserve existing accessToken on subsequent calls
      // (token.accessToken is already set from previous calls)

      return token;
    },

    async session({ session, token }) {
      // ✅ Always construct session.user from token
      const id = token.sub || token.user?.id;
      session.user = {
        id: String(id ?? ""),
        name: token.user?.name ?? session.user?.name ?? null,
        email: token.user?.email ?? session.user?.email ?? null,
        image: session.user?.image ?? null,
        role: token.user?.role ?? null,
      };

      session.accessToken = token.accessToken;
      session.idToken = token.idToken;

      return session;
    },
  },
};
