import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Providers } from "@/components/providers";
import RouteProgress from "@/components/route-progress";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Header } from "@/components/header";
import { GoogleIdentityInitializer } from "@/components/GoogleIdentityInitializer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "EZ-Carts - Your Online Store",
  description:
    "Modern e-commerce platform with admin management. Shop the latest products with secure checkout.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["ecommerce", "shop", "online store", "products", "shopping"],
  authors: [{ name: "EZ-Carts" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EZ-Carts",
  },
  icons: {
    icon: [{ url: "/easycarts-32x32.png", sizes: "32x32", type: "image/png" }],
    apple: [
      { url: "/easycarts-128x128.png", sizes: "128x128", type: "image/png" },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "EZ-Carts",
    title: "EZ-Carts - Your Online Store",
    description: "Modern e-commerce platform with admin management",
  },
  twitter: {
    card: "summary",
    title: "EZ-Carts - Your Online Store",
    description: "Modern e-commerce platform with admin management",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get session on the server
  const session = await getServerSession(authOptions);

  // Log session for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("RootLayout - Session:", session ? "exists" : "null");
    if (session?.user) {
      console.log("RootLayout - User:", {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      });
    }
  }

  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className={`${geist.className} font-sans antialiased`}>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers session={session}>
            <GoogleIdentityInitializer />
            <RouteProgress />
            <Header />
            {children}
          </Providers>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
