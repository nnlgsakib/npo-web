import { getAllPosts, getTotalRaised } from "@/lib/api"
import { AdminGuard } from "@/components/admin-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminMobileNav } from "@/components/admin-mobile-nav"
import { PostsTable } from "@/components/posts-table"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, DollarSign } from "lucide-react"

export const metadata = {
  title: "All Posts | Admin Dashboard",
}

export default async function AdminPostsPage() {
  const posts = await getAllPosts()
  const totalRaised = await getTotalRaised()

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#E6F0FF]">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 p-4 md:p-8">
          <AdminMobileNav />
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-[#1E3A8A]">Manage FLABD Content</h1>
              <p className="text-[#1D4ED8] mt-2">View, edit, and manage all posts and content</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-none shadow-lg bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#1D4ED8] font-semibold">Total Posts</p>
                    <p className="text-3xl font-bold text-[#1E3A8A]">{posts.length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-none shadow-lg bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#1D4ED8] font-semibold">Total Raised</p>
                    <p className="text-3xl font-bold text-[#1E3A8A]">৳{totalRaised.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Posts Table */}
            <PostsTable posts={posts} />
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
