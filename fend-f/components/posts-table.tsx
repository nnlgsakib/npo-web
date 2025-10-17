"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Search } from "lucide-react"
import type { Post } from "@/lib/api"
import { deletePost } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface PostsTableProps {
  posts: Post[]
}

export function PostsTable({ posts }: PostsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    setIsDeleting(true)
    const result = await deletePost(postToDelete.id)

    if (result.ok) {
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
      })
      setDeleteDialogOpen(false)
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete post",
        variant: "destructive",
      })
    }
    setIsDeleting(false)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1D4ED8]" />
        <Input
          type="text"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 rounded-xl border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] bg-white"
        />
      </div>

      {/* Posts Grid (Mobile-friendly cards) */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="rounded-2xl border-none shadow-lg bg-white">
            <CardContent className="p-12 text-center">
              <p className="text-[#1D4ED8] text-lg">No posts found. Create your first post to get started!</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="rounded-2xl border-none shadow-lg bg-white hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  {post.imageUrl && (
                    <div className="relative w-full md:w-32 h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="text-xl font-bold text-[#1E3A8A] line-clamp-1">{post.title}</h3>
                      {post.subTitle && <p className="text-[#1D4ED8] text-sm line-clamp-1">{post.subTitle}</p>}
                    </div>
                    {post.description && (
                      <p className="text-[#1D4ED8] text-sm line-clamp-2">
                        {post.description.replace(/<[^>]*>/g, "").substring(0, 100)}...
                      </p>
                    )}
                    <p className="text-xs text-[#1D4ED8]">ID: {post.id}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2">
                    <Link href={`/admin-dash/edit/${post.id}`} className="flex-1 md:flex-none">
                      <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDeleteClick(post)}
                      variant="destructive"
                      className="flex-1 md:flex-none rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1E3A8A]">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#1D4ED8]">
              This will permanently delete "{postToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 rounded-lg"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
