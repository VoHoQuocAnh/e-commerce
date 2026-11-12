// server/src/validations/user.validation.js
const { z } = require('zod');
const ROLES = require('../constants/roles');

const updateProfileSchema = {
  body: z.object({
    fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự').max(120).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ')
      .optional()
      .or(z.literal('')),
  }),
};

const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự').max(100),
  }),
};

const adminUpdateUserSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    role: z.enum([ROLES.USER, ROLES.ADMIN]).optional(),
    isActive: z.boolean().optional(),
  }),
};

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  adminUpdateUserSchema,
};
