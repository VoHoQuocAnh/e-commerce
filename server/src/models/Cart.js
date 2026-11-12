// server/src/models/Cart.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      field: 'user_id',
    },
  },
  {
    tableName: 'carts',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Cart;
