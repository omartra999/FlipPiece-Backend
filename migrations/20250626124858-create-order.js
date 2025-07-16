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
        allowNull: true, 
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
      // Customer information (for guest checkout)
      customerEmail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customerPhone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Addresses (filled by Stripe webhook)
      shippingAddress: {
        type: Sequelize.JSON,
        allowNull: true
      },
      billingAddress: {
        type: Sequelize.JSON,
        allowNull: true
      },
      // Items stored as JSON
      items: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      // Financial calculations
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
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'EUR'
      },
      // Order status
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
      // DHL integration fields
      dhlShipmentId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      trackingNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      estimatedDelivery: {
        type: Sequelize.DATE,
        allowNull: true
      },
      shippingService: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Stripe integration fields
      stripeSessionId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Additional fields
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isGuest: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

    // Add indexes for better performance
    await queryInterface.addIndex('order', ['firebaseUid']);
    await queryInterface.addIndex('order', ['customerEmail']);
    await queryInterface.addIndex('order', ['status']);
    await queryInterface.addIndex('order', ['paymentStatus']);
    await queryInterface.addIndex('order', ['stripeSessionId']);
    await queryInterface.addIndex('order', ['trackingNumber']);
    await queryInterface.addIndex('order', ['createdAt']);

    // Compound indexes for common API queries
    await queryInterface.addIndex('order', ['firebaseUid', 'status']);
    await queryInterface.addIndex('order', ['paymentStatus', 'status']);
    await queryInterface.addIndex('order', ['dhlShipmentId', 'trackingNumber']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order');
  }
};