"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Loader2 } from "lucide-react"
import { setAdminKey } from "@/lib/admin-auth"
import { useToast } from "@/hooks/use-toast"
import { API_BASE } from "@/lib/api"

export function AdminLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const [adminKey, setAdminKeyInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!adminKey.trim()) {
      setError("Admin key is required")
      return
    }

    setIsLoading(true)

    // Store the key and let the backend verify it on API calls
    setAdminKey(adminKey)

    // Test the key by calling an admin-only endpoint
    try {
      const response = await fetch(`${API_BASE}/get_all_member_reqs?status=pending&page=1&pageSize=1`, {
        headers: {
          "x-admin-key": adminKey,
        },
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Welcome to the admin dashboard.",
        })
        router.push("/admin-dash/posts")
      } else {
        setError("Invalid admin key. Please try again.")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("[v0] Admin login error:", err)
      setError("An error occurred during login. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FF] to-[#BFDBFE] flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl border-none">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="w-20 h-20 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-[#1E3A8A]">Admin Panel</CardTitle>
            <p className="text-[#1D4ED8] mt-2">Future Leaders Assembly Bangladesh</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="adminKey" className="text-[#1E3A8A] font-semibold">
                Enter Admin Key
              </Label>
              <Input
                id="adminKey"
                type="password"
                placeholder="••••••••••••"
                value={adminKey}
                onChange={(e) => {
                  setAdminKeyInput(e.target.value)
                  setError("")
                }}
                className={`h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-150 ${
                  error ? "border-red-500 animate-shake" : ""
                }`}
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-[0.98] active:scale-95 shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-[#BFDBFE]">
            <p className="text-sm text-[#1D4ED8]">
              Need help?{" "}
              <a href="mailto:admin@FLABD.org" className="text-[#3B82F6] hover:underline font-semibold">
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
