"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sparkles, TrendingUp } from "lucide-react"
import { getTotalRaised } from "@/lib/api"

export function HeroSection() {
  const [totalRaised, setTotalRaised] = useState(0)
  const [displayAmount, setDisplayAmount] = useState(0)

  useEffect(() => {
    // Fetch total raised amount
    getTotalRaised().then((amount) => {
      setTotalRaised(amount)
    })

    // Poll every 30 seconds
    const interval = setInterval(() => {
      getTotalRaised().then((amount) => {
        setTotalRaised(amount)
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Animate number counting up
  useEffect(() => {
    if (totalRaised === 0) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = totalRaised / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= totalRaised) {
        setDisplayAmount(totalRaised)
        clearInterval(timer)
      } else {
        setDisplayAmount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [totalRaised])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient and geometric patterns */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#1a2332] to-[#0f1922] animate-gradient" />

        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-secondary/20 rounded-full" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(76, 175, 80, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(76, 175, 80, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Image
              src="/1000023394-5-884x1024.png"
              alt="FLABD Logo"
              width={128}
              height={128}
              className="h-24 w-24 rounded-full object-cover md:h-32 md:w-32"
            />
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Empowering Future Leaders</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight bg-gradient-to-r from-white via-secondary to-primary bg-clip-text text-transparent">
            Future Leaders Assembly Bangladesh
          </h1>
          <p className="text-2xl md:text-3xl text-primary font-semibold">FLABD</p>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground italic font-light animate-fade-in-delay">
          Empowering our community to lead tomorrow's change
        </p>

        <div className="inline-block animate-fade-in-delay-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-glow" />
            <div className="relative bg-gradient-to-r from-primary to-secondary text-background px-8 py-4 rounded-2xl shadow-2xl font-bold text-lg md:text-xl flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <span>Total Raised: ৳ {displayAmount.toLocaleString()} BDT</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-delay-3">
          <Link href="/donate">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-background rounded-xl px-8 h-14 text-lg font-semibold transition-all duration-200 hover:scale-95 active:scale-90 shadow-xl hover:shadow-primary/50 w-full sm:w-auto min-w-[200px]"
            >
              Donate Us
            </Button>
          </Link>
          <Link href="/members/apply">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-xl px-8 h-14 text-lg font-semibold transition-all duration-200 hover:scale-95 active:scale-90 w-full sm:w-auto min-w-[200px] bg-transparent"
            >
              Join Us
            </Button>
          </Link>
          <Link href="/works">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/10 rounded-xl px-8 h-14 text-lg font-semibold transition-all duration-200 hover:scale-95 active:scale-90 backdrop-blur-sm w-full sm:w-auto min-w-[200px] bg-transparent"
            >
              View Our Works
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-8 h-8 text-primary" />
      </div>
    </section>
  )
}
