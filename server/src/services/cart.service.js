// server/src/services/cart.service.js
const { Cart, CartItem, ProductVariant, Product, ProductImage } = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');

const getOrCreateCart = async (userId) => {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId },
  });
  return cart;
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [
      {
        model: ProductVariant,
        as: 'variant',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'isActive', 'basePrice', 'salePrice'],
            include: [
              {
                model: ProductImage,
                as: 'images',
                attributes: ['id', 'imageUrl', 'isThumbnail'],
                separate: true,
                order: [
                  ['is_thumbnail', 'DESC'],
                  ['sort_order', 'ASC'],
                ],
              },
            ],
          },
        ],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  let subtotalAmount = 0;
  let totalQuantity = 0;

  const formattedItems = items.map((item) => {
    const unitPrice = Number(item.variant?.price || 0);
    const lineTotal = unitPrice * item.quantity;
    subtotalAmount += lineTotal;
    totalQuantity += item.quantity;
    return {
      id: item.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      variant: item.variant,
    };
  });

  return {
    id: cart.id,
    items: formattedItems,
    totalQuantity,
    subtotalAmount,
  };
};

const addItem = async (userId, { productVariantId, quantity }) => {
  const variant = await ProductVariant.findByPk(productVariantId, {
    include: [{ model: Product, as: 'product' }],
  });

  if (!variant || !variant.product || !variant.product.isActive) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Sản phẩm hoặc biến thể không tồn tại');
  }

  if (variant.stockQuantity < quantity) {
    throw new ApiError(
      HTTP_CODES.BAD_REQUEST,
      `Số lượng tồn kho không đủ (chỉ còn ${variant.stockQuantity} sản phẩm)`
    );
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = await CartItem.findOne({
    where: { cartId: cart.id, productVariantId },
  });

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (variant.stockQuantity < newQty) {
      throw new ApiError(
        HTTP_CODES.BAD_REQUEST,
        `Tổng số lượng trong giỏ vượt quá tồn kho (${variant.stockQuantity})`
      );
    }
    existingItem.quantity = newQty;
    await existingItem.save();
  } else {
    await CartItem.create({
      cartId: cart.id,
      productVariantId,
      quantity,
    });
  }

  return getCart(userId);
};

const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({
    where: { id: itemId, cartId: cart.id },
    include: [{ model: ProductVariant, as: 'variant' }],
  });

  if (!item) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy sản phẩm trong giỏ hàng');
  }

  if (item.variant.stockQuantity < quantity) {
    throw new ApiError(
      HTTP_CODES.BAD_REQUEST,
      `Số lượng tồn kho chỉ còn ${item.variant.stockQuantity}`
    );
  }

  item.quantity = quantity;
  await item.save();
  return getCart(userId);
};

const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const deleted = await CartItem.destroy({
    where: { id: itemId, cartId: cart.id },
  });
  if (!deleted) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy sản phẩm trong giỏ hàng');
  }
  return getCart(userId);
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await CartItem.destroy({ where: { cartId: cart.id } });
  return getCart(userId);
};

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};
