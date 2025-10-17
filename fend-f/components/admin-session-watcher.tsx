"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { clearAdminKey } from "@/lib/admin-auth"

// Watches route changes and clears admin cookie when user leaves /admin-dash
export function AdminSessionWatcher() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    const inAdmin = pathname.startsWith("/admin-dash")
    if (!inAdmin) {
      clearAdminKey()
    }
  }, [pathname])

  return null
}

