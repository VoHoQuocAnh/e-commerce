// server/src/models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { ORDER_STATUS } = require('../constants/orderStatus');
const { PAYMENT_METHODS, PAYMENT_STATUS } = require('../constants/paymentStatus');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'order_code',
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    couponId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'coupon_id',
    },
    recipientName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'recipient_name',
    },
    recipientPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'recipient_phone',
    },
    shippingAddress: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'shipping_address',
    },
    note: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    subtotalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'subtotal_amount',
    },
    shippingFee: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'shipping_fee',
    },
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'discount_amount',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'total_amount',
    },
    paymentMethod: {
      type: DataTypes.ENUM(PAYMENT_METHODS.COD, PAYMENT_METHODS.MOMO),
      allowNull: false,
      field: 'payment_method',
    },
    paymentStatus: {
      type: DataTypes.ENUM(
        PAYMENT_STATUS.PENDING,
        PAYMENT_STATUS.PAID,
        PAYMENT_STATUS.FAILED,
        PAYMENT_STATUS.REFUNDED
      ),
      allowNull: false,
      defaultValue: PAYMENT_STATUS.PENDING,
      field: 'payment_status',
    },
    orderStatus: {
      type: DataTypes.ENUM(
        ORDER_STATUS.PENDING_PAYMENT,
        ORDER_STATUS.PENDING_CONFIRMATION,
        ORDER_STATUS.SHIPPING,
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.CANCELLED
      ),
      allowNull: false,
      defaultValue: ORDER_STATUS.PENDING_CONFIRMATION,
      field: 'order_status',
    },
    cancelReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'cancel_reason',
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expired_at',
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Order;
