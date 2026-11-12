// server/src/services/order.service.js
const { Op } = require('sequelize');
const {
  sequelize,
  Order,
  OrderItem,
  Cart,
  CartItem,
  ProductVariant,
  Product,
  ProductImage,
  Address,
  Coupon,
  Payment,
  User,
} = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const { ORDER_STATUS, VALID_ORDER_TRANSITIONS } = require('../constants/orderStatus');
const {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  PAYMENT_TX_STATUS,
} = require('../constants/paymentStatus');
const ROLES = require('../constants/roles');
const ApiError = require('../utils/ApiError');
const generateOrderCode = require('../utils/generateOrderCode');
const couponService = require('./coupon.service');
const paymentService = require('./payment.service');
const productService = require('./product.service');
const logger = require('../utils/logger');

const FREE_SHIPPING_THRESHOLD = 500000;
const STANDARD_SHIPPING_FEE = 30000;
const MOMO_PAYMENT_TIMEOUT_MINUTES = 15;

const resolveShippingInfo = async (userId, payload, transaction) => {
  if (payload.addressId) {
    const addr = await Address.findOne({
      where: { id: payload.addressId, userId },
      transaction,
    });
    if (!addr) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, 'Địa chỉ giao hàng không tồn tại');
    }
    return {
      recipientName: addr.recipientName,
      recipientPhone: addr.recipientPhone,
      shippingAddress: `${addr.streetAddress}, ${addr.ward}, ${addr.district}, ${addr.province}`,
    };
  }

  if (!payload.recipientName || !payload.recipientPhone || !payload.shippingAddress) {
    throw new ApiError(
      HTTP_CODES.BAD_REQUEST,
      'Vui lòng chọn địa chỉ có sẵn hoặc nhập đầy đủ thông tin người nhận'
    );
  }

  return {
    recipientName: payload.recipientName,
    recipientPhone: payload.recipientPhone,
    shippingAddress: payload.shippingAddress,
  };
};

