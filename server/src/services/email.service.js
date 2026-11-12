// server/src/services/email.service.js
const nodemailer = require('nodemailer');
const env = require('../config/environment');
const logger = require('../utils/logger');

const createTransporter = () => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  if (!transporter) {
    logger.info(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return { mocked: true };
  }

  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
  return info;
};

const sendResetPasswordEmail = async (email, fullName, resetToken) => {
  const resetLink = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="margin: 0 0 12px; color: #111827;">CALEM STUDIO — Khôi phục mật khẩu</h2>
      <p>Xin chào <strong>${fullName}</strong>,</p>
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào nút bên dưới để thiết lập mật khẩu mới (hiệu lực trong 15 phút):</p>
      <div style="margin: 24px 0;">
        <a href="${resetLink}" style="background: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Đặt lại mật khẩu
        </a>
      </div>
      <p style="font-size: 13px; color: #6b7280;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
    </div>
  `;
  return sendEmail({
    to: email,
    subject: 'Khôi phục mật khẩu tài khoản CALEM STUDIO',
    html,
  });
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
};
