// server/src/models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define(
  'OrderItem',
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
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    productVariantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'product_variant_id',
    },
    productName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'product_name',
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'thumbnail_url',
    },
    sku: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'unit_price',
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'total_price',
    },
  },
  {
    tableName: 'order_items',
    timestamps: true,
    underscored: true,
  }
);

module.exports = OrderItem;
