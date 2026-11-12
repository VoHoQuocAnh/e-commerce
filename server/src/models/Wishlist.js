// server/src/models/Wishlist.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Wishlist = sequelize.define(
  'Wishlist',
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
  },
  {
    tableName: 'wishlists',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id'],
      },
    ],
  }
);

module.exports = Wishlist;
