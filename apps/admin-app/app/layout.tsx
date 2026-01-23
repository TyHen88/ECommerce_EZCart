import { Providers } from "@/components/providers";
import RouteProgress from "@/components/route-progress";
import { ThemeProvider } from "@/components/theme-provider";
import { authOptions } from "@/lib/auth";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "EZ-Carts Admin Console",
  description: "Admin management for the marketplace",
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
  const session = await getServerSession(authOptions);

  if (process.env.NODE_ENV === "development") {
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
      <body
        className={`${geist.className} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers session={session}>
            <RouteProgress />
            <div className="min-h-screen bg-background text-foreground">
              {children}
            </div>
          </Providers>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
