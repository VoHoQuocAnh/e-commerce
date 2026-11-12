// server/src/services/product.service.js
const { Op } = require('sequelize');
const slugify = require('slugify');
const {
  sequelize,
  Product,
  ProductVariant,
  ProductImage,
  Category,
} = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');
const cacheService = require('./cache.service');
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require('../middlewares/uploadMiddleware');

const buildUniqueSlug = async (name, excludeId = null) => {
  const baseSlug = slugify(name, { lower: true, strict: true, locale: 'vi' });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({ where: { slug }, paranoid: false });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
};

const invalidateProductCache = async () => {
  await cacheService.delByPattern('products:*');
};

const listProducts = async (query) => {
  const {
    page = 1,
    limit = 12,
    q,
    category,
    gender,
    minPrice,
    maxPrice,
    minRating,
    size,
    color,
    featured,
    sort = 'newest',
    includeInactive = false,
  } = query;

  const cacheKey = `products:list:${JSON.stringify(query)}`;
  if (!includeInactive) {
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;
  }

  const where = {};
  if (!includeInactive) {
    where.isActive = true;
  }
  if (q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${q}%` } },
      { description: { [Op.like]: `%${q}%` } },
    ];
  }
  if (gender) {
    where.gender = gender;
  }
  if (featured !== undefined) {
    where.isFeatured = featured;
  }
  if (minRating !== undefined) {
    where.ratingAvg = { [Op.gte]: Number(minRating) };
  }

  // Filter by effective price COALESCE(sale_price, base_price)
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceConditions = [];
    if (minPrice !== undefined) {
      priceConditions.push(
        sequelize.where(sequelize.literal('COALESCE(Product.sale_price, Product.base_price)'), {
          [Op.gte]: Number(minPrice),
        })
      );
    }
    if (maxPrice !== undefined) {
      priceConditions.push(
        sequelize.where(sequelize.literal('COALESCE(Product.sale_price, Product.base_price)'), {
          [Op.lte]: Number(maxPrice),
        })
      );
    }
    where[Op.and] = [...(where[Op.and] || []), ...priceConditions];
  }

  // Filter by category slug or numeric id
  if (category) {
    if (/^\d+$/.test(String(category))) {
      where.categoryId = Number(category);
    } else {
      const cat = await Category.findOne({ where: { slug: category } });
      if (!cat) {
        return {
          items: [],
          meta: { page: Number(page), limit: Number(limit), totalItems: 0, totalPages: 0 },
        };
      }
      where.categoryId = cat.id;
    }
  }

  // Pre-filter product IDs by variant size/color to avoid pagination count distortion
  if (size || color) {
    const variantWhere = {};
    if (size) variantWhere.size = size;
    if (color) variantWhere.color = { [Op.like]: `%${color}%` };

    const matchingVariants = await ProductVariant.findAll({
      attributes: ['productId'],
      where: variantWhere,
      group: ['product_id'],
    });
    const productIds = matchingVariants.map((v) => v.productId);
    if (productIds.length === 0) {
      return {
        items: [],
        meta: { page: Number(page), limit: Number(limit), totalItems: 0, totalPages: 0 },
      };
    }
    where.id = { [Op.in]: productIds };
  }

  const orderMap = {
    newest: [['created_at', 'DESC']],
    price_asc: [[sequelize.literal('COALESCE(Product.sale_price, Product.base_price)'), 'ASC']],
    price_desc: [[sequelize.literal('COALESCE(Product.sale_price, Product.base_price)'), 'DESC']],
    best_selling: [['sold_count', 'DESC']],
    rating: [['rating_avg', 'DESC']],
  };

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Product.findAndCountAll({
    where,
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'colorRef', 'isThumbnail', 'sortOrder'],
        separate: true,
        order: [
          ['is_thumbnail', 'DESC'],
          ['sort_order', 'ASC'],
        ],
      },
      {
        model: ProductVariant,
        as: 'variants',
        attributes: ['id', 'sku', 'size', 'color', 'colorHex', 'price', 'stockQuantity'],
        separate: true,
      },
    ],
    distinct: true,
    limit: Number(limit),
    offset,
    order: orderMap[sort] || orderMap.newest,
  });

  const result = {
    items: rows,
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
    },
  };

  if (!includeInactive) {
    await cacheService.set(cacheKey, result, 300);
  }
  return result;
};

const getProductBySlug = async (slug) => {
  const cacheKey = `products:detail:${slug}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const product = await Product.findOne({
    where: { slug, isActive: true },
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      {
        model: ProductImage,
        as: 'images',
        order: [
          ['is_thumbnail', 'DESC'],
          ['sort_order', 'ASC'],
        ],
      },
      { model: ProductVariant, as: 'variants' },
    ],
  });

  if (!product) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy sản phẩm');
  }

  await cacheService.set(cacheKey, product, 300);
  return product;
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [
      { model: Category, as: 'category' },
      { model: ProductImage, as: 'images' },
      { model: ProductVariant, as: 'variants' },
    ],
  });
  if (!product) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy sản phẩm');
  }
  return product;
};

