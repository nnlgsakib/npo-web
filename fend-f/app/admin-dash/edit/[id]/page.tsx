import { getPostById } from "@/lib/api"
import { AdminGuard } from "@/components/admin-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { PostForm } from "@/components/post-form"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Post | Admin Dashboard",
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#E6F0FF]">
        <AdminSidebar />

        <main className="flex-1 ml-64 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1E3A8A]">Edit Post</h1>
              <p className="text-[#1D4ED8] mt-2">Update post content and details</p>
            </div>

            <PostForm post={post} />
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
