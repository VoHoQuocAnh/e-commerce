// server/src/migrations/20261110000005-create-product-variants.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_variants', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sku: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true,
      },
      size: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      color_hex: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      stock_quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex('product_variants', ['product_id']);
    await queryInterface.addIndex('product_variants', ['size']);
    await queryInterface.addIndex('product_variants', ['color']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_variants');
  },
};
