// server/src/models/Payment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { PAYMENT_METHODS, PAYMENT_TX_STATUS } = require('../constants/paymentStatus');

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'order_id',
    },
    provider: {
      type: DataTypes.ENUM(PAYMENT_METHODS.COD, PAYMENT_METHODS.MOMO),
      allowNull: false,
    },
    requestId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'request_id',
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'transaction_id',
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        PAYMENT_TX_STATUS.PENDING,
        PAYMENT_TX_STATUS.SUCCESS,
        PAYMENT_TX_STATUS.FAILED,
        PAYMENT_TX_STATUS.REFUNDED
      ),
      allowNull: false,
      defaultValue: PAYMENT_TX_STATUS.PENDING,
    },
    payUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'pay_url',
    },
    resultCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'result_code',
    },
    rawResponse: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'raw_response',
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'paid_at',
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Payment;
