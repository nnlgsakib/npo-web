"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { Loader2 } from "lucide-react"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAdminAuthenticated()) {
      router.push("/admin-dash")
    } else {
      setIsChecking(false)
    }
  }, [router, pathname])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#E6F0FF] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto" />
          <p className="text-[#1D4ED8] font-semibold">Verifying access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
