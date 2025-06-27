'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      });
      
      OrderItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  OrderItem.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    selectedOptions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Selected size, color, or other product options'
    },
    customNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Custom notes for this specific item'
    }
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_item',
    hooks: {
      beforeCreate: (orderItem) => {
        // Calculate total price if not provided
        if (!orderItem.totalPrice) {
          orderItem.totalPrice = orderItem.unitPrice * orderItem.quantity;
        }
      },
      beforeUpdate: (orderItem) => {
        // Recalculate total price if quantity or unit price changes
        if (orderItem.changed('quantity') || orderItem.changed('unitPrice')) {
          orderItem.totalPrice = orderItem.unitPrice * orderItem.quantity;
        }
      }
    }
  });
  return OrderItem;
}; 