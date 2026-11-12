// server/src/validations/product.validation.js
const { z } = require('zod');

const parseBoolean = z.preprocess((val) => {
  if (val === 'true' || val === true) return true;
  if (val === 'false' || val === false) return false;
  return val;
}, z.boolean());

const variantInputSchema = z.object({
  sku: z.string().trim().min(2, 'SKU không hợp lệ').max(80),
  size: z.string().trim().min(1, 'Size không được trống').max(30),
  color: z.string().trim().min(1, 'Màu sắc không được trống').max(50),
  colorHex: z.string().trim().max(20).optional().nullable(),
  price: z.coerce.number().positive('Giá biến thể phải lớn hơn 0'),
  stockQuantity: z.coerce.number().int().min(0, 'Tồn kho không được âm'),
});

const parseVariants = z.preprocess((val) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}, z.array(variantInputSchema).min(1, 'Sản phẩm cần ít nhất 1 biến thể'));

const listProductsSchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(60).default(12),
    q: z.string().trim().optional(),
    category: z.string().trim().optional(),
    gender: z.enum(['men', 'women', 'unisex']).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    size: z.string().trim().optional(),
    color: z.string().trim().optional(),
    featured: parseBoolean.optional(),
    sort: z
      .enum(['newest', 'price_asc', 'price_desc', 'best_selling', 'rating'])
      .optional()
      .default('newest'),
    includeInactive: parseBoolean.optional(),
  }),
};

const createProductSchema = {
  body: z.object({
    categoryId: z.coerce.number().int().positive('Danh mục không hợp lệ'),
    name: z.string().trim().min(2, 'Tên sản phẩm tối thiểu 2 ký tự').max(200),
    description: z.string().trim().optional(),
    basePrice: z.coerce.number().positive('Giá gốc phải lớn hơn 0'),
    salePrice: z.preprocess(
      (v) => (v === '' || v === null || v === undefined ? null : v),
      z.coerce.number().positive().nullable()
    ).optional(),
    gender: z.enum(['men', 'women', 'unisex']).optional().default('unisex'),
    isFeatured: parseBoolean.optional().default(false),
    isActive: parseBoolean.optional().default(true),
    variants: parseVariants,
  }),
};

const updateProductSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    categoryId: z.coerce.number().int().positive().optional(),
    name: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().optional(),
    basePrice: z.coerce.number().positive().optional(),
    salePrice: z
      .preprocess(
        (v) => (v === '' || v === 'null' || v === null ? null : v),
        z.coerce.number().positive().nullable()
      )
      .optional(),
    gender: z.enum(['men', 'women', 'unisex']).optional(),
    isFeatured: parseBoolean.optional(),
    isActive: parseBoolean.optional(),
    removeImageIds: z
      .preprocess((val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch {
            return [];
          }
        }
        return val;
      }, z.array(z.coerce.number().int().positive()))
      .optional(),
  }),
};

const createVariantSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: variantInputSchema,
};

const updateVariantSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
    variantId: z.coerce.number().int().positive(),
  }),
  body: variantInputSchema.partial(),
};

module.exports = {
  listProductsSchema,
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
};
