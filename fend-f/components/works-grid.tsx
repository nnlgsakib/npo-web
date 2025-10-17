"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Post } from "@/lib/api"

interface WorksGridProps {
  posts: Post[]
}

export function WorksGrid({ posts }: WorksGridProps) {
  const [visiblePosts, setVisiblePosts] = useState(9)

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="w-32 h-32 mx-auto bg-[#E6F0FF] rounded-full flex items-center justify-center">
          <Image
            src="/inspiring-journey-begins.jpg"
            alt="Journey begins"
            width={128}
            height={128}
            className="opacity-50"
          />
        </div>
        <h2 className="text-2xl font-bold text-[#1E3A8A]">Our Journey Begins</h2>
        <p className="text-[#1D4ED8] max-w-md mx-auto">
          We're working hard to bring you inspiring stories of change. Stay tuned for updates!
        </p>
      </div>
    )
  }

  const loadMore = () => {
    setVisiblePosts((prev) => prev + 9)
  }

  return (
    <div className="space-y-8">
      {/* Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, visiblePosts).map((post, index) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="group"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <Card className="h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-white border-none">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                  <Image
                    src={post.imageUrl || "/placeholder.svg?height=256&width=400"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 space-y-3">
                  <h3 className="text-xl font-bold text-[#1E3A8A] line-clamp-2 group-hover:text-[#3B82F6] transition-colors">
                    {post.title}
                  </h3>
                  {post.subTitle && <p className="text-[#1D4ED8] text-sm line-clamp-2">{post.subTitle}</p>}

                  <Button
                    variant="ghost"
                    className="text-[#3B82F6] hover:text-[#2563EB] hover:bg-[#E6F0FF] p-0 h-auto font-semibold"
                  >
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {visiblePosts < posts.length && (
        <div className="text-center pt-8">
          <Button
            onClick={loadMore}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl px-8 h-12 font-semibold transition-all duration-200 hover:scale-105"
          >
            Load More Stories
          </Button>
        </div>
      )}
    </div>
  )
}
