// server/src/services/payment.service.js
const crypto = require('crypto');
const axios = require('axios');
const {
  sequelize,
  Order,
  OrderItem,
  Payment,
  ProductVariant,
  Coupon,
} = require('../models');
const momoConfig = require('../config/momo');
const HTTP_CODES = require('../constants/httpCodes');
const { ORDER_STATUS } = require('../constants/orderStatus');
const {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  PAYMENT_TX_STATUS,
} = require('../constants/paymentStatus');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const signHmacSha256 = (rawSignature) => {
  return crypto.createHmac('sha256', momoConfig.secretKey).update(rawSignature).digest('hex');
};

const verifyTimingSafe = (sigA, sigB) => {
  if (!sigA || !sigB || sigA.length !== sigB.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sigA, 'utf8'), Buffer.from(sigB, 'utf8'));
};

const buildMomoCallbackSignature = (payload) => {
  const {
    amount,
    extraData = '',
    message = '',
    orderId,
    orderInfo = '',
    orderType = '',
    partnerCode,
    payType = '',
    requestId,
    responseTime,
    resultCode,
    transId,
  } = payload;

  const rawSignature =
    `accessKey=${momoConfig.accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&message=${message}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&orderType=${orderType}` +
    `&partnerCode=${partnerCode}` +
    `&payType=${payType}` +
    `&requestId=${requestId}` +
    `&responseTime=${responseTime}` +
    `&resultCode=${resultCode}` +
    `&transId=${transId}`;

  return signHmacSha256(rawSignature);
};

const createMomoPaymentForOrder = async (orderId, userId = null) => {
  const where = { id: orderId };
  if (userId) where.userId = userId;

  const order = await Order.findOne({ where });
  if (!order) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy đơn hàng');
  }
  if (order.paymentMethod !== PAYMENT_METHODS.MOMO) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Đơn hàng không sử dụng phương thức MoMo');
  }
  if (order.orderStatus !== ORDER_STATUS.PENDING_PAYMENT) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Đơn hàng không ở trạng thái chờ thanh toán');
  }
  if (order.expiredAt && new Date(order.expiredAt) < new Date()) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Đơn hàng đã quá hạn thanh toán');
  }

  const amount = Math.round(Number(order.totalAmount));
  const requestId = `${order.orderCode}-${Date.now()}`;
  const momoOrderId = requestId;
  const orderInfo = `Thanh toan don hang ${order.orderCode} tai CALEM STUDIO`;
  const extraData = Buffer.from(JSON.stringify({ orderCode: order.orderCode })).toString('base64');

  const rawSignature =
    `accessKey=${momoConfig.accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${momoConfig.ipnUrl}` +
    `&orderId=${momoOrderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${momoConfig.partnerCode}` +
    `&redirectUrl=${momoConfig.redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${momoConfig.requestType}`;

  const signature = signHmacSha256(rawSignature);

  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    accessKey: momoConfig.accessKey,
    requestId,
    amount,
    orderId: momoOrderId,
    orderInfo,
    redirectUrl: momoConfig.redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    extraData,
    requestType: momoConfig.requestType,
    signature,
    lang: momoConfig.lang,
  };

  let responseData;
  try {
    const response = await axios.post(momoConfig.endpoint, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    responseData = response.data;
  } catch (error) {
    logger.error('MoMo API error:', error.response?.data || error.message);
    throw new ApiError(
      HTTP_CODES.BAD_GATEWAY,
      'Không thể kết nối cổng thanh toán MoMo Sandbox, vui lòng thử lại'
    );
  }

  if (Number(responseData.resultCode) !== 0 || !responseData.payUrl) {
    logger.error('MoMo rejected payment creation:', responseData);
    throw new ApiError(
      HTTP_CODES.BAD_GATEWAY,
      responseData.message || 'Tạo giao dịch MoMo thất bại'
    );
  }

  const payment = await Payment.create({
    orderId: order.id,
    provider: PAYMENT_METHODS.MOMO,
    requestId,
    amount,
    status: PAYMENT_TX_STATUS.PENDING,
    payUrl: responseData.payUrl,
    rawResponse: responseData,
  });

  return {
    payment,
    payUrl: responseData.payUrl,
    deeplink: responseData.deeplink || null,
    qrCodeUrl: responseData.qrCodeUrl || null,
  };
};

