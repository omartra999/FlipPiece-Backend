'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartItem.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        as: 'cart'
      });
      CartItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  CartItem.init({
    cartId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    options: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cartItem',
  });
  return CartItem;
};