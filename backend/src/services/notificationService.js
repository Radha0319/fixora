// NOTIFY: In-app and email notification service with explicit boundary
import nodemailer from 'nodemailer';
import { Notification } from '../models/Notification.js';
import { ENV } from '../config/env.js';

let mailTransporter = null;

// Initialize mail transporter only if SMTP settings are present
if (ENV.EMAIL_HOST && ENV.EMAIL_USER && ENV.EMAIL_PASSWORD) {
  mailTransporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: ENV.EMAIL_PORT === 465,
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASSWORD
    }
  });
}

export const createNotification = async ({ recipientId, title, message, type = 'SYSTEM', link = '' }) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      link
    });
    return notification;
  } catch (error) {
    console.error(`[NOTIFY: ERROR] Failed to create in-app notification: ${error.message}`);
    return null;
  }
};

export const sendNotificationEmail = async ({ toEmail, subject, textContent, htmlContent }) => {
  // If email service credentials are not configured, do not fake sending
  if (!mailTransporter) {
    console.log(`[NOTIFY: EMAIL_BOUNDARY (NOT_CONFIGURED)] Email simulation logged.`);
    console.log(`  To: ${toEmail} | Subject: ${subject}`);
    console.log(`  Content: ${textContent}`);
    return {
      sent: false,
      status: 'NOT_CONFIGURED',
      message: 'Email service credentials are not configured in environment.'
    };
  }

  try {
    const info = await mailTransporter.sendMail({
      from: `"Fixora Platform" <${ENV.EMAIL_USER}>`,
      to: toEmail,
      subject,
      text: textContent,
      html: htmlContent
    });
    return {
      sent: true,
      status: 'SENT',
      messageId: info.messageId
    };
  } catch (error) {
    console.error(`[NOTIFY: EMAIL_ERROR] Failed sending email to ${toEmail}: ${error.message}`);
    return {
      sent: false,
      status: 'FAILED',
      error: error.message
    };
  }
};
