// server/src/models/CartItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CartItem = sequelize.define(
  'CartItem',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'cart_id',
    },
    productVariantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'product_variant_id',
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['cart_id', 'product_variant_id'],
      },
    ],
  }
);

module.exports = CartItem;
