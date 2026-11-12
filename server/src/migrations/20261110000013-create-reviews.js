// server/src/migrations/20261110000013-create-reviews.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      rating: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex('reviews', ['product_id']);
    await queryInterface.addIndex('reviews', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reviews');
  },
};
