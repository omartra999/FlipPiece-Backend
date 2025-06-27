'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firebaseUid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'user',
          key: 'firebaseUid'
        },
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      shippingAddress: {
        type: Sequelize.JSON,
        allowNull: false
      },
      billingAddress: {
        type: Sequelize.JSON,
        allowNull: false
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      shippingCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending'
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estimatedDelivery: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trackingNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order');
  }
};