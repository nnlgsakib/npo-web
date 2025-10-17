"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import type { MemberRequest, MemberRequestStatus, OfficialMember } from "@/lib/api"

type PendingDetails = { type: 'pending'; data: MemberRequest }
type OfficialDetails = { type: 'official'; data: OfficialMember }
type Details = PendingDetails | OfficialDetails

export function MemberRequestDetailsDialog({
  open,
  onOpenChange,
  req,
  status,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  req: MemberRequest | null
  status: MemberRequestStatus
}) {
  const [details, setDetails] = useState<Details | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function resolveUploadUrl(url?: string) {
    if (!url) return undefined
    if (url.startsWith('http')) return url
    const path = url.startsWith('/') ? url : `/${url}`
    // Always load uploads from backend on :3000
    return `http://localhost:3000${path}`
  }

  const photoUrl = useMemo(() => {
    if (!req && !details) return undefined
    const src =
      details?.type === 'pending'
        ? details.data.photo?.publicUrl
        : details?.type === 'official'
          ? details.data.photo?.publicUrl
          : req?.photo?.publicUrl
    return resolveUploadUrl(src || undefined)
  }, [details, req])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setError(null)
      setLoading(true)
      try {
        if ((status === 'pending') || req.status === 'pending') {
          const { getPendingRequestInfoById } = await import("@/lib/api")
          const res = await getPendingRequestInfoById(req.id)
          if (!cancelled) {
            if (res.ok && res.request) setDetails({ type: 'pending', data: res.request })
            else setError(res.error || 'Unable to load request info')
          }
        } else {
          const { getMemberInfoById } = await import("@/lib/api")
          const res = await getMemberInfoById(req.id)
          if (!cancelled) {
            if (res.ok && res.member) setDetails({ type: 'official', data: res.member as OfficialMember })
            else setError(res.error || 'Unable to load member info')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (open && req) load()
    return () => {
      cancelled = true
    }
  }, [open, req?.id, req?.status, status])

  if (!req) return null

  const base = details?.type === 'pending' ? details.data : details?.type === 'official' ? details.data : req

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#1E3A8A]">Applicant Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading && <div className="text-[#1D4ED8]">Loading details...</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-4">
            {photoUrl ? (
              <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={photoUrl} alt={base.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-28 h-28 rounded-xl bg-gray-200 flex items-center justify-center text-[#1D4ED8]">No Photo</div>
            )}
            <div className="flex-1">
              <div className="text-lg font-semibold text-[#1E3A8A]">{base.name}</div>
              {('designation' in base) && (<div className="text-sm text-[#1D4ED8]">{(base as any).designation}</div>)}
              <div className="text-xs text-[#1D4ED8]">ID: {base.id}</div>
              <div className="text-xs text-[#1D4ED8]">Status: {req.status}</div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <Field label="Email" value={(base as any).email} />
            <Field label="Phone" value={(base as any).phoneNumber} />
            <Field label="Region" value={(base as any).region} />
            <Field label="Institution" value={(base as any).institution} />
            <Field label="Address" value={(base as any).address} />
            <Field label="Father's Name" value={(base as any).fathersName} />
            <Field label="Mother's Name" value={(base as any).mothersName} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <Field label="Why Joining" value={(base as any).whyJoining} full />
            <Field label="How Found Us" value={(base as any).howDidYouFindUs} full />
            <Field label="Hobbies" value={(base as any).hobbies} full />
            <Field label="Skills" value={(base as any).particularSkill} full />
            <Field label="Extra Activities" value={(base as any).extraCurricularActivities} full />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3 text-xs text-[#1D4ED8]">
            <div>Created: {(base as any).createdAt}</div>
            <div>Updated: {(base as any).updatedAt}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, value, full = false }: { label: string; value?: string; full?: boolean }) {
  if (!value) return null
  return (
    <div className={full ? 'md:col-span-2' : undefined}>
      <div className="text-[#1E3A8A] font-medium">{label}</div>
      <div className="text-[#1D4ED8] break-words">{value}</div>
    </div>
  )
}
