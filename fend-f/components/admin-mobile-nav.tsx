"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FileText, PlusCircle, DollarSign, LogOut, Users, ClipboardList, Menu } from "lucide-react"
import { clearAdminKey } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function AdminMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "/admin-dash/posts", label: "All Posts", icon: FileText },
    { href: "/admin-dash/members", label: "Members", icon: Users },
    { href: "/admin-dash/requests", label: "Requests", icon: ClipboardList },
    { href: "/admin-dash/create", label: "Create Post", icon: PlusCircle },
    { href: "/admin-dash/transactions", label: "Transactions", icon: DollarSign },
  ]

  const handleLogout = () => {
    clearAdminKey()
    toast({ title: "Logged out", description: "You have been logged out successfully." })
    setOpen(false)
    router.push("/admin-dash")
  }

  return (
    <div className="md:hidden mb-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="rounded-lg">
            <Menu className="w-5 h-5 mr-2" /> Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-[#1E3A8A]">FLABD Admin</h1>
          </div>
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-12 rounded-xl ${isActive ? 'bg-[#E6F0FF] text-[#1E3A8A]' : 'text-[#1E3A8A] hover:bg-[#E6F0FF]'}`}
                  >
                    <Icon className="w-5 h-5 mr-3" /> {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
          <div className="p-2 border-t">
            <Button onClick={handleLogout} variant="destructive" className="w-full h-12 rounded-xl">
              <LogOut className="w-5 h-5 mr-2" /> Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
