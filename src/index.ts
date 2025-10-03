import express from 'express';
import dotenv from 'dotenv';
import postsRouter from './routes/posts';
import txnsRouter from './routes/txns';
import membersRouter from './routes/members';
import path from 'path';
import cors from 'cors';
import { uploadDir } from './utils/upload';
import requestLogger from './middleware/requestLogger';
import logger, { setLogLevel } from './log';
import { verifyDb } from './service/db';

dotenv.config();
setLogLevel((process.env.LOG_LEVEL as any) || 'info');
logger.info('booting service', {
  node: process.version,
  env: process.env.NODE_ENV || 'development',
});

async function main() {
  try {
    // Verify DB on boot and fail fast if unavailable
    await verifyDb();
  } catch (e: any) {
    logger.error('db verification failed on boot', { error: e?.message });
    process.exit(1);
  }

  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(requestLogger);
  app.use(cors());
  logger.info('middleware configured', { staticUploads: '/uploads' });

  // Serve uploaded files statically (for convenience in dev)
  app.use('/uploads', express.static(path.resolve(uploadDir)));
  app.use('/', express.static(path.resolve(process.cwd(), 'public')));

  // Basic health check
  app.get('/health', (req, res) => {
    logger.debug('health check', { reqId: (req as any).reqId });
    res.json({ ok: true, service: 'npo-api-skeleton' });
  });

  // Mount routers under /api
  app.use('/api', postsRouter);
  app.use('/api', txnsRouter);
  app.use('/api', membersRouter);
  logger.info('routers mounted', { routes: ['/api/*'] });

  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  app.listen(PORT, () => {
    logger.info('API listening', { url: `http://localhost:${PORT}` });
  });

  // Global error handler (last)
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('unhandled error', { error: err?.message, stack: err?.stack });
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

// eslint-disable-next-line no-floating-promises
main();
