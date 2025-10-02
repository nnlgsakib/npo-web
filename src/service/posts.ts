import { db, nextSequence } from './db';
import logger from '../log';

export type PostRecord = {
  id: string;
  title: string;
  subTitle?: string;
  description: string;
  imageUrl?: string; // external URL
  imagePath?: string; // local uploaded path (relative to /uploads)
  createdAt: string;
  updatedAt: string;
};

const postsPrefix = 'post:';

function postKey(id: string) {
  return `${postsPrefix}${id}`;
}

export async function createPost(input: {
  title: string;
  subTitle?: string;
  description: string;
  imageUrl?: string;
  imagePath?: string;
}): Promise<PostRecord> {
  logger.info('creating post', { title: input.title });
  // Always use DB-backed sequence; fail if unavailable
  const idNum = await nextSequence('posts');
  const id = String(idNum);
  const now = new Date().toISOString();
  const record: PostRecord = {
    id,
    title: input.title,
    subTitle: input.subTitle,
    description: input.description,
    imageUrl: input.imageUrl,
    imagePath: input.imagePath,
    createdAt: now,
    updatedAt: now,
  };
  try {
    await db.put(postKey(id), record as unknown as any);
    logger.debug('post stored', { id });
    return record;
  } catch (err: any) {
    logger.error('failed to store post', { id, error: err?.message });
    throw err;
  }
}

export async function getPost(id: string): Promise<PostRecord | undefined> {
  try {
    const rec = await db.get(postKey(id));
    logger.debug('post fetched', { id });
    return rec as unknown as PostRecord;
  } catch (err: any) {
    if (err && err.notFound) return undefined;
    logger.error('get post error', { id, error: err?.message });
    throw err;
  }
}

export async function listPostsSummary(): Promise<Array<{ id: string; title: string; image: string | null; timestamp: string }>> {
  const list: Array<{ id: string; title: string; image: string | null; timestamp: string }> = [];
  try {
    for await (const [_key, value] of db.iterator({ gte: postsPrefix, lt: 'post;' })) {
      const p = value as unknown as PostRecord;
      const image = p.imageUrl ?? (p.imagePath ? `/uploads/${p.imagePath}` : null);
      list.push({ id: p.id, title: p.title, image, timestamp: p.createdAt });
    }
  } catch (err: any) {
    logger.error('list posts failed', { error: err?.message });
    throw err;
  }
  // Most recent first
  list.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  logger.debug('listed posts summary', { count: list.length });
  return list;
}

export async function updatePost(
  id: string,
  updates: Partial<Pick<PostRecord, 'title' | 'subTitle' | 'description' | 'imageUrl' | 'imagePath'>>
): Promise<PostRecord | undefined> {
  const existing = await getPost(id);
  if (!existing) return undefined;
  const next: PostRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  try {
    await db.put(postKey(id), next as unknown as any);
  } catch (err: any) {
    logger.error('update post failed', { id, error: err?.message });
    throw err;
  }
  logger.info('post updated', { id });
  return next;
}

export async function deletePost(id: string): Promise<PostRecord | undefined> {
  const existing = await getPost(id);
  if (!existing) return undefined;
  try {
    await db.del(postKey(id));
  } catch (err: any) {
    logger.error('delete post failed', { id, error: err?.message });
    throw err;
  }
  logger.warn('post deleted', { id });
  return existing;
}