const createOrder = async (userId, payload) => {
  const createdOrder = await sequelize.transaction(async (t) => {
    const shipping = await resolveShippingInfo(userId, payload, t);

    const cart = await Cart.findOne({ where: { userId }, transaction: t });
    if (!cart) {
      throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Giỏ hàng trống');
    }

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      transaction: t,
    });

    if (cartItems.length === 0) {
      throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Giỏ hàng của bạn đang trống');
    }

    // Lock variants in deterministic ascending order to avoid deadlocks
    const sortedCartItems = [...cartItems].sort(
      (a, b) => a.productVariantId - b.productVariantId
    );

    let subtotalAmount = 0;
    const orderItemsPayload = [];

    for (const cartItem of sortedCartItems) {
      const variant = await ProductVariant.findByPk(cartItem.productVariantId, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!variant) {
        throw new ApiError(HTTP_CODES.NOT_FOUND, 'Một số sản phẩm trong giỏ không còn tồn tại');
      }

      const product = await Product.findByPk(variant.productId, {
        include: [
          {
            model: ProductImage,
            as: 'images',
            attributes: ['imageUrl', 'isThumbnail'],
          },
        ],
        transaction: t,
      });

      if (!product || !product.isActive) {
        throw new ApiError(
          HTTP_CODES.BAD_REQUEST,
          `Sản phẩm ${product?.name || ''} hiện ngừng kinh doanh`
        );
      }

      if (variant.stockQuantity < cartItem.quantity) {
        throw new ApiError(
          HTTP_CODES.CONFLICT,
          `Sản phẩm "${product.name}" (${variant.color} - ${variant.size}) chỉ còn ${variant.stockQuantity} sản phẩm`
        );
      }

      // Deduct stock inside row lock
      await variant.decrement('stockQuantity', { by: cartItem.quantity, transaction: t });

      const unitPrice = Number(variant.price);
      const lineTotal = unitPrice * cartItem.quantity;
      subtotalAmount += lineTotal;

      const thumb =
        product.images?.find((img) => img.isThumbnail)?.imageUrl ||
        product.images?.[0]?.imageUrl ||
        null;

      orderItemsPayload.push({
        productId: product.id,
        productVariantId: variant.id,
        productName: product.name,
        thumbnailUrl: thumb,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        unitPrice,
        quantity: cartItem.quantity,
        totalPrice: lineTotal,
      });
    }

    // Apply coupon with lock
    let couponId = null;
    let discountAmount = 0;
    if (payload.couponCode) {
      const coupon = await Coupon.findOne({
        where: { code: payload.couponCode.trim().toUpperCase() },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      discountAmount = couponService.calculateCouponDiscount(coupon, subtotalAmount);
      couponId = coupon.id;
      await coupon.increment('usedCount', { by: 1, transaction: t });
    }

    const shippingFee = subtotalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const totalAmount = Math.max(0, subtotalAmount + shippingFee - discountAmount);

    const isMomo = payload.paymentMethod === PAYMENT_METHODS.MOMO;
    const orderCode = generateOrderCode();

    const order = await Order.create(
      {
        orderCode,
        userId,
        couponId,
        recipientName: shipping.recipientName,
        recipientPhone: shipping.recipientPhone,
        shippingAddress: shipping.shippingAddress,
        note: payload.note || null,
        subtotalAmount,
        shippingFee,
        discountAmount,
        totalAmount,
        paymentMethod: payload.paymentMethod,
        paymentStatus: PAYMENT_STATUS.PENDING,
        orderStatus: isMomo ? ORDER_STATUS.PENDING_PAYMENT : ORDER_STATUS.PENDING_CONFIRMATION,
        expiredAt: isMomo
          ? new Date(Date.now() + MOMO_PAYMENT_TIMEOUT_MINUTES * 60 * 1000)
          : null,
      },
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      orderItemsPayload.map((item) => ({ ...item, orderId: order.id })),
      { transaction: t }
    );

    if (!isMomo) {
      await Payment.create(
        {
          orderId: order.id,
          provider: PAYMENT_METHODS.COD,
          requestId: orderCode,
          amount: totalAmount,
          status: PAYMENT_TX_STATUS.PENDING,
        },
        { transaction: t }
      );
    }

    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
    return order;
  });

  await productService.invalidateProductCache();

  let momoPayment = null;
  if (createdOrder.paymentMethod === PAYMENT_METHODS.MOMO) {
    try {
      momoPayment = await paymentService.createMomoPaymentForOrder(createdOrder.id, userId);
    } catch (error) {
      // Compensating rollback if MoMo gateway cannot be reached
      await sequelize.transaction(async (t) => {
        const orderToCancel = await Order.findByPk(createdOrder.id, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        if (orderToCancel && orderToCancel.orderStatus === ORDER_STATUS.PENDING_PAYMENT) {
          await orderToCancel.update(
            {
              orderStatus: ORDER_STATUS.CANCELLED,
              paymentStatus: PAYMENT_STATUS.FAILED,
              cancelReason: 'Không thể khởi tạo giao dịch MoMo',
              expiredAt: null,
            },
            { transaction: t }
          );
          await paymentService.restoreOrderInventory(orderToCancel, t);
        }
      });
      await productService.invalidateProductCache();
      throw error;
    }
  }

  const fullOrder = await getOrderByCode(createdOrder.orderCode, { id: userId, role: ROLES.USER });
  return {
    order: fullOrder,
    payUrl: momoPayment?.payUrl || null,
  };
};

const getMyOrders = async (userId, { page = 1, limit = 10, status }) => {
  const where = { userId };
  if (status) where.orderStatus = status;

  const offset = (Number(page) - 1) * Number(limit);
  const { rows, count } = await Order.findAndCountAll({
    where,
    include: [
      { model: OrderItem, as: 'items' },
      { model: Payment, as: 'payments', attributes: ['id', 'provider', 'status', 'payUrl', 'paidAt'] },
    ],
    distinct: true,
    limit: Number(limit),
    offset,
    order: [['created_at', 'DESC']],
  });

  return {
    items: rows,
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
    },
  };
};

const getOrderByCode = async (orderCode, currentUser) => {
  const order = await Order.findOne({
    where: { orderCode },
    include: [
      { model: OrderItem, as: 'items' },
      { model: Payment, as: 'payments' },
      { model: Coupon, as: 'coupon', attributes: ['id', 'code', 'discountType', 'discountValue'] },
      { model: User, as: 'user', attributes: ['id', 'fullName', 'email', 'phone'] },
    ],
  });

  if (!order) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy đơn hàng');
  }

  if (order.userId !== currentUser.id && currentUser.role !== ROLES.ADMIN) {
    throw new ApiError(HTTP_CODES.FORBIDDEN, 'Bạn không có quyền xem đơn hàng này');
  }

  return order;
};

