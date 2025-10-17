"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLogin } from "@/components/admin-login"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { AdminMobileNav } from "@/components/admin-mobile-nav"

export default function AdminDashPage() {
  const router = useRouter()

  useEffect(() => {
    // If already authenticated, redirect to posts
    if (isAdminAuthenticated()) {
      router.push("/admin-dash/posts")
    }
  }, [router])

  return <AdminLogin />
}
