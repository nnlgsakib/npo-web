import { MemberApplyForm } from "@/components/member-apply-form"

export const metadata = {
  title: "Apply for Membership | FLABD",
}

export default function ApplyMemberPage() {
  return (
    <div className="bg-[#E6F0FF] pt-24 md:pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-[#1E3A8A]">Become a Member</h1>
          <p className="text-[#1D4ED8] mt-2">Fill out the form below to apply.</p>
        </div>
        <MemberApplyForm />
      </div>
    </div>
  )
}
