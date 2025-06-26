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

    }
  }
  Order.init({
    firebaseUid: DataTypes.STRING,
    shippingAddress: DataTypes.JSON,
    billingAddress: DataTypes.JSON,
    total: DataTypes.DECIMAL,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'order',
  });
  return Order;
};