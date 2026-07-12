import nodemailer from 'nodemailer';
import { config } from '../config';
import logger from '../config/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transport = getTransporter();
    const info = await transport.sendMail({
      from: config.email.from || `"Assetrix" <${config.email.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logger.info({ messageId: info.messageId, to: options.to }, 'Email sent successfully');
    return true;
  } catch (error) {
    logger.error({ error, to: options.to, subject: options.subject }, 'Failed to send email');
    return false;
  }
};

export const sendWelcomeEmail = async (email: string, firstName: string, tempPassword?: string) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to Assetrix',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0891B2; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Welcome to Assetrix</h1>
        </div>
        <div style="background: #F8FAFC; padding: 24px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #334155; font-size: 15px;">Hi ${firstName},</p>
          <p style="color: #475569; font-size: 14px;">Your account has been created on Assetrix Enterprise Asset Management.</p>
          ${tempPassword ? `<p style="color: #475569; font-size: 14px;">Your temporary password: <strong style="color: #0891B2;">${tempPassword}</strong></p>` : ''}
          <p style="color: #475569; font-size: 14px;">Please log in and change your password.</p>
          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
            <p style="color: #94A3B8; font-size: 12px;">This is an automated message from Assetrix.</p>
          </div>
        </div>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, firstName: string, resetToken: string) => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

  return sendEmail({
    to: email,
    subject: 'Assetrix - Password Reset Request',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0891B2; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Password Reset</h1>
        </div>
        <div style="background: #F8FAFC; padding: 24px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #334155; font-size: 15px;">Hi ${firstName},</p>
          <p style="color: #475569; font-size: 14px;">You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="background: #0891B2; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Reset Password</a>
          </div>
          <p style="color: #94A3B8; font-size: 12px;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
        </div>
      </div>
    `,
  });
};

export const sendEmailVerification = async (email: string, firstName: string, verificationToken: string) => {
  const verifyUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;

  return sendEmail({
    to: email,
    subject: 'Assetrix - Verify Your Email',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0891B2; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Email Verification</h1>
        </div>
        <div style="background: #F8FAFC; padding: 24px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #334155; font-size: 15px;">Hi ${firstName},</p>
          <p style="color: #475569; font-size: 14px;">Please verify your email address:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${verifyUrl}" style="background: #0891B2; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Verify Email</a>
          </div>
          <p style="color: #94A3B8; font-size: 12px;">This link expires in 24 hours.</p>
        </div>
      </div>
    `,
  });
};

export const sendMaintenanceNotification = async (
  email: string,
  firstName: string,
  taskTitle: string,
  assetName: string,
  status: string
) => {
  const statusColors: Record<string, string> = {
    ASSIGNED: '#0891B2',
    COMPLETED: '#16A34A',
    OVERDUE: '#DC2626',
    CANCELLED: '#9CA3AF',
  };

  return sendEmail({
    to: email,
    subject: `Assetrix - Maintenance ${status}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${statusColors[status] || '#0891B2'}; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Maintenance ${status}</h1>
        </div>
        <div style="background: #F8FAFC; padding: 24px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #334155; font-size: 15px;">Hi ${firstName},</p>
          <p style="color: #475569; font-size: 14px;">Maintenance task <strong>"${taskTitle}"</strong> for asset <strong>"${assetName}"</strong> has been ${status.toLowerCase()}.</p>
          <p style="color: #94A3B8; font-size: 12px; margin-top: 20px;">Assetrix Asset Management</p>
        </div>
      </div>
    `,
  });
};

export const sendBookingNotification = async (
  email: string,
  firstName: string,
  assetName: string,
  assetTag: string,
  status: string
) => {
  return sendEmail({
    to: email,
    subject: `Assetrix - Booking ${status}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0891B2; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Booking ${status}</h1>
        </div>
        <div style="background: #F8FAFC; padding: 24px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #334155; font-size: 15px;">Hi ${firstName},</p>
          <p style="color: #475569; font-size: 14px;">Your booking for <strong>"${assetName}"</strong> (${assetTag}) has been <strong>${status.toLowerCase()}</strong>.</p>
          <p style="color: #94A3B8; font-size: 12px; margin-top: 20px;">Assetrix Asset Management</p>
        </div>
      </div>
    `,
  });
};

export const sendAllocationNotification = async (
  email: string,
  firstName: string,
  assetName: string,
  assetTag: string,
  status: string
) => {
  return sendEmail({
    to: email,
    subject: `Assetrix - Asset ${status}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0891B2; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Asset ${status}</h1>
        </div>
        <div style="background: #F8FAFC; padding: 24px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #334155; font-size: 15px;">Hi ${firstName},</p>
          <p style="color: #475569; font-size: 14px;">Asset <strong>"${assetName}"</strong> (${assetTag}) has been <strong>${status.toLowerCase()}</strong>.</p>
          <p style="color: #94A3B8; font-size: 12px; margin-top: 20px;">Assetrix Asset Management</p>
        </div>
      </div>
    `,
  });
};

export const sendWarrantyExpiryEmail = async (
  email: string,
  firstName: string,
  assetName: string,
  assetTag: string,
  expiryDate: Date
) => {
  return sendEmail({
    to: email,
    subject: 'Assetrix - Warranty Expiry Alert',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #F59E0B; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Warranty Expiry Alert</h1>
        </div>
        <div style="background: #F8FAFC; padding: 24px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #334155; font-size: 15px;">Hi ${firstName},</p>
          <p style="color: #475569; font-size: 14px;">The warranty for asset <strong>"${assetName}"</strong> (${assetTag}) is expiring on <strong>${expiryDate.toLocaleDateString('en-IN')}</strong>.</p>
          <p style="color: #94A3B8; font-size: 12px; margin-top: 20px;">Assetrix Asset Management</p>
        </div>
      </div>
    `,
  });
};
