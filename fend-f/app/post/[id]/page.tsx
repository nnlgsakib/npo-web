import { getPostById } from "@/lib/api"
import { PostDetail } from "@/components/post-detail"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)

  if (!post) {
    return {
      title: "Post Not Found | FLABD",
    }
  }

  return {
    title: `${post.title} | FLABD`,
    description: post.subTitle || post.description.substring(0, 160),
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  return <PostDetail post={post} />
}
