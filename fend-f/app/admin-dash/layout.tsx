import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | FLABD",
  description: "Manage FLABD content and transactions",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
