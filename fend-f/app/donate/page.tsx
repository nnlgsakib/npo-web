import { DonateForm } from "@/components/donate-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Donate | FLABD",
  description: "Support Future Leaders Assembly Bangladesh and empower future leaders",
}

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-[#E6F0FF] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white hover:bg-white/80 text-[#3B82F6] shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-[#1E3A8A]">Support FLABD</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <DonateForm />
          </div>

          {/* Sidebar - Impact Stats */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-28 space-y-6">
              <h2 className="text-2xl font-bold text-[#1E3A8A]">Your Impact</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[#E6F0FF] rounded-xl">
                  <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    ৳100
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E3A8A]">Educates a Child</p>
                    <p className="text-sm text-[#1D4ED8]">Provides school supplies for one month</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#E6F0FF] rounded-xl">
                  <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    ৳500
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E3A8A]">Leadership Workshop</p>
                    <p className="text-sm text-[#1D4ED8]">Sponsors one youth for training</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#E6F0FF] rounded-xl">
                  <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                    ৳1000
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E3A8A]">Community Project</p>
                    <p className="text-sm text-[#1D4ED8]">Funds a local initiative</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#BFDBFE]">
                <p className="text-sm text-[#1D4ED8] leading-relaxed">
                  Every contribution, no matter the size, makes a real difference in empowering future leaders across
                  Bangladesh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
