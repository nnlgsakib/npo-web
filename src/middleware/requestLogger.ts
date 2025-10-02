import { NextFunction, Request, Response } from 'express';
import logger from '../log';

declare module 'express-serve-static-core' {
  interface Request {
    reqId?: string;
  }
}

function genId() {
  // Simple, fast request id
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function requestLogger(req: Request, res: Response, next: NextFunction) {
  const reqId = req.headers['x-request-id']?.toString() || genId();
  req.reqId = reqId;
  const l = logger.child({ reqId, method: req.method, path: req.originalUrl });

  const start = Date.now();
  const contentLength = req.headers['content-length'];
  l.info('incoming request', {
    contentLength: contentLength ? Number(contentLength) : undefined,
    ip: req.ip,
  });

  res.on('finish', () => {
    const ms = Date.now() - start;
    l.info('request completed', { status: res.statusCode, durationMs: ms });
  });

  next();
}
