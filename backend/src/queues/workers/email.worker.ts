import { Job } from 'bullmq';
import logger from '../../config/logger';
import * as emailService from '../email.service';

interface EmailJobData {
  type: 'WELCOME' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION' | 'MAINTENANCE' | 'BOOKING' | 'ALLOCATION' | 'WARRANTY' | 'CUSTOM';
  to: string;
  firstName?: string;
  subject?: string;
  html?: string;
  tempPassword?: string;
  resetToken?: string;
  verificationToken?: string;
  assetName?: string;
  assetTag?: string;
  taskTitle?: string;
  status?: string;
  expiryDate?: string;
}

export const emailWorker = async (job: Job<EmailJobData>) => {
  const { type } = job.data;

  logger.info({ jobId: job.id, type, to: job.data.to }, 'Processing email job');

  try {
    switch (type) {
      case 'WELCOME':
        await emailService.sendWelcomeEmail(job.data.to, job.data.firstName || '', job.data.tempPassword);
        break;

      case 'PASSWORD_RESET':
        await emailService.sendPasswordResetEmail(job.data.to, job.data.firstName || '', job.data.resetToken || '');
        break;

      case 'EMAIL_VERIFICATION':
        await emailService.sendEmailVerification(job.data.to, job.data.firstName || '', job.data.verificationToken || '');
        break;

      case 'MAINTENANCE':
        await emailService.sendMaintenanceNotification(
          job.data.to,
          job.data.firstName || '',
          job.data.taskTitle || '',
          job.data.assetName || '',
          job.data.status || 'ASSIGNED'
        );
        break;

      case 'BOOKING':
        await emailService.sendBookingNotification(
          job.data.to,
          job.data.firstName || '',
          job.data.assetName || '',
          job.data.assetTag || '',
          job.data.status || 'APPROVED'
        );
        break;

      case 'ALLOCATION':
        await emailService.sendAllocationNotification(
          job.data.to,
          job.data.firstName || '',
          job.data.assetName || '',
          job.data.assetTag || '',
          job.data.status || 'ASSIGNED'
        );
        break;

      case 'WARRANTY':
        await emailService.sendWarrantyExpiryEmail(
          job.data.to,
          job.data.firstName || '',
          job.data.assetName || '',
          job.data.assetTag || '',
          new Date(job.data.expiryDate || Date.now())
        );
        break;

      case 'CUSTOM':
        if (job.data.subject && job.data.html) {
          await emailService.sendEmail({
            to: job.data.to,
            subject: job.data.subject,
            html: job.data.html,
          });
        }
        break;

      default:
        logger.warn({ jobId: job.id, type }, 'Unknown email job type');
    }

    logger.info({ jobId: job.id, type, to: job.data.to }, 'Email job completed');
  } catch (error) {
    logger.error({ jobId: job.id, type, error }, 'Email job failed');
    throw error;
  }
};
