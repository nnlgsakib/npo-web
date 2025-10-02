import path from 'path';
import fs from 'fs';
import logger from '../log';

export type Json = any;

const dataDir = process.env.DB_FALLBACK_PATH
  ? path.resolve(process.env.DB_FALLBACK_PATH)
  : path.resolve(process.cwd(), 'data');
const postsPath = path.join(dataDir, 'posts.json');

function ensureDir() {
  try { fs.mkdirSync(dataDir, { recursive: true }); } catch {}
}

function readJson<T>(filePath: string, def: T): T {
  try {
    const buf = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(buf) as T;
  } catch (e) {
    return def;
  }
}

function writeJson(filePath: string, data: Json) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export type PostRecordFS = {
  id: string;
  title: string;
  subTitle?: string;
  description: string;
  imageUrl?: string;
  imagePath?: string;
  createdAt: string;
  updatedAt: string;
};

export function fsCreatePost(post: PostRecordFS): void {
  ensureDir();
  const list = readJson<PostRecordFS[]>(postsPath, []);
  list.push(post);
  writeJson(postsPath, list);
  logger.warn('stored post in filesystem fallback', { id: post.id, postsPath });
}

export function fsGetPost(id: string): PostRecordFS | undefined {
  const list = readJson<PostRecordFS[]>(postsPath, []);
  return list.find(p => p.id === id);
}

export function fsUpdatePost(id: string, updates: Partial<PostRecordFS>): PostRecordFS | undefined {
  const list = readJson<PostRecordFS[]>(postsPath, []);
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  const next = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  list[idx] = next;
  writeJson(postsPath, list);
  return next;
}

export function fsDeletePost(id: string): PostRecordFS | undefined {
  const list = readJson<PostRecordFS[]>(postsPath, []);
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  const [removed] = list.splice(idx, 1);
  writeJson(postsPath, list);
  return removed;
}

export function fsListSummary(): Array<{ id: string; title: string; image: string | null; timestamp: string }> {
  const list = readJson<PostRecordFS[]>(postsPath, []);
  const out = list.map(p => ({ id: p.id, title: p.title, image: p.imageUrl ?? (p.imagePath ? `/uploads/${p.imagePath}` : null), timestamp: p.createdAt }));
  out.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return out;
}
