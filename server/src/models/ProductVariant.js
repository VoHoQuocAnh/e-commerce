// server/src/models/ProductVariant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProductVariant = sequelize.define(
  'ProductVariant',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    sku: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    size: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    colorHex: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'color_hex',
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    stockQuantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'stock_quantity',
    },
  },
  {
    tableName: 'product_variants',
    timestamps: true,
    underscored: true,
  }
);

module.exports = ProductVariant;