const createProduct = async (payload, files = []) => {
  const category = await Category.findByPk(payload.categoryId);
  if (!category) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Danh mục không tồn tại');
  }

  const slug = await buildUniqueSlug(payload.name);

  // Upload images before starting DB transaction to avoid holding locks during network I/O
  const uploadedImages = [];
  for (let i = 0; i < files.length; i += 1) {
    const res = await uploadBufferToCloudinary(files[i].buffer, 'calem-studio/products');
    uploadedImages.push({
      imageUrl: res.imageUrl,
      publicId: res.publicId,
      isThumbnail: i === 0,
      sortOrder: i + 1,
    });
  }

  const created = await sequelize.transaction(async (t) => {
    const product = await Product.create(
      {
        categoryId: payload.categoryId,
        name: payload.name,
        slug,
        description: payload.description || null,
        basePrice: payload.basePrice,
        salePrice: payload.salePrice || null,
        gender: payload.gender || 'unisex',
        isFeatured: payload.isFeatured ?? false,
        isActive: payload.isActive ?? true,
      },
      { transaction: t }
    );

    const variantRows = payload.variants.map((v) => ({
      ...v,
      productId: product.id,
    }));
    await ProductVariant.bulkCreate(variantRows, { transaction: t });

    if (uploadedImages.length > 0) {
      await ProductImage.bulkCreate(
        uploadedImages.map((img) => ({ ...img, productId: product.id })),
        { transaction: t }
      );
    }

    return product;
  });

  await invalidateProductCache();
  return getProductById(created.id);
};

const updateProduct = async (id, payload, files = []) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy sản phẩm');
  }

  if (payload.categoryId) {
    const category = await Category.findByPk(payload.categoryId);
    if (!category) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, 'Danh mục không tồn tại');
    }
  }

  const newImages = [];
  for (let i = 0; i < files.length; i += 1) {
    const res = await uploadBufferToCloudinary(files[i].buffer, 'calem-studio/products');
    newImages.push({
      productId: id,
      imageUrl: res.imageUrl,
      publicId: res.publicId,
      isThumbnail: false,
      sortOrder: 10 + i,
    });
  }

  const publicIdsToDelete = [];

  await sequelize.transaction(async (t) => {
    const updateData = { ...payload };
    delete updateData.removeImageIds;

    if (payload.name && payload.name !== product.name) {
      updateData.slug = await buildUniqueSlug(payload.name, product.id);
    }

    await product.update(updateData, { transaction: t });

    if (Array.isArray(payload.removeImageIds) && payload.removeImageIds.length > 0) {
      const imgs = await ProductImage.findAll({
        where: { id: { [Op.in]: payload.removeImageIds }, productId: id },
        transaction: t,
      });
      imgs.forEach((img) => {
        if (img.publicId) publicIdsToDelete.push(img.publicId);
      });
      await ProductImage.destroy({
        where: { id: { [Op.in]: payload.removeImageIds }, productId: id },
        transaction: t,
      });
    }

    if (newImages.length > 0) {
      const currentCount = await ProductImage.count({ where: { productId: id }, transaction: t });
      if (currentCount === 0) {
        newImages[0].isThumbnail = true;
      }
      await ProductImage.bulkCreate(newImages, { transaction: t });
    }
  });

  await Promise.all(publicIdsToDelete.map((pid) => deleteFromCloudinary(pid)));
  await invalidateProductCache();
  return getProductById(id);
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy sản phẩm');
  }
  await product.destroy(); // Soft delete (paranoid)
  await invalidateProductCache();
};

const addVariant = async (productId, payload) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy sản phẩm');
  }

  const variant = await ProductVariant.create({ ...payload, productId });
  await invalidateProductCache();
  return variant;
};

const updateVariant = async (productId, variantId, payload) => {
  const variant = await ProductVariant.findOne({ where: { id: variantId, productId } });
  if (!variant) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy biến thể sản phẩm');
  }

  await variant.update(payload);
  await invalidateProductCache();
  return variant;
};

const deleteVariant = async (productId, variantId) => {
  const variant = await ProductVariant.findOne({ where: { id: variantId, productId } });
  if (!variant) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy biến thể sản phẩm');
  }

  const totalVariants = await ProductVariant.count({ where: { productId } });
  if (totalVariants <= 1) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Sản phẩm phải có ít nhất 1 biến thể');
  }

  await variant.destroy();
  await invalidateProductCache();
};

module.exports = {
  listProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  invalidateProductCache,
};
