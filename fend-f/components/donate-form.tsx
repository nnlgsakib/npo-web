"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { recordTransaction } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2 } from "lucide-react"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

export function DonateForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { width, height } = useWindowSize()

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    amount: "",
    txnId: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const validatePhone = (phone: string) => {
    // Bangladeshi phone number format: 01XXXXXXXXX (11 digits)
    const phoneRegex = /^01[0-9]{9}$/
    return phoneRegex.test(phone)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.number.trim()) {
      newErrors.number = "Phone number is required"
    } else if (!validatePhone(formData.number)) {
      newErrors.number = "Invalid Bangladeshi phone number (01XXXXXXXXX)"
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required"
    } else if (Number(formData.amount) < 100) {
      newErrors.amount = "Minimum amount is ৳100"
    }

    if (!formData.txnId.trim()) {
      newErrors.txnId = "Transaction ID is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Shake animation for errors
      return
    }

    setIsSubmitting(true)

    const result = await recordTransaction({
      name: formData.name || undefined,
      number: formData.number,
      txnId: formData.txnId.toUpperCase(),
      amount: Number(formData.amount),
    })

    setIsSubmitting(false)

    if (result.ok) {
      setShowSuccess(true)
      toast({
        title: "Thank you!",
        description: "Your donation has been recorded successfully.",
      })

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to record donation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (showSuccess) {
    return (
      <>
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
        <Card className="rounded-2xl shadow-xl border-none bg-white">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-24 h-24 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#1E3A8A]">Thank You!</h2>
            <p className="text-lg text-[#1D4ED8]">
              Your donation has been recorded successfully. You're helping us empower future leaders!
            </p>
            <p className="text-sm text-[#1D4ED8]">Redirecting to homepage...</p>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <Card className="rounded-2xl shadow-xl border-none bg-white">
      <CardContent className="p-8 md:p-12">
        <div className="space-y-6">
          {/* Intro Text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-[#1E3A8A]">Make a Difference Today</h2>
            <p className="text-[#1D4ED8] leading-relaxed">
              Your generosity empowers future leaders. Send funds via bKash/Nagad to{" "}
              <span className="font-semibold">01234567890</span>, then record your donation below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#1E3A8A] font-semibold">
                Your Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-150"
              />
            </div>

            {/* Phone Number (Required) */}
            <div className="space-y-2">
              <Label htmlFor="number" className="text-[#1E3A8A] font-semibold">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="number"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                className={`h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-150 ${
                  errors.number ? "border-red-500 animate-shake" : ""
                }`}
              />
              {errors.number && <p className="text-sm text-red-500">{errors.number}</p>}
            </div>

            {/* Amount (Required) */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[#1E3A8A] font-semibold">
                Amount (BDT) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Minimum ৳100"
                min="100"
                step="50"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className={`h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-150 ${
                  errors.amount ? "border-red-500 animate-shake" : ""
                }`}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              {formData.amount && Number(formData.amount) >= 100 && (
                <p className="text-sm text-[#3B82F6] font-semibold">
                  Total: ৳{Number(formData.amount).toLocaleString()}
                </p>
              )}
            </div>

            {/* Transaction ID (Required) */}
            <div className="space-y-2">
              <Label htmlFor="txnId" className="text-[#1E3A8A] font-semibold">
                Transaction ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="txnId"
                type="text"
                placeholder="Enter TXN ID from bKash/Nagad"
                value={formData.txnId}
                onChange={(e) => handleInputChange("txnId", e.target.value.toUpperCase())}
                className={`h-12 rounded-lg border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] transition-all duration-150 uppercase ${
                  errors.txnId ? "border-red-500 animate-shake" : ""
                }`}
              />
              {errors.txnId && <p className="text-sm text-red-500">{errors.txnId}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-lg font-bold transition-all duration-200 hover:scale-[0.98] active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Recording Donation...
                </>
              ) : (
                "Record Donation"
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
