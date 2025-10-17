"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { OfficialMember } from "@/lib/api"

export function PinnedMembersPanel({ members }: { members: OfficialMember[] }) {
  return (
    <Card className="rounded-2xl border-none shadow-lg bg-white sticky top-6">
      <CardContent className="p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E3A8A]">Pinned Members</h2>
          <p className="text-[#1D4ED8] text-sm">Highlighted leaders</p>
        </div>
        {members.length === 0 ? (
          <p className="text-sm text-[#1D4ED8]">No pinned members yet.</p>
        ) : (
          <ul className="space-y-3">
            {members.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[#1E3A8A] leading-5">{m.name}</div>
                  <div className="text-xs text-[#1D4ED8] leading-4">{m.designation}</div>
                  <div className="text-[11px] text-[#1D4ED8]">{m.region}</div>
                </div>
                <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">Lead Memeber</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
