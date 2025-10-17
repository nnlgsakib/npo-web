"use client"

import type React from "react"
import Image from "next/image"

import { useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"
import type { Post } from "@/lib/api"

interface PostsCarouselProps {
  posts: Post[]
}

export function PostsCarousel({ posts }: PostsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  if (posts.length === 0) {
    return (
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-lg">No posts available yet. Check back soon!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-card relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Our Impact Stories</h2>
          <p className="text-muted-foreground text-lg">Discover how we're transforming lives across Bangladesh</p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-4 snap-x snap-mandatory"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
        >
          {posts.slice(0, 10).map((post, index) => (
            <Link key={post.id} href={`/post/${post.id}`} className="flex-shrink-0 w-[300px] snap-center group">
              <Card className="h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 hover:-rotate-1 bg-muted border border-border">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative h-[200px] w-full overflow-hidden">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                        <div className="text-6xl font-bold text-primary/20">{index + 1}</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-xs text-foreground font-medium">
                        {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between bg-card">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.subTitle && <p className="text-muted-foreground text-sm line-clamp-2">{post.subTitle}</p>}
                    </div>

                    <Button
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-background rounded-lg mt-4 transition-all duration-200 bg-transparent group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
