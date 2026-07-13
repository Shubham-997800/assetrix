import Redis from 'ioredis';
import { config } from './index';
import logger from './logger';

let redis: Redis | null = null;

export const getRedisConnection = async (): Promise<Redis> => {
  if (!redis) {
    const opts: Record<string, unknown> = config.redis.url
      ? {
          lazyConnect: true,
          retryStrategy(times: number) {
            const delay = Math.min(times * 200, 2000);
            return delay;
          },
        }
      : {
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          retryStrategy(times: number) {
            const delay = Math.min(times * 200, 2000);
            return delay;
          },
        };

    redis = config.redis.url ? new Redis(config.redis.url, opts) : new Redis(opts);

    redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redis.on('error', (error) => {
      logger.error({ error }, 'Redis connection error');
    });

    redis.on('close', () => {
      logger.warn('Redis connection closed');
    });

    try {
      await redis.connect();
    } catch (err) {
      logger.error({ error: err }, 'Redis initial connection failed');
    }
  }
  return redis;
};

export const closeRedis = async (): Promise<void> => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};
