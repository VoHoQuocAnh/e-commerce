// server/src/services/category.service.js
const slugify = require('slugify');
const { Category, Product } = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');
const cacheService = require('./cache.service');

const CACHE_KEY_CATEGORIES = 'categories:list';

const buildUniqueSlug = async (name, excludeId = null) => {
  const baseSlug = slugify(name, { lower: true, strict: true, locale: 'vi' });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Category.findOne({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
};

const listCategories = async ({ includeInactive = false } = {}) => {
  if (!includeInactive) {
    const cached = await cacheService.get(CACHE_KEY_CATEGORIES);
    if (cached) return cached;
  }

  const where = includeInactive ? {} : { isActive: true };
  const categories = await Category.findAll({
    where,
    include: [
      {
        model: Category,
        as: 'children',
        where: includeInactive ? undefined : { isActive: true },
        required: false,
      },
    ],
    order: [['id', 'ASC']],
  });

  if (!includeInactive) {
    await cacheService.set(CACHE_KEY_CATEGORIES, categories, 600);
  }
  return categories;
};

const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({
    where: { slug, isActive: true },
    include: [{ model: Category, as: 'children', required: false }],
  });
  if (!category) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy danh mục');
  }
  return category;
};

const createCategory = async (payload) => {
  const slug = await buildUniqueSlug(payload.name);
  const category = await Category.create({ ...payload, slug });
  await cacheService.del(CACHE_KEY_CATEGORIES);
  return category;
};

const updateCategory = async (id, payload) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy danh mục');
  }

  if (payload.name && payload.name !== category.name) {
    payload.slug = await buildUniqueSlug(payload.name, category.id);
  }

  await category.update(payload);
  await cacheService.del(CACHE_KEY_CATEGORIES);
  await cacheService.delByPattern('products:*');
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy danh mục');
  }

  const productCount = await Product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new ApiError(
      HTTP_CODES.CONFLICT,
      'Không thể xóa danh mục đang chứa sản phẩm. Hãy chuyển hoặc xóa sản phẩm trước.'
    );
  }

  await category.destroy();
  await cacheService.del(CACHE_KEY_CATEGORIES);
};

module.exports = {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
