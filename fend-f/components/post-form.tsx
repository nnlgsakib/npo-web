"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2, X } from "lucide-react"
import type { Post } from "@/lib/api"
import { createPost, updatePost } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface PostFormProps {
  post?: Post
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: post?.title || "",
    subTitle: post?.subTitle || "",
    description: post?.description || "",
    imageUrl: post?.imageUrl || "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl || null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be less than 5MB" }))
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "File must be an image" }))
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, image: "" }))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 200) {
      newErrors.description = "Description must be at least 200 characters"
    }

    if (!imageFile && !formData.imageUrl && !post?.imageUrl) {
      newErrors.image = "Please provide an image URL or upload an image"
    }

    if (formData.imageUrl && !/^https?:\/\//.test(formData.imageUrl)) {
      newErrors.image = "Please enter a valid URL (starting with http:// or https://)";
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    const submitData = new FormData()
    submitData.append("title", formData.title)
    submitData.append("subTitle", formData.subTitle)
    submitData.append("description", formData.description)

    if (imageFile) {
      submitData.append("image", imageFile)
    } else if (formData.imageUrl) {
      submitData.append("imageUrl", formData.imageUrl)
    }

    if (post) {
      submitData.append("id", post.id)
    }

    const result = post ? await updatePost(post.id, submitData) : await createPost(submitData)

    setIsSubmitting(false)

    if (result.ok) {
      toast({
        title: post ? "Post updated!" : "Post created!",
        description: post ? "Your post has been updated successfully." : "Your post has been published successfully.",
      })
      router.push("/admin-dash/posts")
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to save post",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="rounded-2xl border-none shadow-xl bg-white">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#1E3A8A] font-semibold">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter post title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subTitle" className="text-[#1E3A8A] font-semibold">
              Subtitle (Optional)
            </Label>
            <Input
              id="subTitle"
              type="text"
              placeholder="Enter post subtitle"
              value={formData.subTitle}
              onChange={(e) => handleInputChange("subTitle", e.target.value)}
              className="h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-[#1E3A8A] font-semibold">
              Image <span className="text-red-500">*</span>
            </Label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                <Button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Upload Options */}
            {!imagePreview && (
              <div className="space-y-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2 border-dashed border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-xl h-24 bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-6 h-6 mr-2" />
                      Upload Image (Max 5MB)
                    </Button>
                  </label>
                </div>

                <div className="text-center text-sm text-[#1D4ED8]">OR</div>

                <Input
                  type="url"
                  placeholder="Enter image URL"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    handleInputChange("imageUrl", e.target.value)
                    if (e.target.value) {
                      setImagePreview(e.target.value)
                    }
                  }}
                  className="h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                />
              </div>
            )}

            {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#1E3A8A] font-semibold">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Write an inspiring story... (minimum 200 characters)"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[300px] rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            <div className="flex justify-between text-sm">
              {errors.description ? (
                <p className="text-red-500">{errors.description}</p>
              ) : (
                <p className="text-[#1D4ED8]">{formData.description.length} / 200 characters minimum</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 h-12 border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-xl bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl font-semibold disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {post ? "Updating..." : "Publishing..."}
                </>
              ) : post ? (
                "Update Post"
              ) : (
                "Publish Post"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
