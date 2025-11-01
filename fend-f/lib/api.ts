// API utility functions for FLABD
import { getAdminKey } from "./admin-auth"

const API_BASE_SERVER = "https://ea1d406cdbc3.ngrok-free.app/api"
const API_BASE_CLIENT = "/api"
const SERVER_BASE_URL = "https://ea1d406cdbc3.ngrok-free.app"

export const API_BASE =
  typeof window === "undefined" ? API_BASE_SERVER : API_BASE_CLIENT

export interface Post {
  id: string
  title: string
  subTitle?: string
  description: string
  imageUrl?: string
  imagePath?: string
  content?: string // legacy field
  createdAt?: string
}

export interface Transaction {
  id:string
  name?: string
  number: string
  txnId: string
  amount: number
  createdAt?: string
}

export interface TransactionRecord {
  ok: boolean
  totalAmount: number
  count: number
  page: number
  pageSize: number
  txns: Transaction[]
}

// Members
export interface MemberRequest {
  id: string
  name: string
  fathersName: string
  mothersName: string
  region: string
  institution: string
  address: string
  email: string
  whyJoining: string
  howDidYouFindUs: string
  hobbies: string
  particularSkill?: string
  extraCurricularActivities?: string
  photo?: {
    publicUrl?: string
    mimetype?: string
    size?: number
    originalName?: string
  }
  phoneNumber: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface OfficialMember {
  id: string
  name: string
  fathersName: string
  mothersName: string
  region: string
  institution: string
  address: string
  email: string
  whyJoining: string
  howDidYouFindUs: string
  hobbies: string
  particularSkill?: string
  extraCurricularActivities?: string
  photo?: {
    publicUrl?: string
    mimetype?: string
    size?: number
    originalName?: string
  }
  phoneNumber: string
  isPinned?: boolean
  designation: string
  createdAt: string
  updatedAt: string
}

// Normalize image URLs to absolute paths
function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;

  // Handle cases where url might be 'file.jpg' or 'uploads/file.jpg'
  if (url.includes('uploads')) {
    // It's 'uploads/file.jpg' or '/uploads/file.jpg'
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${SERVER_BASE_URL}${path}`;
  } else {
    // It's 'file.jpg' or '/file.jpg'
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${SERVER_BASE_URL}/uploads${path}`;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_BASE}/get_all_posts`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch posts")
    const data = await res.json()
    return (data.posts || []).map((post: any) => ({
      ...post,
      description: post.description || post.content || "",
      imageUrl: normalizeImageUrl(post.image || post.imageUrl || post.imagePath),
    }))
  } catch (error) {
    console.error("[v0] Error fetching posts:", error)
    return []
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE}/get_post_full_by_id?id=${id}`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch post")
    const data = await res.json()
    const post = data.post
    return {
      ...post,
      description: post.description || post.content || "",
      imageUrl: normalizeImageUrl(post.image || post.imageUrl || post.imagePath),
    }
  } catch (error) {
    console.error("[v0] Error fetching post:", error)
    return null
  }
}

