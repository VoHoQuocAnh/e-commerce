// server/src/validations/auth.validation.js
const { z } = require('zod');

const registerSchema = {
  body: z.object({
    email: z.string().trim().email('Email không hợp lệ').max(150),
    password: z
      .string()
      .min(6, 'Mật khẩu tối thiểu 6 ký tự')
      .max(100, 'Mật khẩu tối đa 100 ký tự'),
    fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự').max(120),
    phone: z
      .string()
      .trim()
      .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại Việt Nam không hợp lệ')
      .optional()
      .or(z.literal('')),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().trim().email('Email không hợp lệ'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  }),
};

const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().min(1, 'Thiếu refresh token').optional(),
  }),
};

const forgotPasswordSchema = {
  body: z.object({
    email: z.string().trim().email('Email không hợp lệ'),
  }),
};

const resetPasswordSchema = {
  body: z.object({
    token: z.string().min(10, 'Token không hợp lệ'),
    newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự').max(100),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
