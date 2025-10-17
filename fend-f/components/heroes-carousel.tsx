"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { OfficialMember } from "@/lib/api"

function resolveUploadUrl(url?: string) {
  if (!url) return undefined
  if (url.startsWith("http")) return url
  const path = url.startsWith("/") ? url : `/${url}`
  return `http://localhost:3000${path}`
}

export function HeroesCarousel({ heroes }: { heroes: OfficialMember[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [paused, setPaused] = useState(false)

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk
  }
  const onMouseUp = () => setIsDragging(false)

  // Touch drag handlers
  const touchStartX = useRef<number>(0)
  const touchScrollLeft = useRef<number>(0)
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    touchStartX.current = e.touches[0].pageX
    touchScrollLeft.current = scrollRef.current?.scrollLeft || 0
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const x = e.touches[0].pageX
    const walk = (x - touchStartX.current) * 2
    if (scrollRef.current) scrollRef.current.scrollLeft = touchScrollLeft.current - walk
  }
  const onTouchEnd = () => setIsDragging(false)

  // Auto-scroll left-to-right, loop when reaching the end
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let raf: number | null = null
    let last = 0
    const stepPx = 0.6 // speed

    const tick = (t: number) => {
      if (!last) last = t
      const dt = t - last
      last = t
      if (!paused && !isDragging) {
        const max = el.scrollWidth - el.clientWidth
        if (el.scrollLeft >= max - 2) {
          el.scrollLeft = 0
        } else {
          el.scrollLeft += stepPx * (dt / 16) // normalize to ~60fps
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [paused, isDragging])

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeaveCapture={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {heroes.map((m) => {
          const photo = resolveUploadUrl(m.photo?.publicUrl)
          return (
            <div key={m.id} className="flex-shrink-0 w-[260px]">
              <Card className="rounded-2xl overflow-hidden shadow-lg bg-card border border-border hover:shadow-primary/20 transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-40 w-full bg-muted">
                    {photo ? (
                      <Image src={photo} alt={m.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">No Photo</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-base font-semibold text-foreground line-clamp-1">{m.name}</div>
                    <div className="text-sm text-primary font-medium line-clamp-1">{m.designation}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

