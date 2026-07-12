import { Queue, Worker } from 'bullmq';
import { config } from '../config';
import logger from '../config/logger';
import { sendEmail, sendWelcomeEmail, sendPasswordResetEmail, sendEmailVerification } from '../services/email.service';

const connectionOptions = { host: config.redis.host, port: config.redis.port, password: config.redis.password };

export const notificationQueue = new Queue('notifications', { connection: connectionOptions });
export const emailQueue = new Queue('email', { connection: connectionOptions });
export const aiQueue = new Queue('ai-recommendations', { connection: connectionOptions });
export const reportQueue = new Queue('reports', { connection: connectionOptions });
export const maintenanceQueue = new Queue('maintenance-scheduler', { connection: connectionOptions });
export const auditQueue = new Queue('audit-export', { connection: connectionOptions });
export const cleanupQueue = new Queue('cleanup', { connection: connectionOptions });
export const imageQueue = new Queue('image-processing', { connection: connectionOptions });

const createWorker = (name: string, handler: (jobData: unknown) => Promise<unknown>): Worker => {
  const worker = new Worker(name, async (job) => {
    logger.info({ job: job.name, id: job.id, queue: name }, 'Processing job');
    try {
      const result = await handler(job.data);
      logger.info({ job: job.name, id: job.id, queue: name }, 'Job completed');
      return result;
    } catch (error) {
      logger.error({ job: job.name, id: job.id, queue: name, error }, 'Job failed');
      throw error;
    }
  }, { connection: connectionOptions, concurrency: 5 });

  worker.on('failed', (job, error) => {
    logger.error({ job: job?.name, id: job?.id, queue: name, error: error.message }, 'Job failed permanently');
  });

  worker.on('completed', (job) => {
    logger.debug({ job: job.name, id: job.id, queue: name }, 'Job finished');
  });

  return worker;
};

// ─── NOTIFICATION WORKER ──────────────────────────────────
createWorker('notifications', async (data: any) => {
  logger.info({ type: data.type, userId: data.userId }, 'Sending notification');
  return { delivered: true };
});

// ─── EMAIL WORKER ─────────────────────────────────────────
createWorker('email', async (data: any) => {
  const { type, to, firstName, subject, html, tempPassword, resetToken, verificationToken } = data;
  logger.info({ to, type }, 'Processing email job');

  switch (type) {
    case 'WELCOME':
      await sendWelcomeEmail(to, firstName || '', tempPassword);
      break;
    case 'PASSWORD_RESET':
      await sendPasswordResetEmail(to, firstName || '', resetToken || '');
      break;
    case 'EMAIL_VERIFICATION':
      await sendEmailVerification(to, firstName || '', verificationToken || '');
      break;
    case 'CUSTOM':
      if (subject && html) {
        await sendEmail({ to, subject, html });
      }
      break;
    default:
      await sendEmail({ to, subject: subject || 'Assetrix Notification', html: html || '<p>You have a new notification.</p>' });
  }

  return { sent: true };
});

// ─── AI RECOMMENDATION WORKER ─────────────────────────────
createWorker('ai-recommendations', async (data: any) => {
  logger.info({ assetId: data.assetId }, 'Generating AI recommendation');
  return { recommendations: [] };
});

// ─── REPORT WORKER ────────────────────────────────────────
createWorker('reports', async (data: any) => {
  logger.info({ reportId: data.reportId, type: data.format }, 'Generating report file');
  return { reportUrl: `/api/v1/reports/${data.reportId}/download` };
});

// ─── MAINTENANCE SCHEDULER WORKER ─────────────────────────
createWorker('maintenance-scheduler', async (data: any) => {
  logger.info({ assetId: data.assetId }, 'Scheduling maintenance');
  return { scheduled: true };
});

// ─── AUDIT EXPORT WORKER ──────────────────────────────────
createWorker('audit-export', async (data: any) => {
  logger.info({ format: data.format }, 'Exporting audit logs');
  return { exportUrl: '' };
});

// ─── CLEANUP WORKER ───────────────────────────────────────
createWorker('cleanup', async () => {
  logger.info('Running cleanup job');
  return { cleaned: true };
});

// ─── IMAGE PROCESSING WORKER ──────────────────────────────
createWorker('image-processing', async (data: any) => {
  logger.info({ file: data.file }, 'Processing image');
  return { processed: true };
});

export const setupQueues = (): void => {
  logger.info('Queue workers initialized');
};
