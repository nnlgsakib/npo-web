import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { svc: 'npo-api' },
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          singleLine: true,
        },
      },
});

export function setLogLevel(level: string) {
  try {
    (logger as any).level = level;
  } catch {
    // ignore invalid levels
  }
}

export default logger;

