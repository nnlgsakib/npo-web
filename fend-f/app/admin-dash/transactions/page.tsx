import { getFullTransactionRecord } from "@/lib/api"
import { AdminGuard } from "@/components/admin-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { TransactionsTable } from "@/components/transactions-table"
import { AdminMobileNav } from "@/components/admin-mobile-nav"

export const metadata = {
  title: "Transactions | Admin Dashboard",
}

export default async function TransactionsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1
  const pageSize = 50
  const data = await getFullTransactionRecord(page, pageSize)

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#E6F0FF]">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 p-4 md:p-8">
          <AdminMobileNav />
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1E3A8A]">Transaction Records</h1>
              <p className="text-[#1D4ED8] mt-2">View and manage all donation transactions</p>
            </div>

            <TransactionsTable data={data} currentPage={page} pageSize={pageSize} />
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