export async function getTotalRaised(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/get_full_txn_record?page=1&pageSize=1`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch transactions")
    const data = await res.json()
    return data.totalAmount || 0
  } catch (error) {
    console.error("[v0] Error fetching total raised:", error)
    return 0
  }
}

export async function recordTransaction(data: {
  name?: string
  number: string
  txnId: string
  amount: number
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/rec_txn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) {
      return { ok: false, error: result.error || "Failed to record transaction" }
    }
    return { ok: true }
  } catch (error) {
    console.error("[v0] Error recording transaction:", error)
    return { ok: false, error: "Network error" }
  }
}

export async function getFullTransactionRecord(page = 1, pageSize = 20): Promise<TransactionRecord> {
  try {
    const res = await fetch(`${API_BASE}/get_full_txn_record?page=${page}&pageSize=${pageSize}`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch transactions")
    return await res.json()
  } catch (error) {
    console.error("[v0] Error fetching transaction record:", error)
    return {
      ok: false,
      totalAmount: 0,
      count: 0,
      page: 1,
      pageSize: 20,
      txns: [],
    }
  }
}

export async function createPost(formData: FormData): Promise<{ ok: boolean; error?: string; post?: Post }> {
  try {
    const token = getAdminKey()
    if (!token) return { ok: false, error: "Admin access required" }

    const headers = new Headers()
    headers.append("x-admin-key", token)

    const res = await fetch(`${API_BASE}/create-post`, {
      method: "POST",
      headers,
      body: formData,
    })
    const result = await res.json()
    if (!res.ok) {
      return { ok: false, error: result.error || "Failed to create post" }
    }
    return { ok: true, post: result.post }
  } catch (error) {
    console.error("[v0] Error creating post:", error)
    return { ok: false, error: "Network error" }
  }
}

export async function updatePost(
  id: string,
  formData: FormData,
): Promise<{ ok: boolean; error?: string; post?: Post }> {
  try {
    const token = getAdminKey()
    if (!token) return { ok: false, error: "Admin access needed" }

    const headers = new Headers()
    headers.append("x-admin-key", token)
    const res = await fetch(`${API_BASE}/edit-post_by_id`, {
      method: "PATCH",
      headers,
      body: formData,
    })
    const result = await res.json()
    if (!res.ok) {
      return { ok: false, error: result.error || "Failed to update post" }
    }
    return { ok: true, post: result.post }
  } catch (error) {
    console.error("[v0] Error updating post:", error)
    return { ok: false, error: "Network error" }
  }
}

export async function deletePost(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const token = getAdminKey()
    if (!token) return { ok: false, error: "Admin access required" }

    const headers = new Headers()
    headers.append("x-admin-key", token)

    const res = await fetch(`${API_BASE}/delete-post_by_id?id=${id}`, {
      method: "DELETE",
      headers,
    })
    const result = await res.json()
    if (!res.ok) {
      return { ok: false, error: result.error || "Failed to delete post" }
    }
    return { ok: true }
  } catch (error) {
    console.error("[v0] Error deleting post:", error)
    return { ok: false, error: "Network error" }
  }
}

// ------------- Member APIs -------------

export async function submitMemberRequest(input: Omit<MemberRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'photo'> & { photo?: File }): Promise<{ ok: boolean; error?: string }> {
  try {
    const form = new FormData()
    Object.entries(input).forEach(([k, v]) => {
      if (v == null) return
      if (k === 'photo' && v instanceof File) {
        form.append('photo', v)
      } else {
        form.append(k, String(v))
      }
    })
    const res = await fetch(`${API_BASE}/submit_member_req`, {
      method: 'POST',
      body: form,
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Failed to submit request' }
    return { ok: true }
  } catch (e) {
    console.error('[v0] Error submitting member request:', e)
    return { ok: false, error: 'Network error' }
  }
}

export type MemberRequestStatus = 'pending' | 'approved' | 'rejected' | 'all'

export async function getAllMemberRequests(params?: { status?: MemberRequestStatus; page?: number; pageSize?: number }): Promise<{ ok: boolean; total: number; page: number; pageSize: number; requests: MemberRequest[] }> {
  const token = getAdminKey()
  const headers = new Headers()
  if (token) headers.append('x-admin-key', token)
  const query = new URLSearchParams()
  if (params?.status && params.status !== 'all') query.set('status', params.status)
  if (params?.page) query.set('page', String(params.page))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  const url = `${API_BASE}/get_all_member_reqs${query.toString() ? `?${query}` : ''}`
  try {
    const res = await fetch(url, { cache: 'no-store', headers })
    if (res.status === 403) {
      return { ok: false, total: 0, page: 1, pageSize: 20, requests: [] }
    }
    if (!res.ok) throw new Error('Failed to fetch member requests')
    const data = await res.json()
    return { ok: true, ...data }
  } catch (e) {
    console.error('[v0] Error fetching member requests:', e)
    return { ok: false, total: 0, page: 1, pageSize: 20, requests: [] }
  }
}

export async function manageMemberRequestById(id: string, action: 'approve' | 'reject', designation?: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const token = getAdminKey()
    if (!token) return { ok: false, error: 'Admin access required' }
    const res = await fetch(`${API_BASE}/manage_member_req_by_id`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify({ id, action, designation }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Failed to manage request' }
    return { ok: true }
  } catch (e) {
    console.error('[v0] Error managing member request:', e)
    return { ok: false, error: 'Network error' }
  }
}

export async function getAllOfficialMembers(page = 1, pageSize = 20): Promise<{ ok: boolean; total: number; page: number; pageSize: number; members: OfficialMember[] }> {
  try {
    const res = await fetch(`${API_BASE}/get_all_official_members?page=${page}&pageSize=${pageSize}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch members')
    const data = await res.json()
    return { ok: true, ...data }
  } catch (e) {
    console.error('[v0] Error fetching members:', e)
    return { ok: false, total: 0, page: 1, pageSize: 20, members: [] }
  }
}

