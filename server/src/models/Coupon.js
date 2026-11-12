// server/src/models/Coupon.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coupon = sequelize.define(
  'Coupon',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discountType: {
      type: DataTypes.ENUM('percent', 'fixed'),
      allowNull: false,
      field: 'discount_type',
    },
    discountValue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'discount_value',
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'min_order_amount',
    },
    maxDiscountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'max_discount_amount',
    },
    usageLimit: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 100,
      field: 'usage_limit',
    },
    usedCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'used_count',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_date',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'coupons',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Coupon;
