'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: 'firebaseUid',
        targetKey: 'firebaseUid',
        as: 'user'
      });
      
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items'
      });
    }
  }
  Order.init({
    firebaseUid: {
      type: DataTypes.STRING,
      allowNull: false,
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
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false
    },
    billingAddress: {
      type: DataTypes.JSON,
      allowNull: false
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'order',
    hooks: {
      beforeCreate: async (order, options) => {
        console.log('beforeCreate hook triggered for Order');
        console.log('Current orderNumber:', order.orderNumber);
        
        // Generate order number if not provided
        if (!order.orderNumber) {
          const timestamp = Date.now().toString().slice(-8);
          const random = Math.random().toString(36).substr(2, 4).toUpperCase();
          order.orderNumber = `FP-${timestamp}-${random}`;
          console.log('Generated orderNumber:', order.orderNumber);
        }
      }
    }
  });
  return Order;
};