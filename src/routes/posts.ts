import { Router } from 'express';
import adminOnly from '../middleware/adminOnly';
import { upload } from '../utils/upload';
import { createPost, getPost, listPostsSummary, PostRecord, updatePost, deletePost } from '../service/posts';
import path from 'path';
import { uploadDir } from '../utils/upload';
import fs from 'fs/promises';
import logger from '../log';

const router = Router();

// POST /api/create-post (admin)
// Accepts multipart/form-data or JSON.
// Fields: title (required), subTitle (optional), description (required), imageUrl (optional)
// File: image (optional, <5MB, image/*)
router.post(
  '/create-post',
  adminOnly,
  upload.single('image'),
  async (req, res) => {
    try {
      logger.info('create-post invoked');
      const body = (req.body ?? {}) as Record<string, string | undefined>;
      const title = body.title;
      const subTitle = body.subTitle;
      const description = body.description ?? body.content; // support legacy 'content'
      const imageUrl = body.imageUrl;

      if (!title || !description) {
        logger.warn('create-post validation failed', { titlePresent: !!title, descPresent: !!description });
        return res.status(400).json({ error: 'Missing required fields: title, description' });
      }

      // If a file was uploaded, compute a relative path under /uploads for serving
      let imagePath: string | undefined = undefined;
      if (req.file) {
        const abs = req.file.path;
        // Compute relative path from uploadDir
        const rel = path.relative(uploadDir, abs);
        imagePath = rel.replace(/\\/g, '/');
        logger.debug('file uploaded for post', { imagePath });
      }

      if (!imagePath && !imageUrl) {
        logger.warn('no image provided for post');
        return res.status(400).json({ error: 'Provide either image upload or imageUrl' });
      }

      const post: PostRecord = await createPost({
        title,
        subTitle,
        description,
        imageUrl,
        imagePath,
      });

      logger.info('post created', { id: post.id });
      return res.status(201).json({ ok: true, post });
    } catch (err: any) {
      const msg = err?.message || 'Failed to create post';
      logger.error('create-post failed', { error: msg });
      return res.status(400).json({ error: msg });
    }
  }
);

// PATCH /api/edit-post_by_id (admin)
// Allows updating: title, subTitle, description (or legacy 'content'), imageUrl
// Also supports uploading a new image file via field 'image' (<5MB)
router.patch(
  '/edit-post_by_id',
  adminOnly,
  upload.single('image'),
  async (req, res) => {
    logger.info('edit-post invoked');
    const { id } = req.body ?? {};
    if (!id) return res.status(400).json({ error: 'Missing id' });

    // Map potential fields (support legacy 'content' -> 'description')
    const title = (req.body?.title as string | undefined) ?? undefined;
    const subTitle = (req.body?.subTitle as string | undefined) ?? undefined;
    const description = (req.body?.description as string | undefined)
      ?? (req.body?.content as string | undefined)
      ?? undefined;
    const imageUrl = (req.body?.imageUrl as string | undefined) ?? undefined;

    let imagePath: string | undefined = undefined;
    if (req.file) {
      const abs = req.file.path;
      const rel = path.relative(uploadDir, abs);
      imagePath = rel.replace(/\\/g, '/');
      logger.debug('file uploaded for edit', { imagePath });
    }

    const updated = await updatePost(String(id), {
      title,
      subTitle,
      description,
      imageUrl,
      imagePath,
    });
    if (!updated) {
      logger.warn('edit-post not found', { id });
      return res.status(404).json({ error: 'Post not found' });
    }
    logger.info('post updated', { id });
    return res.json({ ok: true, post: updated });
  }
);

// DELETE /api/delete-post_by_id (admin)
router.delete('/delete-post_by_id', adminOnly, async (req, res) => {
  logger.info('delete-post invoked');
  const id = (req.query.id as string) || (req.body?.id as string | undefined);
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const removed = await deletePost(String(id));
  if (!removed) {
    logger.warn('delete-post not found', { id });
    return res.status(404).json({ error: 'Post not found' });
  }
  // Attempt to remove uploaded file if it exists
  if (removed.imagePath) {
    const abs = path.join(uploadDir, removed.imagePath);
    fs.unlink(abs)
      .then(() => logger.debug('deleted image file', { abs }))
      .catch((e) => logger.warn('failed to delete image file', { abs, error: e?.message }));
  }
  logger.info('post deleted', { id });
  return res.json({ ok: true, deleted: removed });
});

// GET /api/get_all_posts (public) — LevelDB-backed summaries
router.get('/get_all_posts', async (req, res) => {
  const posts = await listPostsSummary();
  const base = `${req.protocol}://${req.get('host')}`;
  const normalized = posts.map(p => ({
    ...p,
    image: p.image && !/^https?:\/\//i.test(p.image) ? `${base}${p.image}` : p.image,
  }));
  logger.debug('get_all_posts built', { count: normalized.length });
  return res.json({ ok: true, posts: normalized });
});

// GET /api/get_post_full_by_id (public)
router.get('/get_post_full_by_id', async (req, res) => {
  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const post = await getPost(String(id));
  if (!post) {
    logger.warn('get_post_full_by_id not found', { id });
    return res.status(404).json({ error: 'Post not found' });
  }
  // Backward compatibility: some legacy records may store description as 'content'.
  const description = post.description ?? (post as any).content;
  const normalized = description ? { ...post, description } : post;
  logger.debug('get_post_full_by_id fetched', { id });
  return res.json({ ok: true, post: normalized });
});

export default router;