const restoreOrderInventory = async (order, transaction) => {
  const items = await OrderItem.findAll({
    where: { orderId: order.id },
    transaction,
  });

  const sortedItems = [...items].sort((a, b) => a.productVariantId - b.productVariantId);
  for (const item of sortedItems) {
    const variant = await ProductVariant.findByPk(item.productVariantId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    if (variant) {
      await variant.increment('stockQuantity', { by: item.quantity, transaction });
    }
  }

  if (order.couponId) {
    const coupon = await Coupon.findByPk(order.couponId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    if (coupon && coupon.usedCount > 0) {
      await coupon.decrement('usedCount', { by: 1, transaction });
    }
  }
};

const handleMomoIpn = async (payload) => {
  const expectedSignature = buildMomoCallbackSignature(payload);
  if (!verifyTimingSafe(payload.signature, expectedSignature)) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Chữ ký MoMo IPN không hợp lệ');
  }

  const { requestId, transId, resultCode, amount } = payload;

  return sequelize.transaction(async (t) => {
    const payment = await Payment.findOne({
      where: { requestId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!payment) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy giao dịch thanh toán');
    }

    const order = await Order.findByPk(payment.orderId, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!order) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy đơn hàng');
    }

    // Idempotent check: ignore duplicate IPN callbacks
    if (
      payment.status !== PAYMENT_TX_STATUS.PENDING ||
      order.paymentStatus === PAYMENT_STATUS.PAID
    ) {
      return { alreadyProcessed: true, orderCode: order.orderCode };
    }

    if (Math.round(Number(payment.amount)) !== Math.round(Number(amount))) {
      throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Số tiền thanh toán không khớp');
    }

    if (Number(resultCode) === 0) {
      await payment.update(
        {
          status: PAYMENT_TX_STATUS.SUCCESS,
          transactionId: transId ? String(transId) : null,
          resultCode: 0,
          rawResponse: payload,
          paidAt: new Date(),
        },
        { transaction: t }
      );

      await order.update(
        {
          paymentStatus: PAYMENT_STATUS.PAID,
          orderStatus:
            order.orderStatus === ORDER_STATUS.PENDING_PAYMENT
              ? ORDER_STATUS.PENDING_CONFIRMATION
              : order.orderStatus,
          expiredAt: null,
        },
        { transaction: t }
      );
    } else {
      await payment.update(
        {
          status: PAYMENT_TX_STATUS.FAILED,
          transactionId: transId ? String(transId) : null,
          resultCode: Number(resultCode),
          rawResponse: payload,
        },
        { transaction: t }
      );

      if (order.orderStatus === ORDER_STATUS.PENDING_PAYMENT) {
        await order.update(
          {
            paymentStatus: PAYMENT_STATUS.FAILED,
            orderStatus: ORDER_STATUS.CANCELLED,
            cancelReason: payload.message || 'Thanh toán MoMo thất bại hoặc bị hủy',
            expiredAt: null,
          },
          { transaction: t }
        );
        await restoreOrderInventory(order, t);
      }
    }

    return {
      alreadyProcessed: false,
      orderCode: order.orderCode,
      success: Number(resultCode) === 0,
    };
  });
};

const verifyMomoRedirect = async (query) => {
  const expectedSignature = buildMomoCallbackSignature(query);
  if (!verifyTimingSafe(query.signature, expectedSignature)) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Chữ ký phản hồi MoMo không hợp lệ');
  }

  // Fallback sync if IPN hasn't arrived yet (useful on localhost without public IPN tunnel)
  const ipnResult = await handleMomoIpn(query).catch((err) => {
    logger.warn('Redirect fallback sync warning:', err.message);
    return null;
  });

  const payment = await Payment.findOne({
    where: { requestId: query.requestId },
    include: [{ model: Order, as: 'order' }],
  });

  return {
    isSuccess: Number(query.resultCode) === 0,
    resultCode: Number(query.resultCode),
    message: query.message,
    orderCode: payment?.order?.orderCode || ipnResult?.orderCode || null,
    amount: Number(query.amount || 0),
    transId: query.transId || null,
  };
};

module.exports = {
  createMomoPaymentForOrder,
  handleMomoIpn,
  verifyMomoRedirect,
  restoreOrderInventory,
  buildMomoCallbackSignature,
};
