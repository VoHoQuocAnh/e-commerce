// server/src/validations/category.validation.js
const { z } = require('zod');

const parseBoolean = z.preprocess((val) => {
  if (val === 'true' || val === true) return true;
  if (val === 'false' || val === false) return false;
  return val;
}, z.boolean());

const createCategorySchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Tên danh mục tối thiểu 2 ký tự').max(120),
    parentId: z.coerce.number().int().positive().nullable().optional(),
    description: z.string().trim().max(1000).optional(),
    imageUrl: z.string().trim().url().optional().or(z.literal('')),
    isActive: parseBoolean.optional().default(true),
  }),
};

const updateCategorySchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: createCategorySchema.body.partial(),
};

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
