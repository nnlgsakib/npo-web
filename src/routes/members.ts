import { Router } from 'express';
import adminOnly from '../middleware/adminOnly';
import { upload } from '../utils/upload';
import * as memberService from '../service/members';
import path from 'path';
import { uploadDir } from '../utils/upload';
import logger from '../log';

const router = Router();

// POST /api/submit_member_req (public)
router.post('/submit_member_req', upload.single('photo'), async (req, res) => {
    try {
        const body = req.body ?? {};
        const requiredFields = ['name', 'fathersName', 'mothersName', 'region', 'institution', 'address', 'email', 'whyJoining', 'howDidYouFindUs', 'hobbies', 'phoneNumber'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        let photo;
        if (req.file) {
            const rel = path.relative(uploadDir, req.file.path);
            const publicUrl = `/uploads/${rel.replace(/\\/g, '/')}`;
            photo = {
                publicUrl,
                mimetype: req.file.mimetype,
                size: req.file.size,
                originalName: req.file.originalname,
            };
        }

        const memberRequest = await memberService.createMemberRequest({
            name: body.name,
            fathersName: body.fathersName,
            mothersName: body.mothersName,
            region: body.region,
            institution: body.institution,
            address: body.address,
            email: body.email,
            whyJoining: body.whyJoining,
            howDidYouFindUs: body.howDidYouFindUs,
            hobbies: body.hobbies,
            phoneNumber: body.phoneNumber,
            particularSkill: body.particularSkill,
            extraCurricularActivities: body.extraCurricularActivities,
            photo,
        });

        res.status(201).json({ ok: true, request: memberRequest });
    } catch (err: any) {
        logger.error('submit_member_req failed', { error: err?.message });
        res.status(500).json({ error: 'Failed to submit member request' });
    }
});

// GET /api/get_all_member_reqs (admin)
router.get('/get_all_member_reqs', adminOnly, async (req, res) => {
    const status = req.query.status as 'pending' | 'approved' | 'rejected' | undefined;
    const page = parseInt(req.query.page as string || '1');
    const pageSize = parseInt(req.query.pageSize as string || '20');

    const requests = await memberService.getAllMemberRequests(status);

    const start = (page - 1) * pageSize;
    const paginated = requests.slice(start, start + pageSize);

    res.json({
        ok: true,
        total: requests.length,
        page,
        pageSize,
        requests: paginated,
    });
});

// PATCH /api/manage_member_req_by_id (admin)
router.patch('/manage_member_req_by_id', adminOnly, async (req, res) => {
    const { id, action, designation } = req.body;
    if (!id || !action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Missing or invalid id or action' });
    }

    const success = await memberService.manageMemberRequest(id, action, designation);
    if (!success) {
        return res.status(404).json({ error: 'Member request not found' });
    }

    res.json({ ok: true });
});

// GET /api/get_all_official_members (public)
router.get('/get_all_official_members', async (req, res) => {
    const page = parseInt(req.query.page as string || '1');
    const pageSize = parseInt(req.query.pageSize as string || '20');

    const members = await memberService.getAllOfficialMembers();

    const start = (page - 1) * pageSize;
    const paginated = members.slice(start, start + pageSize);

    res.json({
        ok: true,
        total: members.length,
        page,
        pageSize,
        members: paginated,
    });
});

// PATCH /api/pin_member_as_vip_by_id (admin)
router.patch('/pin_member_as_vip_by_id', adminOnly, async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Missing id' });
    }

    const member = await memberService.pinMember(id);
    if (!member) {
        return res.status(404).json({ error: 'Official member not found' });
    }

    res.json({ ok: true, member });
});

// PATCH /api/unpin_member_as_vip_by_id (admin)
router.patch('/unpin_member_as_vip_by_id', adminOnly, async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Missing id' });
    }

    const member = await memberService.unpinMember(id);
    if (!member) {
        return res.status(404).json({ error: 'Official member not found' });
    }

    res.json({ ok: true, member });
});

// GET /api/get_all_pinned_members (public)
router.get('/get_all_pinned_members', async (req, res) => {
    const page = parseInt(req.query.page as string || '1');
    const pageSize = parseInt(req.query.pageSize as string || '20');

    const members = await memberService.getAllPinnedMembers();

    const start = (page - 1) * pageSize;
    const paginated = members.slice(start, start + pageSize);

    res.json({
        ok: true,
        total: members.length,
        page,
        pageSize,
        members: paginated,
    });
});

// GET /api/get_member_info_by_id (public)
router.get('/get_member_info_by_id', async (req, res) => {
    const id = req.query.id as string;
    if (!id) {
        return res.status(400).json({ error: 'Missing id' });
    }

    const member = await memberService.getOfficialMemberById(id);
    if (!member) {
        return res.status(404).json({ error: 'Member not found' });
    }

    const fields = req.query.fields as string | undefined;
    if (fields) {
        const fieldsArray = fields.split(',');
        const partialMember: Record<string, any> = { id: member.id };
        for (const field of fieldsArray) {
            if (field in member) {
                partialMember[field] = (member as any)[field];
            }
        }
        return res.json({ ok: true, member: partialMember });
    }

    res.json({ ok: true, member });
});

// GET /api/get_pending_request_info_by_id (admin)
router.get('/get_pending_request_info_by_id', adminOnly, async (req, res) => {
    const id = req.query.id as string;
    if (!id) {
        return res.status(400).json({ error: 'Missing id' });
    }

    const request = await memberService.getMemberRequestById(id);
    if (!request || request.status !== 'pending') {
        return res.status(404).json({ error: 'Pending member request not found' });
    }

    res.json({ ok: true, request });
});

// DELETE /api/delete_member (admin)
router.delete('/delete_member', adminOnly, async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Missing id' });
    }

    const deletedMember = await memberService.deleteMember(id);
    if (!deletedMember) {
        return res.status(404).json({ error: 'Official member not found' });
    }

    res.json({ ok: true, deleted: deletedMember });
});


export default router;
