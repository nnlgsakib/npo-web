"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Don't show navigation on admin pages
  if (pathname?.startsWith("/admin-dash")) {
    return null
  }

  const navLinks = (
    <>
      <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)}>
        <Button className="w-full justify-start rounded-xl px-6 font-semibold transition-all duration-200 hover:scale-95 active:scale-90 shadow-md hover:shadow-lg hover:shadow-primary/30 md:w-auto md:justify-center h-11 bg-primary text-background hover:bg-primary/90">
          Donate Us
        </Button>
      </Link>
      <Link href="/works" onClick={() => setIsMobileMenuOpen(false)}>
        <Button
          variant="outline"
          className="w-full justify-start border-2 border-primary text-primary hover:bg-primary/10 rounded-xl px-6 h-11 font-semibold transition-all duration-200 hover:scale-95 active:scale-90 bg-transparent md:w-auto md:justify-center"
        >
          View Our Works
        </Button>
      </Link>
    </>
  )

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg shadow-primary/5" : "bg-card/80 backdrop-blur-sm"
      } border-b border-border/50 rounded-b-2xl`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105"
          >
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FLABD
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">{navLinks}</div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 py-6">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 mb-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      FLABD
                    </div>
                  </Link>
                  {navLinks}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}