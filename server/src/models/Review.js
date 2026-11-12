// server/src/models/Review.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'order_id',
    },
    rating: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_approved',
    },
  },
  {
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Review;
