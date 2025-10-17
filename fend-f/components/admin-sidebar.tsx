"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, PlusCircle, DollarSign, LogOut, Users, ClipboardList } from "lucide-react"
import { clearAdminKey } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    clearAdminKey()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    router.push("/admin-dash")
  }

  const navItems = [
    {
      href: "/admin-dash/posts",
      label: "All Posts",
      icon: FileText,
    },
    {
      href: "/admin-dash/members",
      label: "Members",
      icon: Users,
    },
    {
      href: "/admin-dash/requests",
      label: "Requests",
      icon: ClipboardList,
    },
    {
      href: "/admin-dash/create",
      label: "Create Post",
      icon: PlusCircle,
    },
    {
      href: "/admin-dash/transactions",
      label: "Transactions",
      icon: DollarSign,
    },
  ]

  return (
    <aside className="hidden md:flex w-64 bg-[#3B82F6] min-h-screen fixed left-0 top-0 rounded-r-2xl shadow-2xl flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <Link href="/admin-dash/posts">
          <h1 className="text-2xl font-bold text-white">FLABD Admin</h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start h-12 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#3B82F6] shadow-md hover:bg-white"
                    : "text-white hover:bg-white/20 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-8 bg-[#FFEB3B] rounded-full" />}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/20">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start h-12 rounded-xl text-white hover:bg-red-500/20 hover:text-white border-2 border-red-400/50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
