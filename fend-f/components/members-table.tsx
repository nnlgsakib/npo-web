"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Star, StarOff, Search, Trash2 } from "lucide-react"
import type { OfficialMember } from "@/lib/api"
import { deleteMemberById, pinMemberAsVipById, unpinMemberById } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface MembersTableProps {
  members: OfficialMember[]
}

export function MembersTable({ members }: MembersTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<OfficialMember | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = members.filter((m) => {
    const s = search.toLowerCase()
    return (
      m.name.toLowerCase().includes(s) ||
      m.email.toLowerCase().includes(s) ||
      m.region.toLowerCase().includes(s) ||
      m.designation.toLowerCase().includes(s)
    )
  })

  const handlePin = async (m: OfficialMember) => {
    setBusyId(m.id)
    const res = await pinMemberAsVipById(m.id)
    setBusyId(null)
    if (res.ok) {
      toast({ title: "Pinned", description: `${m.name} is now Lead Memeber` })
      router.refresh()
    } else {
      toast({ title: "Error", description: res.error || "Failed to pin", variant: "destructive" })
    }
  }

  const handleUnpin = async (m: OfficialMember) => {
    setBusyId(m.id)
    const res = await unpinMemberById(m.id)
    setBusyId(null)
    if (res.ok) {
      toast({ title: "Unpinned", description: `${m.name} is no longer Lead Memeber` })
      router.refresh()
    } else {
      toast({ title: "Error", description: res.error || "Failed to unpin", variant: "destructive" })
    }
  }

  const handleDelete = (m: OfficialMember) => {
    setSelected(m)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!selected) return
    setBusyId(selected.id)
    const res = await deleteMemberById(selected.id)
    setBusyId(null)
    if (res.ok) {
      toast({ title: "Deleted", description: `${selected.name} removed` })
      setConfirmOpen(false)
      router.refresh()
    } else {
      toast({ title: "Error", description: res.error || "Failed to delete", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1D4ED8]" />
        <Input
          placeholder="Search by name, email, region, designation"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-12 rounded-xl border-[#BFDBFE] focus:border-[#3B82F6] focus:ring-[#3B82F6] bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="rounded-2xl border-none shadow-lg bg-white">
          <CardContent className="p-12 text-center">
            <p className="text-[#1D4ED8] text-lg">No members found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <Card key={m.id} className="rounded-2xl border-none shadow-lg bg-white hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-[#1E3A8A]">{m.name}</h3>
                      <Badge className="bg-[#E6F0FF] text-[#1E3A8A] border border-[#3B82F6]">
                        {m.designation}
                      </Badge>
                      {m.isPinned && (
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Lead Memeber</span>
                      )}
                    </div>
                    <div className="text-xs text-[#1D4ED8] mt-1">{m.email} • {m.region}</div>
                    <div className="text-xs text-[#1D4ED8]">ID: {m.id}</div>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    {m.isPinned ? (
                      <Button
                        onClick={() => handleUnpin(m)}
                        disabled={!!busyId}
                        variant="outline"
                        className="rounded-lg border-red-400 text-red-600 hover:bg-red-50 w-full"
                      >
                        <StarOff className="w-4 h-4 mr-2" />
                        {busyId === m.id ? 'Unpinning...' : 'Unpin Lead Member'}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handlePin(m)}
                        disabled={!!busyId}
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg w-full"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {busyId === m.id ? 'Pinning...' : 'Pin as Lead Memeber'}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(m)}
                      variant="destructive"
                      className="rounded-lg w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1E3A8A]">Delete member?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#1D4ED8]">
              This permanently removes {selected?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 rounded-lg">
              {busyId === selected?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
