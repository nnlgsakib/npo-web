import { Level } from 'level';
import path from 'path';
import fs from 'fs';
import logger from '../log';

// Path for LevelDB storage
const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.resolve(process.cwd(), 'data', 'db');

// Ensure DB directory exists before opening
try {
  fs.mkdirSync(dbPath, { recursive: true });
} catch (e: any) {
  logger.warn('failed to ensure db directory', { dbPath, error: e?.message });
}

// Create a single DB instance for the app
logger.info('initializing leveldb', { dbPath });
export const db = new Level<string, any>(dbPath, { valueEncoding: 'json' as any });

// Verify DB availability early
export async function verifyDb(): Promise<void> {
  const k = `__ping__:${Date.now()}`;
  const v = { ok: true };
  try {
    await db.put(k, v as any);
    const got = await db.get(k);
    if (!got || got.ok !== true) throw new Error('leveldb echo mismatch');
    await db.del(k);
    logger.info('leveldb verified');
  } catch (err: any) {
    logger.error('leveldb verification failed', { error: err?.message, code: err?.code, stack: err?.stack });
    throw err;
  }
}

// Helpers for simple sequences (not strictly atomic across processes)
export async function nextSequence(key: string): Promise<number> {
  const seqKey = `seq:${key}`;
  try {
    const cur: any = await db.get(seqKey);
    // Robust parse: handle number, string, or anything else
    let n = typeof cur === 'number' ? cur : parseInt(String(cur), 10);
    if (Number.isNaN(n)) {
      logger.warn('sequence corrupt value, resetting to 0', { key, cur });
      n = 0;
    }
    const next = n + 1;
    await db.put(seqKey, next as any);
    logger.debug('sequence increment', { key: key, value: next });
    return next;
  } catch (err: any) {
    // If not found, initialize to 1
    if (err && err.notFound) {
      await db.put(seqKey, 1 as any);
      logger.debug('sequence initialized', { key: key, value: 1 });
      return 1;
    }
    logger.error('sequence error', { key, error: err?.message, code: err?.code, stack: err?.stack });
    throw err;
  }
}
