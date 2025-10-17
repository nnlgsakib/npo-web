import { getAllPosts } from "@/lib/api"
import { WorksGrid } from "@/components/works-grid"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Our Works | FLABD",
  description: "Discover the impactful work of Future Leaders Assembly Bangladesh",
}

export default async function WorksPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-[#E6F0FF] hover:bg-[#BFDBFE] text-[#3B82F6] shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-[#1E3A8A]">Our Impactful Works</h1>
        </div>

        {/* Filter Pills (Static for now) */}
        <div className="flex gap-3 mb-8">
          <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full px-6">All</Button>
          <Button
            variant="outline"
            className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-full px-6 bg-transparent"
          >
            Education
          </Button>
          <Button
            variant="outline"
            className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-full px-6 bg-transparent"
          >
            Leadership
          </Button>
        </div>

        {/* Works Grid */}
        <WorksGrid posts={posts} />
      </div>
    </div>
  )
}
