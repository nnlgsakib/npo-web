"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react"
import type { TransactionRecord } from "@/lib/api"

interface TransactionsTableProps {
  data: TransactionRecord
  currentPage: number
  pageSize: number
}

export function TransactionsTable({ data, currentPage, pageSize }: TransactionsTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTxns = data.txns.filter(
    (txn) =>
      txn.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.number.includes(searchQuery) ||
      txn.txnId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(data.count / pageSize)

  const handlePageChange = (newPage: number) => {
    router.push(`/admin-dash/transactions?page=${newPage}`)
  }

  const handleExportCSV = () => {
    const headers = ["Name", "Phone Number", "Transaction ID", "Amount (BDT)", "Date"]
    const rows = filteredTxns.map((txn) => [
      txn.name || "Anonymous",
      txn.number,
      txn.txnId,
      txn.amount.toString(),
      txn.createdAt || "N/A",
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `FLABD-transactions-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="rounded-2xl border-none shadow-lg bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div>
              <p className="text-white/80 text-sm font-semibold">Grand Total Raised</p>
              <p className="text-4xl font-bold">৳{data.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm font-semibold">Total Transactions</p>
              <p className="text-4xl font-bold">{data.count.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm font-semibold">Average Donation</p>
              <p className="text-4xl font-bold">
                ৳{data.count > 0 ? Math.round(data.totalAmount / data.count).toLocaleString() : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Export */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1D4ED8]" />
          <Input
            type="text"
            placeholder="Search by name, phone, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] bg-white"
          />
        </div>
        <Button
          onClick={handleExportCSV}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl px-6 h-12 font-semibold"
        >
          <Download className="w-5 h-5 mr-2" />
          Download CSV
        </Button>
      </div>

      {/* Transactions Table */}
      <Card className="rounded-2xl border-none shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-[#1E3A8A]">
            Showing {filteredTxns.length} of {data.count} transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTxns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#1D4ED8] text-lg">No transactions found.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#BFDBFE]">
                      <th className="text-left py-4 px-4 text-[#1E3A8A] font-semibold">Name</th>
                      <th className="text-left py-4 px-4 text-[#1E3A8A] font-semibold">Phone Number</th>
                      <th className="text-left py-4 px-4 text-[#1E3A8A] font-semibold">Transaction ID</th>
                      <th className="text-right py-4 px-4 text-[#1E3A8A] font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns.map((txn) => (
                      <tr key={txn.id} className="border-b border-[#E6F0FF] hover:bg-[#E6F0FF] transition-colors">
                        <td className="py-4 px-4 text-[#1D4ED8]">{txn.name || "Anonymous"}</td>
                        <td className="py-4 px-4 text-[#1D4ED8]">{txn.number}</td>
                        <td className="py-4 px-4 text-[#1D4ED8] font-mono text-sm">{txn.txnId}</td>
                        <td className="py-4 px-4 text-right text-[#1E3A8A] font-semibold">
                          ৳{txn.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#3B82F6]">
                      <td colSpan={3} className="py-4 px-4 text-[#1E3A8A] font-bold text-lg">
                        Page Total:
                      </td>
                      <td className="py-4 px-4 text-right text-[#1E3A8A] font-bold text-lg">
                        ৳{filteredTxns.reduce((sum, txn) => sum + txn.amount, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredTxns.map((txn) => (
                  <Card key={txn.id} className="rounded-xl border-[#BFDBFE]">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-[#1E3A8A]">{txn.name || "Anonymous"}</p>
                          <p className="text-sm text-[#1D4ED8]">{txn.number}</p>
                        </div>
                        <p className="text-lg font-bold text-[#3B82F6]">৳{txn.amount.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-[#1D4ED8] font-mono">TXN: {txn.txnId}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-xl bg-transparent disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-[#1D4ED8] font-semibold">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#E6F0FF] rounded-xl bg-transparent disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
