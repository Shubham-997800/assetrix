import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './config';
import prisma, { connectDatabase, disconnectDatabase } from './config/database';
import { getRedisConnection, closeRedis } from './config/redis';
import logger from './config/logger';
import { swaggerSpec } from './config/swagger';
import { requestLogger } from './middleware/logger';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/error';
import { auditRouter } from './routes/audit.routes';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import { departmentRouter } from './routes/department.routes';
import { assetRouter } from './routes/asset.routes';
import { allocationRouter } from './routes/allocation.routes';
import { bookingRouter } from './routes/booking.routes';
import { maintenanceRouter } from './routes/maintenance.routes';
import { notificationRouter } from './routes/notification.routes';
import { notificationPreferenceRouter } from './routes/notification-preference.routes';
import { auditCycleRouter } from './routes/audit-cycle.routes';
import { assetCategoryRouter } from './routes/asset-category.routes';
import { analyticsRouter } from './routes/analytics.routes';
import { reportRouter } from './routes/report.routes';
import { adminRouter } from './routes/admin.routes';
import { aiRouter } from './routes/ai.routes';
import swaggerUi from 'swagger-ui-express';

const app = express();

// ─── GLOBAL MIDDLEWARE ────────────────────────────────────
app.use(helmet());
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(requestLogger);
app.use(rateLimiter);

// ─── STATIC FILES ─────────────────────────────────────────
app.use('/uploads', express.static(config.upload.dir));

// ─── SWAGGER DOCUMENTATION (dev only) ──────────────────────
if (config.nodeEnv !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Assetrix API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  }));
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

// ─── HEALTH CHECK ─────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ─── API ROUTES ───────────────────────────────────────────
const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/departments', departmentRouter);
apiRouter.use('/assets', assetRouter);
apiRouter.use('/allocations', allocationRouter);
apiRouter.use('/bookings', bookingRouter);
apiRouter.use('/maintenance', maintenanceRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/notification-preferences', notificationPreferenceRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/reports', reportRouter);
apiRouter.use('/audit', auditRouter);
apiRouter.use('/audit-cycles', auditCycleRouter);
apiRouter.use('/asset-categories', assetCategoryRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/ai', aiRouter);
app.use(`/api/${config.apiVersion}`, apiRouter);

// ─── ERROR HANDLING ───────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── SERVER START ─────────────────────────────────────────
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await getRedisConnection();
    logger.info('Redis connected');

    app.listen(config.port, () => {
      logger.info(`Assetrix API running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`API Docs: http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// ─── GRACEFUL SHUTDOWN ────────────────────────────────────
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  await disconnectDatabase();
  await closeRedis();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'Unhandled rejection');
});
process.on('uncaughtException', (error: Error) => {
  logger.error({ error: error.message, stack: error.stack }, 'Uncaught exception');
  process.exit(1);
});

startServer();

export default app;
