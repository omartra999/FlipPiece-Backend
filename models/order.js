'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'firebaseUid',
        targetKey: 'firebaseUid',
        as: 'user',
        required: false,
      });
      
      // Remove OrderItem association since we're using JSON
    }
  }
  Order.init({
    firebaseUid: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'user',
        key: 'firebaseUid'
      }
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: true
    },
    billingAddress: {
      type: DataTypes.JSON,
      allowNull: true
    },
    // Store items as JSON
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // DHL fields
    dhlShipmentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shippingService: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Stripe fields
    stripeSessionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isGuest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'order',
    hooks: {
      beforeCreate: async (order, options) => {
        // Generate order number
        if (!order.orderNumber) {
          const timestamp = Date.now().toString().slice(-8);
          const random = Math.random().toString(36).substr(2, 4).toUpperCase();
          order.orderNumber = `FP-${timestamp}-${random}`;
        }
        
        // Set guest status
        order.isGuest = !order.firebaseUid;
        
        // Calculate totals if not provided
        if (order.items && order.items.length > 0) {
          order.subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          order.total = parseFloat(order.subtotal) + parseFloat(order.shippingCost || 0) + parseFloat(order.tax || 0);
        }
      }
    }
  });
  return Order;
};