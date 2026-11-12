// server/src/validations/address.validation.js
const { z } = require('zod');

const addressBody = z.object({
  recipientName: z.string().trim().min(2, 'Tên người nhận tối thiểu 2 ký tự').max(120),
  recipientPhone: z
    .string()
    .trim()
    .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
  province: z.string().trim().min(1, 'Vui lòng chọn Tỉnh/Thành phố').max(100),
  district: z.string().trim().min(1, 'Vui lòng chọn Quận/Huyện').max(100),
  ward: z.string().trim().min(1, 'Vui lòng chọn Phường/Xã').max(100),
  streetAddress: z.string().trim().min(3, 'Địa chỉ chi tiết tối thiểu 3 ký tự').max(255),
  isDefault: z.boolean().optional().default(false),
});

const createAddressSchema = {
  body: addressBody,
};

const updateAddressSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: addressBody.partial(),
};

const addressIdParamSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

module.exports = {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
};
