// server/src/migrations/20261110000011-create-order-items.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      product_variant_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'product_variants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      product_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      thumbnail_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      sku: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      size: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      unit_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      total_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
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

    await queryInterface.addIndex('order_items', ['order_id']);
    await queryInterface.addIndex('order_items', ['product_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('order_items');
  },
};
