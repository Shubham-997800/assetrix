import nodemailer from "nodemailer";
import { config } from "../../config/env";
import logger from "../../config/logger";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!config.email.enabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: { user: config.email.user, pass: config.email.pass },
    });
  }
  return transporter;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    logger.debug({ to, subject }, "Email disabled, skipping send");
    return;
  }
  try {
    await transport.sendMail({ from: config.email.from, to, subject, html });
    logger.debug({ to, subject }, "Email sent");
  } catch (error) {
    logger.error({ to, subject, error }, "Email send failed");
  }
}

export function emailTemplate(title: string, bodyHtml: string, ctaLabel?: string, ctaUrl?: string): string {
  const cta = ctaLabel && ctaUrl
    ? `<p style="text-align:center;margin:28px 0;">
         <a href="${ctaUrl}" style="background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">${ctaLabel}</a>
       </p>`
    : "";
  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827;">
      <div style="background:#0f172a;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
        <span style="font-size:20px;font-weight:700;">Assetrix</span>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
        <h2 style="margin-top:0;font-size:18px;">${title}</h2>
        ${bodyHtml}
        ${cta}
        <p style="color:#6b7280;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    </div>`;
}
