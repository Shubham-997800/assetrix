import { PrismaClient } from '@prisma/client';
import { config } from './index';
import logger from './logger';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

prisma.$on('query', (e) => {
  if (config.nodeEnv === 'development') {
    logger.debug({ query: e.query, duration: `${e.duration}ms` }, 'Prisma Query');
  }
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL connected successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to PostgreSQL');
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('PostgreSQL disconnected');
};

export default prisma;
