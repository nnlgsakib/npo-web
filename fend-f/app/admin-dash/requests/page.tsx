import { AdminGuard } from "@/components/admin-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminRequestsView } from "@/components/admin-requests-view"
import { AdminMobileNav } from "@/components/admin-mobile-nav"

export const metadata = {
  title: "Member Requests | Admin Dashboard",
}

export default async function MemberRequestsPage() {

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#E6F0FF]">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8">
          <AdminMobileNav />
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1E3A8A]">Member Requests</h1>
              <p className="text-[#1D4ED8] mt-2">Review and manage pending membership applications</p>
            </div>
            <AdminRequestsView />
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
