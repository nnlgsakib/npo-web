import { AdminGuard } from "@/components/admin-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { PostForm } from "@/components/post-form"
import { AdminMobileNav } from "@/components/admin-mobile-nav"

export const metadata = {
  title: "Create Post | Admin Dashboard",
}

export default function CreatePostPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#E6F0FF]">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 p-4 md:p-8">
          <AdminMobileNav />
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1E3A8A]">Create New Post</h1>
              <p className="text-[#1D4ED8] mt-2">Share inspiring stories and updates with the community</p>
            </div>

            <PostForm />
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
