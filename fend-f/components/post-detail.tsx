"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, Mail, Phone, MapPin, Share2, Facebook, Twitter, LinkIcon, Check } from "lucide-react"
import type { Post } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface PostDetailProps {
  post: Post
}

export function PostDetail({ post }: PostDetailProps) {
  const { toast } = useToast()
  const [imageZoomed, setImageZoomed] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast({
      title: "Link copied!",
      description: "Post link has been copied to clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post.title)

    let shareUrl = ""
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Image */}
      {post.imageUrl && (
        <div
          className={`relative h-[60vh] w-full overflow-hidden cursor-zoom-in transition-all duration-300 ${
            imageZoomed ? "h-screen" : ""
          }`}
          onClick={() => setImageZoomed(!imageZoomed)}
        >
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                {post.title}
              </h1>
            </div>
          </div>

          {/* Back Button */}
          <div className="absolute top-8 left-8">
            <Link href="/works">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/90 hover:bg-white text-[#3B82F6] shadow-lg backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Subtitle */}
{post.subTitle && <p className="text-2xl text-[#1D4ED8] font-semibold leading-relaxed">{post.subTitle}</p>}

        {/* Description */}
        <div
          className="prose prose-lg max-w-none text-[#1E3A8A] leading-relaxed break-words"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />

        {/* Details Accordion */}
        <Card className="rounded-2xl border-[#BFDBFE] shadow-lg mt-12">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {/* Contacts */}
              <AccordionItem value="contacts" className="border-[#BFDBFE]">
                <AccordionTrigger className="text-[#1E3A8A] font-semibold hover:text-[#3B82F6] transition-colors">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  <a
                    href="mailto:info@FLABD.org"
                    className="flex items-center gap-3 text-[#1D4ED8] hover:text-[#3B82F6] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    info@FLABD.org
                  </a>
                  <a
                    href="tel:+8801234567890"
                    className="flex items-center gap-3 text-[#1D4ED8] hover:text-[#3B82F6] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +880 1234-567890
                  </a>
                </AccordionContent>
              </AccordionItem>

              {/* Location */}
              <AccordionItem value="location" className="border-[#BFDBFE]">
                <AccordionTrigger className="text-[#1E3A8A] font-semibold hover:text-[#3B82F6] transition-colors">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <p className="text-[#1D4ED8]">Dhaka, Bangladesh</p>
                  <p className="text-sm text-[#1D4ED8] mt-2">
                    This initiative is part of our nationwide efforts to empower communities across Bangladesh.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Share */}
              <AccordionItem value="share" className="border-[#BFDBFE]">
                <AccordionTrigger className="text-[#1E3A8A] font-semibold hover:text-[#3B82F6] transition-colors">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share This Post
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleShare("facebook")}
                      className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      onClick={() => handleShare("twitter")}
                      className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-lg transition-all duration-200 hover:scale-105 bg-transparent"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <Link href="/works" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-xl h-14 text-lg font-semibold transition-all duration-200 hover:scale-[0.98] bg-transparent"
            >
              ← Back to Works
            </Button>
          </Link>
          <Link href="/donate" className="flex-1">
            <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl h-14 text-lg font-semibold transition-all duration-200 hover:scale-[0.98] shadow-lg">
              Donate to Support This
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
