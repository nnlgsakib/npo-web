import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#E6F0FF] flex items-center justify-center px-4 pt-20">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-[#BFDBFE] rounded-full flex items-center justify-center mx-auto">
          <FileQuestion className="w-12 h-12 text-[#3B82F6]" />
        </div>
        <h1 className="text-4xl font-bold text-[#1E3A8A]">Post Not Found</h1>
        <p className="text-[#1D4ED8] text-lg">The post you're looking for doesn't exist or has been removed.</p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/works">
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl px-6">View All Works</Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-xl px-6 bg-transparent"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
