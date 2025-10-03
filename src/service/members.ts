import { createHash } from 'crypto';
import { db } from './db';
import logger from '../log';

// Types
export type MemberRequest = {
  id: string;
  name: string;
  fathersName: string;
  mothersName: string;
  region: string;
  institution: string;
  address: string;
  email: string;
  whyJoining: string;
  howDidYouFindUs: string;
  hobbies: string;
  particularSkill?: string;
  extraCurricularActivities?: string;
  photo?: {
    publicUrl?: string;
    mimetype?: string;
    size?: number;
    originalName?: string;
  };
  phoneNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
};

export type OfficialMember = Omit<MemberRequest, 'status'> & {
  isPinned?: boolean;
  designation: string;
};


// Prefixes for DB keys
const memberRequestPrefix = 'member-req:';
const officialMemberPrefix = 'official-member:';

// Key generation functions
const memberRequestKey = (id: string) => `${memberRequestPrefix}${id}`;
const officialMemberKey = (id: string) => `${officialMemberPrefix}${id}`;

export function generateId(): string {
  const uniqueInput = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  const hash = createHash('sha256').update(uniqueInput).digest('hex');
  return hash.slice(0, 20);
}

// Service functions
export async function createMemberRequest(input: Omit<MemberRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<MemberRequest> {
    const id = generateId();
    const now = new Date().toISOString();
    const memberRequest: MemberRequest = {
        ...input,
        id,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
    };
    await db.put(memberRequestKey(id), memberRequest as any);
    logger.info('Member request created', { id });
    return memberRequest;
}

export async function getMemberRequestById(id: string): Promise<MemberRequest | undefined> {
    try {
        const req = await db.get(memberRequestKey(id));
        return req as MemberRequest;
    } catch (err: any) {
        if (err && err.notFound) return undefined;
        throw err;
    }
}

export async function getAllMemberRequests(status?: 'pending' | 'approved' | 'rejected'): Promise<MemberRequest[]> {
    const requests: MemberRequest[] = [];
    for await (const [_key, value] of db.iterator({ gte: memberRequestPrefix, lt: 'member-req;' })) {
        const req = value as MemberRequest;
        if (status && req.status !== status) {
            continue;
        }
        requests.push(req);
    }
    requests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); // newest first
    return requests;
}

export async function manageMemberRequest(id: string, action: 'approve' | 'reject', designation?: string): Promise<boolean> {
    const req = await getMemberRequestById(id);
    if (!req) return false;

    if (action === 'approve') {
        const { status, ...officialMemberData } = req;
        const officialMember: OfficialMember = {
            ...officialMemberData,
            isPinned: false,
            designation: designation || 'member',
            updatedAt: new Date().toISOString(),
        };
        await db.put(officialMemberKey(id), officialMember as any);
        // Update the request status to 'approved'
        req.status = 'approved';
        req.updatedAt = new Date().toISOString();
        await db.put(memberRequestKey(id), req as any);
    } else { // reject
        req.status = 'rejected';
        req.updatedAt = new Date().toISOString();
        await db.put(memberRequestKey(id), req as any);
    }
    logger.info(`Member request ${action}d`, { id });
    return true;
}

export async function getOfficialMemberById(id: string): Promise<OfficialMember | undefined> {
    try {
        const member = await db.get(officialMemberKey(id));
        return member as OfficialMember;
    } catch (err: any) {
        if (err && err.notFound) return undefined;
        throw err;
    }
}

export async function getAllOfficialMembers(): Promise<OfficialMember[]> {
    const members: OfficialMember[] = [];
    for await (const [_key, value] of db.iterator({ gte: officialMemberPrefix, lt: 'official-member;' })) {
        members.push(value as OfficialMember);
    }
    members.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); // newest first
    return members;
}

export async function pinMember(id: string): Promise<OfficialMember | undefined> {
    const member = await getOfficialMemberById(id);
    if (!member) return undefined;

    member.isPinned = true;
    member.updatedAt = new Date().toISOString();
    await db.put(officialMemberKey(id), member as any);
    logger.info(`Member pinned`, { id });
    return member;
}

export async function getAllPinnedMembers(): Promise<OfficialMember[]> {
    const allMembers = await getAllOfficialMembers();
    return allMembers.filter(m => m.isPinned);
}

export async function deleteMember(id: string): Promise<OfficialMember | undefined> {
    const member = await getOfficialMemberById(id);
    if (!member) return undefined;

    try {
        await db.del(officialMemberKey(id));
        logger.info('Official member deleted', { id });
        return member;
    } catch (err: any) {
        logger.error('delete member failed', { id, error: err?.message });
        throw err;
    }
}
