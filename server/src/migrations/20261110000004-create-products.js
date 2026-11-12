// server/src/migrations/20261110000004-create-products.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(220),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      base_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      sale_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('men', 'women', 'unisex'),
        allowNull: false,
        defaultValue: 'unisex',
      },
      rating_avg: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      rating_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      sold_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['name']);
    await queryInterface.addIndex('products', ['base_price']);
    await queryInterface.addIndex('products', ['sale_price']);
    await queryInterface.addIndex('products', ['gender']);
    await queryInterface.addIndex('products', ['rating_avg']);
    await queryInterface.addIndex('products', ['sold_count']);
    await queryInterface.addIndex('products', ['is_featured', 'is_active']);
    await queryInterface.addIndex('products', ['deleted_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products');
  },
};
