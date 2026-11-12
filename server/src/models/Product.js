// server/src/models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'category_id',
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(220),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    basePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'base_price',
    },
    salePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'sale_price',
    },
    gender: {
      type: DataTypes.ENUM('men', 'women', 'unisex'),
      allowNull: false,
      defaultValue: 'unisex',
    },
    ratingAvg: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'rating_avg',
    },
    ratingCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'rating_count',
    },
    soldCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'sold_count',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_featured',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'products',
    timestamps: true,
    paranoid: true,
    underscored: true,
    deletedAt: 'deleted_at',
  }
);

module.exports = Product;
