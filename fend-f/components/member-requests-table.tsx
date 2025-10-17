"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Check, X, Search } from "lucide-react"
import type { MemberRequest, MemberRequestStatus } from "@/lib/api"
import { manageMemberRequestById } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { MemberRequestDetailsDialog } from "@/components/member-request-details"

interface MemberRequestsTableProps {
  status?: MemberRequestStatus
  requests?: MemberRequest[]
}

export function MemberRequestsTable({ status = 'pending', requests: initial }: MemberRequestsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [requests, setRequests] = useState<MemberRequest[]>(initial || [])
  const [selected, setSelected] = useState<MemberRequest | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [approveTarget, setApproveTarget] = useState<MemberRequest | null>(null)
  const [designation, setDesignation] = useState<string>("member")

  useEffect(() => {
    if (initial && initial.length) return
    let cancelled = false
    async function load() {
      const { getAllMemberRequests } = await import("@/lib/api")
      const res = await getAllMemberRequests({ status, page: 1, pageSize: 100 })
      if (cancelled) return
      if (res.ok) setRequests(res.requests)
      else {
        toast({ title: 'Admin access required', description: 'Please log in again.', variant: 'destructive' })
        const { clearAdminKey } = await import("@/lib/admin-auth")
        clearAdminKey()
        window.location.href = "/admin-dash"
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [initial, toast, status])

  const filtered = requests.filter((r) => {
    const s = search.toLowerCase()
    return (
      r.name.toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) ||
      r.region.toLowerCase().includes(s) ||
      r.institution.toLowerCase().includes(s)
    )
  })

  const handle = async (r: MemberRequest, action: 'approve' | 'reject') => {
    setBusyId(r.id)
    const res = await manageMemberRequestById(r.id, action)
    setBusyId(null)
    if (res.ok) {
      toast({ title: action === 'approve' ? 'Approved' : 'Rejected', description: r.name })
      router.refresh()
    } else {
      toast({ title: 'Error', description: res.error || 'Operation failed', variant: 'destructive' })
    }
  }

  const confirmApprove = async () => {
    if (!approveTarget) return
    setBusyId(approveTarget.id)
    const res = await manageMemberRequestById(approveTarget.id, 'approve', designation?.trim() || undefined)
    setBusyId(null)
    if (res.ok) {
      toast({ title: 'Approved', description: `${approveTarget.name} • ${designation || 'member'}` })
      setApproveOpen(false)
      setApproveTarget(null)
      router.refresh()
    } else {
      toast({ title: 'Error', description: res.error || 'Approval failed', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1D4ED8]" />
        <Input
          placeholder="Search by name, email, region, institution"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12 rounded-xl border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] bg-white"
        />
      </div>

      {filtered.length === 0 ? (
          <Card className="rounded-2xl border-none shadow-lg bg-white">
            <CardContent className="p-12 text-center">
            <p className="text-[#1D4ED8] text-lg">No requests found.</p>
            </CardContent>
          </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <Card
              key={r.id}
              className="rounded-2xl border-none shadow-lg bg-white hover:shadow-xl transition-all cursor-pointer"
              onClick={() => { setSelected(r); setDetailsOpen(true) }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1E3A8A]">{r.name}</h3>
                    <p className="text-[#1D4ED8] text-sm">{r.email}</p>
                    <div className="text-xs text-[#1D4ED8] mt-1">{r.region} • {r.institution}</div>
                    <div className="text-xs text-[#1D4ED8]">ID: {r.id}</div>
                  </div>
                  {status === 'pending' && (
                    <div className="flex gap-2 md:flex-col">
                      <Button
                        onClick={(e) => { e.stopPropagation(); setApproveTarget(r); setDesignation('member'); setApproveOpen(true) }}
                        disabled={!!busyId}
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg"
                      >
                        <Check className="w-4 h-4 mr-2" /> {busyId === r.id ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button
                        onClick={(e) => { e.stopPropagation(); void handle(r, 'reject') }}
                        variant="destructive"
                        className="rounded-lg"
                        disabled={!!busyId}
                      >
                        <X className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <MemberRequestDetailsDialog
        open={detailsOpen && !!selected}
        onOpenChange={(v) => setDetailsOpen(v)}
        req={selected}
        status={status}
      />

      {/* Approve with designation dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E3A8A]">Approve Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-[#1D4ED8] text-sm">
              Assign a designation for <span className="font-semibold">{approveTarget?.name}</span> (optional).
            </div>
            <div className="space-y-2">
              <Label className="text-[#1E3A8A]">Designation</Label>
              <Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g., Coordinator" />
              <div className="text-xs text-[#1D4ED8]">Leave as "member" or customize a title.</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={confirmApprove} disabled={!!busyId} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg">
              {busyId === approveTarget?.id ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
