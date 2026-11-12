// server/src/models/ProductImage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProductImage = sequelize.define(
  'ProductImage',
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
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'image_url',
    },
    publicId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'public_id',
    },
    colorRef: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'color_ref',
    },
    isThumbnail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_thumbnail',
    },
    sortOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
  },
  {
    tableName: 'product_images',
    timestamps: true,
    underscored: true,
  }
);

module.exports = ProductImage;
