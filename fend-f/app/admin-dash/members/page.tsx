import { AdminGuard } from "@/components/admin-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { MembersTable } from "@/components/members-table"
import { PinnedMembersPanel } from "@/components/pinned-members-panel"
import { getAllOfficialMembers, getAllPinnedMembers } from "@/lib/api"
import { AdminMobileNav } from "@/components/admin-mobile-nav"

export const metadata = {
  title: "Members | Admin Dashboard",
}

export default async function MembersPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1
  const pageSize = 50
  const data = await getAllOfficialMembers(page, pageSize)
  const pinned = await getAllPinnedMembers(1, 100)

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#E6F0FF]">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8">
          <AdminMobileNav />
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1E3A8A]">Official Members</h1>
              <p className="text-[#1D4ED8] mt-2">Manage approved members • {data.total} total</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MembersTable members={data.members} />
              </div>
              <div>
                <PinnedMembersPanel members={pinned.members} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
