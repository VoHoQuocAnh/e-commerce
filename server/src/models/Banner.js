// server/src/models/Banner.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Banner = sequelize.define(
  'Banner',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    linkUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'link_url',
    },
    sortOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'banners',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Banner;
