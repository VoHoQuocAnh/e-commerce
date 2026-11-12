// server/src/migrations/20261110000008-create-cart-items.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cart_items', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      cart_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'carts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_variant_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'product_variants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
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

    await queryInterface.addIndex('cart_items', ['cart_id', 'product_variant_id'], {
      unique: true,
      name: 'uq_cart_items_cart_variant',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cart_items');
  },
};
