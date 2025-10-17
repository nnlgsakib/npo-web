"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MemberRequestsTable } from "@/components/member-requests-table"
import type { MemberRequestStatus } from "@/lib/api"

export function AdminRequestsView() {
  const [status, setStatus] = useState<MemberRequestStatus>('pending')

  return (
    <div className="space-y-6">
      <Tabs value={status} onValueChange={(v) => setStatus(v as MemberRequestStatus)}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value={status} className="mt-4">
          <MemberRequestsTable status={status} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