const cancelOrderByUser = async (userId, orderCode, reason) => {
  const updated = await sequelize.transaction(async (t) => {
    const order = await Order.findOne({
      where: { orderCode, userId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!order) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy đơn hàng');
    }

    const cancellable = [ORDER_STATUS.PENDING_PAYMENT, ORDER_STATUS.PENDING_CONFIRMATION];
    if (!cancellable.includes(order.orderStatus)) {
      throw new ApiError(
        HTTP_CODES.BAD_REQUEST,
        'Chỉ có thể hủy đơn hàng khi chưa chuyển sang trạng thái giao hàng'
      );
    }

    await order.update(
      {
        orderStatus: ORDER_STATUS.CANCELLED,
        cancelReason: reason,
        expiredAt: null,
      },
      { transaction: t }
    );

    await paymentService.restoreOrderInventory(order, t);
    return order;
  });

  await productService.invalidateProductCache();
  return updated;
};

const listAllOrdersAdmin = async ({ page = 1, limit = 15, status, q }) => {
  const where = {};
  if (status) where.orderStatus = status;
  if (q) {
    where[Op.or] = [
      { orderCode: { [Op.like]: `%${q}%` } },
      { recipientName: { [Op.like]: `%${q}%` } },
      { recipientPhone: { [Op.like]: `%${q}%` } },
    ];
  }

  const offset = (Number(page) - 1) * Number(limit);
  const { rows, count } = await Order.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'fullName', 'email'] },
      { model: OrderItem, as: 'items' },
    ],
    distinct: true,
    limit: Number(limit),
    offset,
    order: [['created_at', 'DESC']],
  });

  return {
    items: rows,
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
    },
  };
};

const updateOrderStatusAdmin = async (orderId, { orderStatus: nextStatus, cancelReason }) => {
  const updated = await sequelize.transaction(async (t) => {
    const order = await Order.findByPk(orderId, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!order) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy đơn hàng');
    }

    const allowed = VALID_ORDER_TRANSITIONS[order.orderStatus] || [];
    if (!allowed.includes(nextStatus)) {
      throw new ApiError(
        HTTP_CODES.BAD_REQUEST,
        `Không thể chuyển trạng thái từ "${order.orderStatus}" sang "${nextStatus}"`
      );
    }

    const updatePayload = {
      orderStatus: nextStatus,
      expiredAt: null,
    };

    if (nextStatus === ORDER_STATUS.CANCELLED) {
      updatePayload.cancelReason = cancelReason || 'Quản trị viên hủy đơn hàng';
      await paymentService.restoreOrderInventory(order, t);
    }

    if (nextStatus === ORDER_STATUS.COMPLETED) {
      if (order.paymentMethod === PAYMENT_METHODS.COD) {
        updatePayload.paymentStatus = PAYMENT_STATUS.PAID;
        await Payment.update(
          { status: PAYMENT_TX_STATUS.SUCCESS, paidAt: new Date() },
          { where: { orderId: order.id }, transaction: t }
        );
      }

      const items = await OrderItem.findAll({ where: { orderId: order.id }, transaction: t });
      for (const item of items) {
        await Product.increment('soldCount', {
          by: item.quantity,
          where: { id: item.productId },
          transaction: t,
        });
      }
    }

    await order.update(updatePayload, { transaction: t });
    return order;
  });

  await productService.invalidateProductCache();
  return updated;
};

const cancelExpiredOrders = async () => {
  const now = new Date();
  const expiredOrders = await Order.findAll({
    where: {
      orderStatus: ORDER_STATUS.PENDING_PAYMENT,
      expiredAt: { [Op.lt]: now },
    },
    attributes: ['id', 'orderCode'],
  });

  if (expiredOrders.length === 0) return 0;

  let processedCount = 0;
  for (const ord of expiredOrders) {
    try {
      await sequelize.transaction(async (t) => {
        const lockedOrder = await Order.findByPk(ord.id, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        if (!lockedOrder || lockedOrder.orderStatus !== ORDER_STATUS.PENDING_PAYMENT) {
          return;
        }

        await lockedOrder.update(
          {
            orderStatus: ORDER_STATUS.CANCELLED,
            paymentStatus: PAYMENT_STATUS.FAILED,
            cancelReason: 'Quá thời hạn thanh toán MoMo (15 phút)',
            expiredAt: null,
          },
          { transaction: t }
        );

        await Payment.update(
          { status: PAYMENT_TX_STATUS.FAILED },
          {
            where: { orderId: lockedOrder.id, status: PAYMENT_TX_STATUS.PENDING },
            transaction: t,
          }
        );

        await paymentService.restoreOrderInventory(lockedOrder, t);
        processedCount += 1;
      });
    } catch (err) {
      logger.error(`Failed to cancel expired order ${ord.orderCode}:`, err);
    }
  }

  if (processedCount > 0) {
    await productService.invalidateProductCache();
    logger.info(`[OrderExpirationJob] Cancelled ${processedCount} expired MoMo orders & restored stock.`);
  }
  return processedCount;
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderByCode,
  cancelOrderByUser,
  listAllOrdersAdmin,
  updateOrderStatusAdmin,
  cancelExpiredOrders,
};
