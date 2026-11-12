// server/src/models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'parent_id',
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'image_url',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'categories',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Category;
