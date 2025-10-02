import { Request, Response, NextFunction } from 'express';
import logger from '../log';

/**
 * Simple admin auth using a static header-based key.
 * - Set ADMIN_KEY in environment (e.g., .env)
 * - Call admin routes with header: `x-admin-key: <ADMIN_KEY>`
 */
export default function adminOnly(req: Request, res: Response, next: NextFunction) {
  const provided = req.header('x-admin-key');
  const expected = process.env.ADMIN_KEY;

  if (!expected) {
    logger.error('adminOnly missing ADMIN_KEY');
    return res.status(500).json({ error: 'Server misconfigured: ADMIN_KEY not set' });
  }

  if (!provided || provided !== expected) {
    logger.warn('adminOnly rejected request');
    return res.status(403).json({ error: 'Admin access required' });
  }

  return next();
}