export async function pinMemberAsVipById(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const token = getAdminKey()
    if (!token) return { ok: false, error: 'Admin access required' }
    const res = await fetch(`${API_BASE}/pin_member_as_vip_by_id`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Failed to pin member' }
    return { ok: true }
  } catch (e) {
    console.error('[v0] Error pinning member:', e)
    return { ok: false, error: 'Network error' }
  }
}

export async function unpinMemberById(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const token = getAdminKey()
    if (!token) return { ok: false, error: 'Admin access required' }
    const res = await fetch(`${API_BASE}/unpin_member_as_vip_by_id`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Failed to unpin member' }
    return { ok: true }
  } catch (e) {
    console.error('[v0] Error unpinning member:', e)
    return { ok: false, error: 'Network error' }
  }
}

export async function getAllPinnedMembers(page = 1, pageSize = 20): Promise<{ ok: boolean; total: number; page: number; pageSize: number; members: OfficialMember[] }> {
  try {
    const res = await fetch(`${API_BASE}/get_all_pinned_members?page=${page}&pageSize=${pageSize}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch pinned members')
    const data = await res.json()
    return { ok: true, ...data }
  } catch (e) {
    console.error('[v0] Error fetching pinned members:', e)
    return { ok: false, total: 0, page: 1, pageSize: 20, members: [] }
  }
}

export async function getMemberInfoById(id: string, fields?: string[]): Promise<{ ok: boolean; member?: OfficialMember | Partial<OfficialMember>; error?: string }> {
  try {
    const qs = new URLSearchParams({ id })
    if (fields?.length) qs.set('fields', fields.join(','))
    const res = await fetch(`${API_BASE}/get_member_info_by_id?${qs.toString()}`, { cache: 'no-store' })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Failed to fetch member info' }
    return { ok: true, member: data.member }
  } catch (e) {
    console.error('[v0] Error fetching member info:', e)
    return { ok: false, error: 'Network error' }
  }
}

export async function getPendingRequestInfoById(id: string): Promise<{ ok: boolean; request?: MemberRequest; error?: string }> {
  try {
    const token = getAdminKey()
    if (!token) return { ok: false, error: 'Admin access required' }
    const res = await fetch(`${API_BASE}/get_pending_request_info_by_id?id=${encodeURIComponent(id)}`, {
      cache: 'no-store',
      headers: { 'x-admin-key': token },
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Failed to fetch request' }
    return { ok: true, request: data.request }
  } catch (e) {
    console.error('[v0] Error fetching pending request info:', e)
    return { ok: false, error: 'Network error' }
  }
}

export async function deleteMemberById(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const token = getAdminKey()
    if (!token) return { ok: false, error: 'Admin access required' }
    const res = await fetch(`${API_BASE}/delete_member`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || 'Failed to delete member' }
    return { ok: true }
  } catch (e) {
    console.error('[v0] Error deleting member:', e)
    return { ok: false, error: 'Network error' }
  }
}
