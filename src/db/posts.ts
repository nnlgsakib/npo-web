import path from 'path';
import fs from 'fs';
import { Level } from 'level';

export type Post = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: {
    url?: string; // external URL
    localPath?: string; // local filesystem path
    publicUrl?: string; // served via /uploads
    mimetype?: string;
    size?: number;
    originalName?: string;
  };
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR = process.env.DATA_DIR || 'data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Single LevelDB for now; JSON value encoding
const db = new Level<string, any>(path.join(DATA_DIR, 'posts-db'), {
  valueEncoding: 'json',
});

const postKey = (id: string) => `post!${id}`;

export async function putPost(post: Post): Promise<void> {
  await db.put(postKey(post.id), post);
}

export async function getPost(id: string): Promise<Post | undefined> {
  try {
    const v = await db.get(postKey(id));
    return v as Post;
  } catch (err: any) {
    if (err && err.code === 'LEVEL_NOT_FOUND') return undefined;
    throw err;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    await db.del(postKey(id));
    return true;
  } catch (err: any) {
    if (err && err.code === 'LEVEL_NOT_FOUND') return false;
    throw err;
  }
}

export async function listPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  for await (const [key, value] of db.iterator({ gte: 'post!', lt: 'post!~' })) {
    void key; // unused
    posts.push(value as Post);
  }
  // newest first
  posts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return posts;
}

export function generateId(): string {
  // timestamp + random suffix
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
  );
}

