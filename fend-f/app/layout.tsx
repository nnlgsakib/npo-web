import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { AdminSessionWatcher } from "@/components/admin-session-watcher"

export const metadata: Metadata = {
  title: "Future Leaders Assembly Bangladesh | FLABD",
  description: "Empowering our community through leadership and education. Join us in making a difference.",
  generator: "v0.app",
  keywords: ["FLABD", "Bangladesh", "Leadership", "Education", "Non-profit", "Community"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          <AdminSessionWatcher />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
          <Toaster />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
